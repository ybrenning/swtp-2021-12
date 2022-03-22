package com.example.demo

import com.example.demo.dataclasses.ConfiguredFunction
import com.example.demo.dataclasses.Request
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping
class ApplicationController(
    val functionService: FunctionValueCalculatorService
) {
    @PostMapping("/calculateValues/{softwareSystem}")
    fun functionValueProvider(
        @PathVariable softwareSystem: String,
        @RequestBody request: Request
    ): ArrayList<ConfiguredFunction> {
        return functionService.calcFunctionValues(softwareSystem, request.functions, request.configs)
    }

    @GetMapping("/listOfFunctions/{softwareSystem}")
    fun functionListProvider(@PathVariable softwareSystem: String): ArrayList<String>? {
        return functionService.getAllFunctions(softwareSystem)
    }

    @GetMapping("/parseFile/{softwareSystem}")
    fun parseFileToDB(@PathVariable softwareSystem:String): String {
        functionService.parseFileToDB(softwareSystem)
        return "file parsed"
    }

    @GetMapping("/test")
    fun connectTest(): String {
        println("test ping has been received")
        return "test received"
    }
}
