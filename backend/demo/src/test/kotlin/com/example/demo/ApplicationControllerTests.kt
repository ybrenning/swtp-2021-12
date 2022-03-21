package com.example.demo

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest


@SpringBootTest
class ApplicationControllerTests @Autowired constructor(
    val controller: ApplicationController
    ) {

    @Test
    fun contextLoads() {
    }

    @Test
    fun connectTestTF() {
        val returnValue = controller.connectTest()
        Assertions.assertEquals("test received", returnValue)
    }
}
