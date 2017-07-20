height <- 600
navbarPage("LA Pilot", theme = shinytheme("cyborg"), id="atab",
           tabPanel("About",
                    includeCSS("www/css/style.css"),
                    includeHTML("www/insert.html")
           ),
           
           tabPanel("Contour Map",
                    verticalLayout(
                      column(10,offset=1,
                             leafletOutput("leaflet",  height = height)
                      ),
                      column(10,offset=1,
                             h1(),h1(),
                             column(6, 
                                    sliderInput("Time", "Time of day", min, max, value = min+3600, width='100%', timezone = "-0700"),
                                    radioButtons("component", label = "Sound components", choices = comps, selected = comps[5],inline = T)
                             ),
                             column(6,
                                    h4("Noise readings and interpolated noise contour lines"),
                                    helpText("Numbers represent measured sound pressure values in db."),
                                    helpText("Contour lines indicate areas of equal noise levels based on a spatial interpolation of the measured values."),
                                    helpText("Lighter colors indicate more noise.")
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
                             h1(),h1(),
                             column(5, offset=1,
                                    selectizeInput("devid", label = "Sensor", choices = devnames$name, selected = devnames$name[10]),
                                    checkboxInput("showgrid", label = "Show Grid", value = F)
                             ),
                             column(6, 
                                    h4("Timeline of individual sensor readings"),
                                    helpText("Click and drag to zoom in (double click to zoom back out)."),
                                    helpText("Note: not all nodes record frequency data.")
                             )
                      )
                    )
           ),
           tabPanel("Sensor Matrix",
                    verticalLayout(
                      column(10,offset = 1,
                             plotOutput("distPlot",height = height, dblclick = "plot_dblclick", brush = brushOpts(id = "plot_brush", direction = "x", resetOnNew = T))
                      ),
                      column(10,offset=1,
                        h1(),h1(),
                        column(6, 
                               sliderInput("slider_datetime", "Select Time Interval:", min=min,max=max, value = c(min+((max-min)/3),max-((max-min)/3)), width = '100%', timezone = "-0700"),
                               radioButtons(input= 'types', label= 'Components',  choices= c("Loudness", "Frequencies"), selected= "Loudness", inline = T)
                        ),
                        column(6, 
                               h4("Compare sensor timelines next to each other"),
                               helpText("Click and drag to zoom in (double click to zoom back out)."))
                      )
                    )
           ),
           tabPanel("Analysis",
                    verticalLayout(
                      column(10,offset=1,
                             column(7,img(src="image/voice-02.jpg", width='100%'), h1()),
                             column(4,
                                    # h4("Noise readings and interpolated noise contour lines"),
                                    helpText("The noise contour map of the middle frequencies of a Thursday noon clearly shows the difference between more noisy and more quiet regions ")
                                    ),
                             column(7,img(src="image/street.svg", width='100%'), h1()),
                             column(4,
                                    # h4("Noise readings and interpolated noise contour lines"),
                                    helpText("The average sound pressure aggregated over a month by street. 
                                              The most busy streets, Santa Monica and North Virgil, exhibit the highest noise levels, but not the highest variations.")
                             ),
                             column(7,img(src="image/avwdst.svg", width='100%'), h1()),
                             column(4,
                                    # h4("Noise readings and interpolated noise contour lines"),
                                    helpText("On average, sound levels on weekends are almost as high as during the work week, with a maximum difference of about 5db. This is the case for both active and quiet streets.")
                             ),
                             column(7,img(src="image/hourly.svg", width='100%'), h1()),
                             column(4,
                                    # h4("Noise readings and interpolated noise contour lines"),
                                    helpText("Aggregated by hour of day, each street shows a distinct profile. In general, the time between 0 and 6am have lowest values, with noise readings picking up around 7am. Peak around 3pm, most pronounced in the bass frequency component.")
                             ),
                             column(7,img(src="image/sensor.svg", width='100%'), h1()),
                             column(4,
                                    # h4("Noise readings and interpolated noise contour lines"),
                                    helpText("These variations, and especially the “bump” in the base frequencies are even more visible in the temporally averaged profiles for individual sensors; and again especially on those on larger roads. It may be hypothesized that low frequencies are associated especially with trucks and large diesel engines.")
                             )
                      )
                    )
           )
)