#!/usr/bin/env python

import json

# csv = open("./Lekagul Sensor Data.csv", "r")
csv = open("./dataset.csv", "r")

FIELD_TIME = 0
FIELD_ID = 1
FIELD_TYPE = 2
FIELD_GATE = 3
FIELD_GATE_POSX = 4
FIELD_GATE_POSY = 5

gateNames = []
gatePositions = []
trajectories = {} #diccionario con { id : [ gate, gate, gate ], id2 : [...], ... ]

firstLine = True
for line in csv:
    if firstLine:
        firstLine = False
        continue

    arrLine = line.split(",")
    gateName = arrLine[FIELD_GATE].rstrip()
    gatePosX = arrLine[FIELD_GATE_POSX].rstrip()
    gatePosY = arrLine[FIELD_GATE_POSY].rstrip()

    if not gateName in gateNames:
        gateNames.append( gateName )
        gatePositions.append({
            "x" : gatePosX,
            "y" : gatePosY
        })

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
        "name" : gate,
        "x" : gatePositions[gateID]["x"],
        "y" : gatePositions[gateID]["y"]
    })

linksSimple = {}

# que tal si hacemos muchos grafos por cada entrada
byEntrance = {}

for key, car in trajectories.items():
    entrance = car[0]["gate"]

    if not entrance in byEntrance:
        byEntrance[ entrance ] = {}

    for i in range(1,len(car)):
        info = car[i]
        prevInfo = car[i-1]

        sourceID = int(gateNames.index( prevInfo["gate"] ))
        targetID = int(gateNames.index( info["gate"] ))

        sourceTarget = str(sourceID) + "-" + str(targetID)

        if not sourceTarget in linksSimple:
            linksSimple[sourceTarget] = 0
        if not sourceTarget in byEntrance[ entrance ]:
            byEntrance[ entrance ][sourceTarget] = 0

        linksSimple[sourceTarget] += 1
        byEntrance[ entrance ][ sourceTarget ] += 1

        jsonFinal["links"].append({
            "carID" : key,
            "source" : sourceID,
            "target" : targetID,
            "type" : info["type"],
            "sourceTime" : info["time"],
            "targetTime" : prevInfo["time"],
            "value" : 1
        })

with open ("./sensorData.graph.json", "w") as j:
    json.dump( jsonFinal["links"] , j )
    print("hice sensorData.graph.json")

#bajada de dataset para filtrar
# import pandas as pd
#
# with open ("./soloLinks.json", "w") as j:
#     json.dump( jsonFinal["links"] , j )
#
# pdData = pd.read_json( path_or_buf = "./soloLinks.json", orient = "records" )
# pdData.to_csv("sensorData.links.csv", index = False)

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
    print("hice sensorData.graph.simple.json")


jsonSimpleByEntrance = {
    "nodes" : jsonFinal["nodes"],
    "entrances" : {}
}

for entranceName, sourceTargets in byEntrance.items():
    jsonSimpleByEntrance["entrances"][entranceName] = []
    links = jsonSimpleByEntrance["entrances"][entranceName]

    for sourceTarget, value in sourceTargets.items():
        arrSourceTarget = sourceTarget.split("-")
        source = int(arrSourceTarget[0])
        target = int(arrSourceTarget[1])
        links.append({
            "source" : source,
            "target" : target,
            "value" : value
        })

with open ("./sensorData.graph.simple.byEntrance.json", "w") as j:
    json.dump( jsonSimpleByEntrance , j )
    print("hice sensorData.graph.simple.byEntrance.json")
