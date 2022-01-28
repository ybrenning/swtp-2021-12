package com.example.greenidebackend

import com.example.greenidebackend.dataclasses.ConfiguredFunction
import com.example.greenidebackend.dataclasses.DBEntity
import org.springframework.stereotype.Service

@Service
class FunctionValueCalculatorService(
    val repository: Repository
) {
    // functions related to calculating the required values from the given configurations
    fun calcFunctionValues(
        softwareSystem: String,
        functionsToFind: ArrayList<String>,
        configsToFind: ArrayList<Boolean>
    ): ArrayList<ConfiguredFunction> {
        val configuredFunctions: ArrayList<ConfiguredFunction> = ArrayList()

        //repeat for all functions that are requested
        for(function in functionsToFind) {
            val functionConfigsRaw: List<DBEntity> = repository.findConfigsForFunction(function)
            var functionResultEnergy = 0.0
            var functionResultTime   = 0.0

            //repeat for each configuration returned from the database
            for(functionConfigRaw in functionConfigsRaw) {

                //repeat for every configuration that is requested
                for(configToFind in configsToFind) {

                    //is this config #requested AND #the one in this database entry
                    if(functionConfigRaw.configs[configToFind] == true) {

                        functionResultEnergy += functionConfigRaw.energy
                        functionResultTime   += functionConfigRaw.time
                        break
                    }
                }
            }
            //add the function with its calculated values to the return list
            configuredFunctions.add(ConfiguredFunction(function, functionResultEnergy, functionResultTime))
        }
        return configuredFunctions
    }

    // functions related to getting all available functions in the programs
    fun getAllFunctions(softwareSystem: String): ArrayList<String>? {
        val functionsNoDupes: ArrayList<String> = ArrayList()
        val functions: List<DBEntity> = repository.findBySoftwareSystem(softwareSystem)

        for (obj in functions) {
            if(!functionsNoDupes.contains(obj.functionName)){
                functionsNoDupes.add(obj.functionName)
            }
        }

        return functionsNoDupes
    }

}
