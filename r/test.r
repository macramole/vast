df = read.csv("../data/sensorData.links.csv")
df$sourceTime = as.POSIXct(df$sourceTime)
df$targetTime = as.POSIXct(df$targetTime)
df$diferenciaTiempo = df$targetTime - df$sourceTime

write.csv(df, file = "../data/sensorData.links.conDiff.csv", row.names = F)
  
str(df)

filter = df[1:1000,]
write.csv(filter, file = "filter.csv")

filter = df[1:10,]
write.csv(filter, file = "filter2.csv", row.names = F)

str(df)
head()

head(df)

head(  )

write.csv(df[ df$carID == "20155705025759-63", ], file="seQuedoUnAnio.csv")

library(dplyr)

write.csv( as.data.frame(df[ df$carID == "20155705025759-63", ] %>%
  group_by(target, source) %>%
  summarise(
    value = n()
  )), file = "seQuedoUnAnioAgregado.csv" )
