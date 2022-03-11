package com.example.demo.parser

import com.example.demo.Repository
import com.example.demo.dataclasses.DBEntity
import java.io.File

object Parser {
    private const val csvFileFolder:String = ""     // location of the folder containing the .csv files

    private fun String.toBoolean(): Boolean {
        return (this.toInt() != 0)
    }

    fun parseFile(softwareSystem: String, repository: Repository) {
        val csvFilePath = "$csvFileFolder$softwareSystem.csv"
        var csvLineElements: List<String>
        lateinit var configurationNames: List<String>
        var i = 0

        File(csvFilePath).forEachLine{
            csvLineElements = it.split(",")
            // check for first line and create the configuration names list from it
            if(i == 0) {
                configurationNames = csvLineElements
            } else {
                // create the map of the configuration names and values for the Line (entry)
                val configMap = HashMap<String, Boolean>()
                for(loopVar in 1..configurationNames.size - 3)  {
                    configMap[configurationNames[loopVar]] = csvLineElements[loopVar].toBoolean()
                }

                repository.save(
                    DBEntity (
                        softwareSystem,
                        csvLineElements[0],
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
