library(dygraphs)
library(xts)
library(shiny)
library(leaflet)
library(raster)
library(RColorBrewer)
library(ggplot2)
library(ggthemes)
library(gstat)
library(lubridate)
library(ggmap)
library(shinythemes)

# ===== themes and colors =======
tt <- "#999999"
theme_set(theme_solarized(light=F)+ theme(panel.grid.minor = element_blank(), 
                                          panel.grid.major = element_blank(),
                                          panel.background = element_blank(),
                                          plot.background = element_rect(fill = "black"), 
                                          text = element_text(colour=tt),
                                          axis.title.x = element_text(colour=tt,size= 14),
                                          axis.title.y = element_text(colour=tt, size= 14),
                                          axis.text.x = element_text(colour=tt, angle = 90,hjust = 1, size = 10),
                                          axis.text.y = element_text(colour=tt, size = 10),
                                          strip.background=element_rect(fill="transparent", size = 0), 
                                          strip.text.x = element_text(colour=tt, angle = 0, size = 18),
                                          strip.text.y = element_text(colour=tt, angle = 0, hjust = 0, size = 18),
                                          legend.key = element_rect(fill = "transparent", colour = "transparent"),
                                          legend.title = element_text(colour=tt,size=18),
                                          legend.text = element_text(colour=tt,size=12),
                                          legend.background = element_rect(fill = "transparent", colour = "transparent"),
                                          legend.justification = "left",
                                          legend.position = c(1.00,0.977)))

scl <-  c("#0868ac", "#7bccc4", "#f0f9e8", "#bd0026", "#fd8d3c", "#ffffb2") 

# ===== coords & names =======

lons <- c(-118.289444,
          -118.2891023,
          -118.2885641,
          -118.2881616,
          -118.2876,
          -118.2869588,
          -118.2864767)
lats <- c(34.0927221,
          34.09242256,
          34.09192646,
          34.09141631,
          34.09103253,
          34.090733,
          34.09046154,
          34.09006372,
          34.08961442,
          34.08903407,
          34.08871114,
          34.09288122)


ro <- c(
  '(34.0907,34.091]'  = 'Santa Monica',
  '(34.091,34.0914]'  = '',
  '(34.0887,34.089]'  = 'Lockwood',
  '(34.0896,34.0901]' = 'Willow Brooks',
  '(34.0919,34.0924]' = '',
  '(34.0924,34.0927]' = '',
  '(34.0914,34.0919]' = '',
  '(34.0927,34.0929]' = '',
  '(34.0905,34.0907]' = '',
  '(34.0901,34.0905]' = '')

co <- c(
  '(-118.2894,-118.2891]' = 'N Madison',
  '(-118.2891,-118.2886]' = '',
  '(-118.2886,-118.2882]' = '',
  '(-118.2882,-118.2876]' = 'Westmoreland',
  '(-118.2876,-118.287]' = '',
  '(-118.287,-118.2865]'  = 'N Virgil'
)

sensors <- c("IphKyLkGgBd/Tf7sqKywkkf6Fyo=", "3/Z7SVuoEemK35lIIKpgWOygBNM=", 
             "xToelU2ZCAt0Ejj05yj++dQHYyU=", "YFqBN0qUaGU7+uEG0wFs7W4gEow=", 
             "vxmiIVGoww7+YlbyeTZA+CEbuUw=", "YwwH7IfO3VPDx+QM/C+eZqh++no=", 
             "gFmwXd6cqjGHJEK/C1KrmPUvYlA=", "r8+xYX3eAXzyYY8nyL/4Q2zKjaM=", 
             "iEKQmn5crDDlXpZhMcVKCwi8+iY=", "7zwqYoqR2fJ+r/HnYOzUzd4Qo00=", 
             "C7jqMuyFZU777IFwIfQ/MKn/LIg=", "RNJWQJDgmZI2M5v/U0ypb82QgQc=", 
             "BPi2xjrTjVp/Ywfaw9vTx+ON+Fs=", "CEAxz7/70c7qbmE5eEhXfLXhCbo=", 
             "X+qK5m1wCiDjw187iNscr17wTAU=", "4w5qByA+6AI5oBEORbjQ7kaZcaw=", 
             "gFY3K8bU3pWc6gBj6N0C8Vj5DNU=", "aGPOgG3Nt4qhhy95FBVDf2LQ9z8=", 
             "KhiCw+cIev5Mjhc6wgc7ATa+BIs=", "r/rEpnbV1GMdHV/i7PCB4wPRh3c=", 
             "Te+haMWI01++CM7wNX4NLB+NRUY=")
comps <- c("Base", "Voice", "High","Lmindba", "Leqdba", "Lmaxdba")

# ===== init =======

devnames <- read.csv("devicenames.csv")
load("resample.rdata")
# load("resample2.rdata")
# load("full.rdata")
min = min(dat$time)+60
max = max(dat$time)-60

# leaflet
x.range <- as.numeric(c(-118.2932,-118.2829))
y.range <- as.numeric(c(34.0873,34.0942))
grd <- expand.grid(x = seq(from = x.range[1], to = x.range[2], by = 0.00003), y = seq(from = y.range[1], to = y.range[2], by = 0.00003))  # expand points to grid
coordinates(grd) <- ~x + y
gridded(grd) <- TRUE

setint <- function(sub, start, end) {sub <- sub[sub$time >=start & sub$time <=end,]; return(sub)} 

prep <- function(sub,start,end) {
  sub <- setint(sub,start,end)
  sub$lat <- cut(sub$Latitude, lats)
  sub$lng <- cut(sub$Longitude, lons)
  return(sub)
}

