package com.example.greenidebackend

import org.springframework.stereotype.Service

@Service
class FunctionValueCalculatorService(
    val repository: Repository
) {

    fun calcFunctionValues(program: String, functions: ArrayList<String>, konfigs: ArrayList<Boolean>) {

    }
cd Ccd
// functions related to getting all available functions in the programs
    fun getAllFunctions(program: String): ArrayList<String>?{
        val functions: ArrayList<String>? = when(program) {
            "kanzi" -> getAllKanziFunctions()
            "density-converter" -> getAllDCFunctions()
            else -> null
        }
        return functions
    }

    fun getAllKanziFunctions(): ArrayList<String> {
        //TODO: get all kanzi function names from the repository and then remove all duplicates
        // (search all in repo and remove dupes in service)
    }

    fun getAllDCFunctions(): ArrayList<String> {
        //TODO: get all density converter function names from the repository and then remove all duplicates
        // (search all in repo and remove dupes in service)
    }
}