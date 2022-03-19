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
        lateinit var configurationNames: List<String>
        var i = 0

        File(csvFilePath).forEachLine {
            csvLineElements = it.split(",")
            // check for first line and create the configuration names list from it
            if (i == 0) {
                configurationNames = csvLineElements
            } else {
                // create the map of the configuration names and values for the Line (entry)
                val configMap = HashMap<String, Boolean>()
                for (loopVar in 1..configurationNames.size - 3)  {
                    if(csvLineElements[loopVar].length == 1) {
                        configMap[configurationNames[loopVar]] = csvLineElements[loopVar].toBoolean()
                    }
                }
                //removes " from the function name string
                var functionName = csvLineElements[0].substring(1,csvLineElements[0].length - 1)

                repository.save(
                    DBEntity(
                        softwareSystem,
                        functionName,
                        configMap,
                        csvLineElements[csvLineElements.size-2].toDouble(),
                        csvLineElements[csvLineElements.size-1].toDouble()
                    )
                )
            }

            i = 1
        }
    }
}
