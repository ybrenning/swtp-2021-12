package com.example.demo.parser

import com.example.demo.Repository
import com.example.demo.dataclasses.DBEntity
import java.io.File

object Parser {
    // location of the folder containing the .csv files
    private const val csvFileFolder: String = "src/main/kotlin/com/example/demo/csvLocation/"

    private fun String.toBoolean(): Boolean {
        return (this.toInt() != 0)
    }

    fun parseFile(softwareSystem: String, repository: Repository) {
        val csvFilePath = "$csvFileFolder$softwareSystem.csv"
        var csvLineElements: List<String>
        val configurationNames = mutableListOf<String>()
        var i = 0

        File(csvFilePath).forEachLine {
            csvLineElements = it.split(",")
            // on first pass saves the names of the configurations
            if (i == 0) {
                for (loopVar in csvLineElements.indices) {
                    // removes " at start and end from the config name string
                    var lineElement: String = csvLineElements[loopVar].substring(1, csvLineElements[loopVar].length - 1)
                    configurationNames.add(loopVar, lineElement)
                }
            } else {
                var functionName = csvLineElements[0]

                // create map of the configuration names and values per entry
                val configMap = HashMap<String, Boolean>()
                for (loopVar in 1..configurationNames.size - 3)  {
                    // if length is 1 then it's a config
                    if(csvLineElements[loopVar].length == 1) {
                        configMap[configurationNames[loopVar]] = csvLineElements[loopVar].toBoolean()
                    // else it's a parameter in the function name
                    } else {
                        functionName += csvLineElements[loopVar]
                    }
                }

                repository.save(
                    DBEntity(
                        softwareSystem,
                        // removes " at start and end from the function name string
                        functionName.substring(1, functionName.length - 1),
                        configMap,
                        csvLineElements[csvLineElements.size-2].toDouble(),
                        csvLineElements[csvLineElements.size-1].toDouble()
                    )
                )
            }
            // required to check if it is the first line of the file or not
            i = 1
        }
    }
}
