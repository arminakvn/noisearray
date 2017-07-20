height <- 600
navbarPage("LA Sensor Pilot", theme = shinytheme("cyborg"),
           tabPanel("Contour Map",
                    verticalLayout(
                      column(10,offset=1,
                             leafletOutput("leaflet",  height = height)
                      ),
                      fluidRow(
                        h1(""),h1(),
                        column(8, offset=2,
                               sliderInput("Time", "starttime:", min, max, value = min+3600, width='100%', timezone = "-0700")
                        ),
                        column(8, offset=2,
                               radioButtons("component", label = "Sound components", choices = comps, selected = comps[5],inline = T)
                        )
                      )
                    )
           ),
           tabPanel("Time View",
                    tags$head(
                      tags$style(HTML(".dygraph-legend {background: transparent !important;}"))
                    ),
                    verticalLayout(
                      column(10,offset=1,
                             dygraphOutput("dygraph1",height = height/2)
                      ),
                      column(10,offset=1,
                             dygraphOutput("dygraph2",height = height/2)
                      ),
                      column(10,offset=1,
                             column(5, offset = 1,
                                    selectInput("devid", label = "Sensor", choices = devnames$name, selected = devnames$name[10])
                             ),
                             column(5, offset = 1,
                                    checkboxInput("showgrid", label = "Show Grid", value = F),
                                    helpText("Click and drag to zoom in (double click to zoom back out).")
                             )
                      )
                    )
           ),
           tabPanel("Sensor Matrix",
                    verticalLayout(
                      column(10,offset = 1,
                             plotOutput("distPlot",height = height, dblclick = "plot_dblclick", brush = brushOpts(id = "plot_brush", direction = "x", resetOnNew = T))
                      ),
                      fluidRow(
                        h1(),h1(),
                        column(8, offset=2, sliderInput("slider_datetime", "Date/time:", min=min,max=max, value = c(min+((max-min)/3),max-((max-min)/3)), width = '100%', timezone = "-0700")
                        ),
                        column(3, offset=2, radioButtons(input= 'types', label= 'Components',  choices= c("Loudness", "Frequencies"), selected= "Loudness", inline = T
                        )
                        ),
                        column(4, br(), helpText("Click and drag to zoom in (double click to zoom back out)."))
                      )
                    )
           )
)