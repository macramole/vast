df = read.csv("../data/sensorData.links.csv")

filter = df[1:1000,]
write.csv(filter, file = "filter.csv")

filter = df[1:10,]
write.csv(filter, file = "filter.csv")
