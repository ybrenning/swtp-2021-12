package com.example.greenidebackend

import org.springframework.web.bind.annotation.*
import com.example.greenidebackend.supportdata.Request

@RestController
@RequestMapping
class ApplicationController(
    val kanziService: KanziService
) {


    @GetMapping("/{program}/")
    fun kanziInput( @PathVariable program: String,
                    @RequestBody request: Request
                   ): Unit? {
        var test: String = ""
        when (program) {
            "kanzi" -> test = kanziService.kanzi()
            "density-converter" -> test = kanziService.dConv()
            else -> return null
        }
        return null
    }



}