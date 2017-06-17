

df = read.csv("../data/sensorData.links.conDiff.csv")
df$sourceTime = as.POSIXct(df$sourceTime)
df$targetTime = as.POSIXct(df$targetTime)

head(df)
nrow(df)
str(df)

library(sqldf)

entrances = c("entrance0","entrance1","entrance2","entrance3","entrance4")
menosDeUnDia = c( 0, 60*60, 60*60*3, 60*60*6, 60*60*12, 60*60*24 )
# menosDeUnDia = c( 0, 60*60 )

#filtrar por tipo de auto y dia de la semana

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
    
    df.filtered.aggr = sqldf("SELECT source, target, SUM(value) as value FROM `df.filtered` GROUP BY source, target")
    
    fileName = paste(entrance, "--", desde,"-",hasta, ".csv", sep = "")
    
    write.csv(df.filtered.aggr, file = fileName, row.names = F) 
  }
}
