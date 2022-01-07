package com.example.greenidebackend

import org.springframework.stereotype.Component

@Component
class KanziService {

    fun kanzi(): String {
        return "kanzi"
    }

    fun dConv(): String {
        return "density-converter"
    }
}
