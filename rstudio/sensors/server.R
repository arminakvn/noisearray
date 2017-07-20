function(input, output, session) {
  #  =========== leaflet ============
  
  contour_par <- reactive({
    cat(chng <- input$atab)
    start <- input$Time
    # start <- ymd_hms(input$Time, tz = "US/Pacific")
    attr(start, "tzone") <- "US/Pacific"
    end <- start + 59
    slice <- dat[dat$time >=start & dat$time <=end & dat$component==input$component,]
    pts <- slice
    coordinates(slice) = ~Longitude + Latitude
    idw <- krige(formula = db ~ 1,
                 locations = slice,
                 newdata = grd)
    r = raster(idw, "var1.pred")
    contour <- rasterToContour(r, levels = seq(min(idw$var1.pred),max(idw$var1.pred),by = 2))
    
    if(input$component %in% c("Lmindba", "Leqdba", "Lmaxdba") ) {
      colr <- "YlGnBu"
    } else {
      colr <- "YlOrRd"
    }
    return(list(contour, pts, colr))
  })
  
  output$leaflet <- renderLeaflet({
    # cat("draw leaflet\n")
    leaflet(c) %>% setView(lng = -118.2883, lat = 34.09065, zoom = 17) %>% addProviderTiles("CartoDB.DarkMatter") 
  })
  
  observe({
    ret <- contour_par()
    c <- ret[[1]]
    p <- ret[[2]]
    cl <- ret[[3]]
    c$level <- as.numeric(as.character(c$level))
    pal <- colorNumeric(palette = rev(brewer.pal(n = 9,cl)),domain =  c$level)
    p <- merge(devnames,p,by="DeviceId")
    # cat("update leaflet\n")
    leafletProxy("leaflet", data = c ) %>%
      clearShapes() %>% clearControls() %>% clearMarkers() %>% addPolylines(data = c, color = ~pal(level), weight=2, opacity = 100)  %>% 
      addLegend("bottomright", pal = pal, values = ~level,title = p$component[1],  opacity = 1)  %>% 
      addMarkers(data = p,lng =  p$Longitude,lat = p$Latitude, icon=list(iconUrl = "trans.png", iconSize = c(0, 0)), label = as.character(round(p$db)), 
                 labelOptions = labelOptions(noHide = T, textOnly = T, style=list('color'='white','right'='1px', 'top'='4px'))) %>%
      addCircleMarkers(data = p,lng =  p$Longitude,lat = p$Latitude,label=p$name,color = 'white', weight = 2, fillOpacity = 0)
  })
  
  #  =========== dygraph ============
  dygraph_par <- reactive({
    name <-as.character(devnames[devnames$name==input$devid,2])
    comp <- c("Lmindba", "Leqdba", "Lmaxdba", "Base", "Voice", "High")
    
    sub <- dat[dat$component==comp[1] & dat$DeviceId==name,]
    min <- xts(sub$db,sub$time, tzone = "US/Pacific")
    sub <- dat[dat$component==comp[2] & dat$DeviceId==name,]
    eq <- xts(sub$db,sub$time, tzone = "US/Pacific")
    sub <- dat[dat$component==comp[3] & dat$DeviceId==name,]
    max <- xts(sub$db,sub$time, tzone = "US/Pacific")
    loud <- cbind(min,eq,max)
    if (length(loud)>0) {colnames(loud) <- comp[1:3]} 
    
    sub <- dat[dat$component==comp[4] & dat$DeviceId==name,]
    bas <- xts(sub$db,sub$time, tzone = "US/Pacific")
    sub <- dat[dat$component==comp[5] & dat$DeviceId==name,]
    voi <- xts(sub$db,sub$time, tzone = "US/Pacific")
    sub <- dat[dat$component==comp[6] & dat$DeviceId==name,]
    hig <- xts(sub$db,sub$time, tzone = "US/Pacific")
    freq <- cbind(bas,voi,hig)
    if (length(freq)>0) {colnames(freq) <- comp[4:6]}
    
    x <- list(loud,freq)
    return(x)
  })
  
  output$dygraph1 <- renderDygraph({
    tmp <- dygraph_par()
    loud <- tmp[[1]]
    freq <- tmp[[2]]
    
    dygraph(loud, main = "Loudness",xlab = "Time",ylab = "db", group = "dev") %>%
      dyOptions(drawGrid = input$showgrid, colors = scl[1:3], drawPoints = T,strokeWidth = 0.25, pointSize = 2,axisLineColor = "white",axisLabelColor = "white", useDataTimezone = T) %>%
      dyLegend(show = "onmouseover")
    
  })
  output$dygraph2 <- renderDygraph({
    tmp <- dygraph_par()
    loud <- tmp[[1]]
    freq <- tmp[[2]]
    
    dygraph(freq, main = "Frequency",xlab = "Time",ylab = "db", group = "dev") %>%
      dyOptions(drawGrid = input$showgrid, colors = scl[4:6], drawPoints = T,strokeWidth = 0.25, pointSize = 2,axisLineColor = "white",axisLabelColor = "white", useDataTimezone = T) %>%
      dyLegend(show = "onmouseover")
  })
  
  #  =========== matrix ============
  sliderValues <- reactive({
    data.frame(
      Name = c("Time Range"),
      Value = as.character(c(input$slider_datetime)),
      stringsAsFactors=FALSE
    )
  })
  
  selectValues <- reactive({
    if(input$types == "Loudness") {
      scl <-  scale_color_manual(values=c("#0868ac",  "#f0f9e8","#7bccc4"))
      comp <- c("Lmindba", "Leqdba", "Lmaxdba")
    } else {
      scl <-  scale_color_manual(values=c("#bd0026",  "#fd8d3c","#ffffb2"))
      comp <- c("Base", "Voice", "High")
    }
    return(list(scl,comp))
  })
  
  range <- reactiveValues(x = NULL)
  
  observe({
    brush <- input$plot_brush
    if (!is.null(brush)) {
      range$x <- c(as.POSIXct(brush$xmin,origin = "1970-01-01", tz = "UTC"),as.POSIXct(brush$xmax,origin = "1970-01-01", tz = "UTC"))
    } else {
      # range$x <- NULL
    }
  })
  
  observeEvent(input$plot_dblclick, {range$x <- NULL})
  
  output$distPlot <- renderPlot({
    r <- selectValues()
    comp <- r[[2]]
    scl <- r[[1]]
    
    start <- sliderValues()[1, "Value"]
    end <- sliderValues()[2, "Value"]
    attr(start, "tzone") <- "US/Pacific"
    attr(end, "tzone") <- "US/Pacific"
    sub <- prep(dat[dat$component %in% comp,],start,end)
    
    dur <- difftime( max(sub$time), min(sub$time), units = "hours")
    
    if (!is.null(range$x)) {
      dur <- difftime( range$x[2], range$x[1], units = "hours")
    }
    
    q <- ggplot(data= sub, aes(x=time,y=db, color=component)) + facet_grid(lat~lng, as.table = F, labeller=labeller(lat=ro,lng=co)) + scl + 
      labs(x="Time",y="db(A)") + guides(color=guide_legend(title="Legend", override.aes = list(size=3, alpha=1))) + coord_cartesian(xlim = range$x) 
    
    if (dur < 12) { q <- q + geom_point(size=0.5,alpha=0.6) }
    else {q <- q + geom_smooth(se=F, size=0.5, span = 0.25)}
    q
    # )
  })
}
