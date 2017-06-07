import json

csv = open("./Lekagul Sensor Data.csv", "r")

FIELD_TIME = 0
FIELD_ID = 1
FIELD_TYPE = 2
FIELD_GATE = 3

gateNames = []
trajectories = {} #diccionario con { id : [ gate, gate, gate ], id2 : [...], ... ]

firstLine = True
for line in csv:
    if firstLine:
        firstLine = False
        continue

    arrLine = line.split(",")
    gateName = arrLine[FIELD_GATE].rstrip()

    if not gateName in gateNames:
        gateNames.append( gateName )

    carID = arrLine[FIELD_ID]

    if not carID in trajectories:
        trajectories[carID] = []

    trajectories[ carID ].append( {
        "type" : arrLine[FIELD_TYPE],
        "gate" : gateName,
        "time" : arrLine[FIELD_TIME] } )

jsonFinal = {
    "nodes" : [],
    "links" : []
}

for gateID, gate in enumerate(gateNames):
    jsonFinal["nodes"].append({
        "node" : gateID,
        "name" : gate
    })

linksSimple = {}

for key, car in trajectories.items():
    for i in range(1,len(car)):
        info = car[i]
        prevInfo = car[i-1]

        sourceID = int(gateNames.index( prevInfo["gate"] ))
        targetID = int(gateNames.index( info["gate"] ))

        sourceTarget = str(sourceID) + "-" + str(targetID)

        if not sourceTarget in linksSimple:
            linksSimple[sourceTarget] = 0

        linksSimple[sourceTarget] += 1

        jsonFinal["links"].append({
            "source" : sourceID,
            "target" : targetID,
            "type" : info["type"],
            "time" : info["time"],
            "value" : 1
        })

with open ("./sensorData.graph.json", "w") as j:
    json.dump( jsonFinal , j )

jsonSimple = {
    "nodes" : jsonFinal["nodes"],
    "links" : []
}

for sourceTarget, value in linksSimple.items():
    arrSourceTarget = sourceTarget.split("-")
    source = int(arrSourceTarget[0])
    target = int(arrSourceTarget[1])
    jsonSimple["links"].append({
        "source" : source,
        "target" : target,
        "value" : value
    })

with open ("./sensorData.graph.simple.json", "w") as j:
    json.dump( jsonSimple , j )
