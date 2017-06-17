df = read.csv("../data/sensorData.links.conDiff.csv")
df$sourceTime = as.POSIXct(df$sourceTime)
df$targetTime = as.POSIXct(df$targetTime)

# head(df)
# nrow(df)
# str(df)

library(sqldf)
library(arules)

entrances = c("entrance0","entrance1","entrance2","entrance3","entrance4")
menosDeUnDia = c( 0, 60*60, 60*60*3, 60*60*6, 60*60*12, 60*60*24 )

#TODO: filtrar por tipo de auto y dia de la semana

for ( i in 2:length(menosDeUnDia) ) {
  desde = menosDeUnDia[ i - 1 ]
  hasta = menosDeUnDia[ i ]

  for ( entrance in entrances ) {
    carIDs = sqldf(paste("SELECT 
      carID,
      MAX(targetTime) - MIN(sourceTime) as tiempo
    FROM 
      df 
    WHERE
      carID IN ( SELECT carID FROM df GROUP BY carID HAVING sourceTime = MIN(sourceTime) AND source = '", entrance ,"' )
    GROUP BY 
      carID
    HAVING
      tiempo BETWEEN ", desde, " AND ", hasta, sep = ""))
    
    df.filtered = df[ df$carID %in% carIDs$carID, ]
    
    df.pares = sqldf("SELECT source, target FROM `df.filtered` GROUP BY source, target")
    
    for ( p in 1:nrow(df.pares) ) {
      unidad = "mins"
      tiempos = df.filtered[ df.filtered$source == df.pares[p, "source"] & df.filtered$target == df.pares[p, "target"], "diferenciaTiempo"] / 60
      colores = c()
      tiempoDiscret = ""
      
      if ( max(tiempos) > 60 ) {
        tiempos = tiempos / 60
        unidad = "horas"
      }
      
      if ( length(tiempos) > 5 & sd(tiempos) > 2 ) {
        tiempos = discretize( tiempos, method = "interval", categories = 2)
        colores = as.numeric(tiempos)
        tiempoDiscret = paste(as.character(tiempos),unidad)
      } else {
        colores = rep(1, length(tiempos))
        tiempoDiscret = paste(format(mean(tiempos), digits = 4), unidad)
      }
      df.filtered[ df.filtered$source == df.pares[p, "source"] & df.filtered$target == df.pares[p, "target"], "color"] = colores
      df.filtered[ df.filtered$source == df.pares[p, "source"] & df.filtered$target == df.pares[p, "target"], "tiempoDiscret"] = tiempoDiscret
    }
    
    df.filtered.aggr = sqldf("SELECT source, target, color, tiempoDiscret as label, SUM(value) as value FROM `df.filtered` GROUP BY source, target, color")
    
    fileName = paste(entrance, "--", desde/60/60,"h-",hasta/60/60, "h.csv", sep = "")
    
    write.csv(df.filtered.aggr, file = fileName, row.names = F) 
  }
}
