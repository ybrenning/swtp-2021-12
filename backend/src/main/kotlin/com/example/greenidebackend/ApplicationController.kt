package com.example.greenidebackend

import org.springframework.web.bind.annotation.*
import com.example.greenidebackend.supportdata.Request

@RestController
@RequestMapping
class ApplicationController(
    val functionService: FunctionValueCalculatorService
) {

    @PostMapping("/calculateValues/{program}")
    fun functionValueProvider(
        @PathVariable program: String,
        @RequestBody request: Request
    ) {
        //return the calculated values for the provided functions of the specified program
        return functionService.calcFunctionValues(program, request.functions, request.configs)
    }

    @GetMapping("/listOfFunctions/{program}")
    fun functionListProvider(@PathVariable program: String): ArrayList<String>?{
        //return a list of all functions of the given program
        return functionService.getAllFunctions(program)
    }
}
