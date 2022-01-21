package com.example.greenidebackend

import com.example.greenidebackend.supportdata.DBEntity
import org.springframework.stereotype.Service

@Service
class FunctionValueCalculatorService(
    val repository: Repository
) {
    // functions related to calculating the required values from the given configurations
    fun calcFunctionValues(
        program: String,
        functions: ArrayList<String>,
        configs: ArrayList<Boolean>
    ) {

    }

    // functions related to getting all available functions in the programs
    fun getAllFunctions(softwareSystem: String): ArrayList<String>? {
        var functionsNoDupes: ArrayList<String> = ArrayList<String>()
        var functions: List<DBEntity> = repository.findBySoftwareSystem(softwareSystem)

        for (obj in functions) {
            if(!functionsNoDupes.contains(obj.functionName)){
                functionsNoDupes.add(obj.functionName)
            }
        }

        return functionsNoDupes
    }

}
