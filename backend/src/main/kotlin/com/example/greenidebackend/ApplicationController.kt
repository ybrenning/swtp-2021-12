package com.example.greenidebackend

import org.springframework.web.bind.annotation.*
import com.example.greenidebackend.supportdata.Request

@RestController
@RequestMapping
class ApplicationController(
    val functionService: FunctionValueCalculatorService
) {

    //return the calculated values for the provided functions
    @PostMapping("/calculateValues/{program}")
    fun functionValueProvider(
        @PathVariable program: String,
        @RequestBody request: Request
    ) {
        return functionService.calcFunctionValues(program, request.functions, request.konfigs)
    }

    //return a list of all functions of the software
    @GetMapping("/listOfFunctions/{program}")
    fun functionListProvider(@PathVariable program: String): ArrayList<String>?{
        return functionService.getAllFunctions(program)
    }
}
