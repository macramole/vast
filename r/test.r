df = read.csv("../data/sensorData.links.csv")
df$sourceTime = as.POSIXct(df$sourceTime)
df$targetTime = as.POSIXct(df$targetTime)
df$diferenciaTiempo = df$targetTime - df$sourceTime
  
str(df)

filter = df[1:1000,]
write.csv(filter, file = "filter.csv")

filter = df[1:10,]
write.csv(filter, file = "filter2.csv")

str(df)
head()

head(df)

head(  )
