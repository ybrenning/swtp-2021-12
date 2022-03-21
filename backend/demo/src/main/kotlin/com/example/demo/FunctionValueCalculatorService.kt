package com.example.demo

import com.example.demo.dataclasses.ConfiguredFunction
import com.example.demo.dataclasses.DBEntity
import com.example.demo.parser.Parser
import org.springframework.stereotype.Service

@Service
class FunctionValueCalculatorService(
    val repository: Repository
) {
    fun calcFunctionValues(
        softwareSystem: String,
        requestedFunctions: ArrayList<String>,
        configsToFind: ArrayList<String>
    ): ArrayList<ConfiguredFunction> {
        val configuredFunctions: ArrayList<ConfiguredFunction> = ArrayList()

        for (function in requestedFunctions) {
            val functionConfigsRaw: List<DBEntity> = repository.findByFunctionName(function)
            var functionResultEnergy = 0.0
            var functionResultTime = 0.0

            // for every configuration in the database
            for (functionConfigRaw in functionConfigsRaw) {
                // and every requested configuration
                for (configToFind in configsToFind) {
                    // compare these two and only add if the requested is the one in the current entry
                    if (functionConfigRaw.configs[configToFind] == true) {
                        functionResultEnergy += functionConfigRaw.energy
                        functionResultTime += functionConfigRaw.time
                        break
                    }
                }
            }
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
}
