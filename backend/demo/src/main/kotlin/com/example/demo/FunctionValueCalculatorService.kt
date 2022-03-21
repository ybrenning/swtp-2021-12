package com.example.demo

import com.example.demo.dataclasses.ConfiguredFunction
import com.example.demo.dataclasses.DBEntity
import com.example.demo.parser.Parser
import org.springframework.stereotype.Service

@Service
class FunctionValueCalculatorService(
    val repository: Repository
) {
    // functions related to calculating the required values from the given configurations

    fun calcFunctionValues(
        softwareSystem: String,
        functionsToFind: ArrayList<String>,
        configsToFind: ArrayList<String>
    ): ArrayList<ConfiguredFunction> {
        val configuredFunctions: ArrayList<ConfiguredFunction> = ArrayList()

        // repeat for all functions that are requested
        for (function in functionsToFind) {
            val functionConfigsRaw: List<DBEntity> = repository.findByFunctionName(function)
            var functionResultEnergy = 0.0
            var functionResultTime = 0.0

            // repeat for each configuration in the database
            for (functionConfigRaw in functionConfigsRaw) {
                // repeat for every configuration that is requested
                for (configToFind in configsToFind) {
                    //TODO: remove test
                    println("-------------")
                    println(configToFind)
                    println(functionConfigRaw.configs[configToFind])
                    // is this config {requested} AND {in this entry}
                    if (functionConfigRaw.configs[configToFind] == true) {
                        functionResultEnergy += functionConfigRaw.energy
                        functionResultTime += functionConfigRaw.time
                        break
                    }
                }
            }

            // add the function to the return list
            configuredFunctions.add(
                ConfiguredFunction(
                    function,
                    functionResultEnergy,
                    functionResultTime
                )
            )
        }
        return configuredFunctions
    }

    fun getAllFunctions(softwareSystem: String): ArrayList<String>? {
        val functionsNoDupes: ArrayList<String> = ArrayList()
        val functions: List<DBEntity> = repository.findBySoftwareSystem(softwareSystem)
        // filter duplicate function names
        for (obj in functions) {
            if (!functionsNoDupes.contains(obj.functionName)) {
                functionsNoDupes.add(obj.functionName)
            }
        }

        return functionsNoDupes
    }

    fun parseFileToDB(softwareSystem: String) {
        Parser.parseFile(softwareSystem, repository)
    }

    fun clearDB() {
        repository.deleteAll()
    }
}
