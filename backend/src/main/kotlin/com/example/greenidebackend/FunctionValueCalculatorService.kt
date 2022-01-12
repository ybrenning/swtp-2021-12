package com.example.greenidebackend

import com.example.greenidebackend.supportdata.ConfiguredFunction
import org.springframework.stereotype.Service
import java.io.File

@Service
class FunctionValueCalculatorService(
    val repository: Repository
) {
    fun calcFunctionValues(
        program: String,
        functions: List<String>,
        konfigs: List<Boolean>
    ): ArrayList<ConfiguredFunction> {
        val response: ArrayList<ConfiguredFunction> = ArrayList()
        var number: Number = 1

        if(program == "kanzi"){
            number = 0
        }
        for(function in functions) {
            response.add(ConfiguredFunction(function, number, number))
        }

        return response
    }

// functions related to getting all available functions in the programs
    fun getAllFunctions(program: String): List<String>{
        val functions: List<String> = when(program) {
            "kanzi" -> getAllKanziFunctions()
            "density-converter" -> getAllDCFunctions()
            else -> emptyList()
        }
        return functions
    }

    fun getAllKanziFunctions(): List<String> {
        return File("src\\main\\kotlin\\com\\example\\greenidebackend\\method_list_kanzi.txt").useLines { it.toList() }

        //TODO: get all kanzi function names from the repository and then remove all duplicates
        //      (search all in repo and remove dupes in service)
    }

    fun getAllDCFunctions(): List<String> {
        //TODO: get all density converter function names from the repository and then remove all duplicates
        // (search all in repo and remove dupes in service)
        return emptyList()
    }
}
