package com.example.demo

import com.example.demo.dataclasses.ConfiguredFunction
import com.example.demo.dataclasses.Request
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest


@SpringBootTest
class ApplicationControllerTests @Autowired constructor(
    val controller: ApplicationController
    ) {

    private final val functions = arrayListOf("kanzi.Global$1.compare", "kanzi.Global.<clinit>")
    private final val configs = arrayListOf("root", "CHECKSUM")
    val testRequest = Request(functions, configs)

    private final val configuredFunction1 = ConfiguredFunction("kanzi.Global$1.compare", 0.17315721808227894, 0.09236394624248921)
    private final val configuredFunction2 = ConfiguredFunction("kanzi.Global.<clinit>", 15.618572522029455, 8.61869990570836)
    val configuredFunctions = arrayListOf(configuredFunction1, configuredFunction2)

    @Test
    fun contextLoads() {
    }

    @Test
    fun functionValueProviderTF(){
        val requestReturn: ArrayList<ConfiguredFunction> = controller.functionValueProvider("kanzi", testRequest)
        assertEquals(configuredFunctions, requestReturn)
    }

    @Test
    fun functionListProviderTF(){
        val returnList: ArrayList<String>? = controller.functionListProvider("kanzi")
        if (returnList != null) {
            assertTrue(returnList.contains("kanzi.Global.<clinit>"))
            assertTrue(returnList.contains("kanzi.bitstream.DefaultOutputBitStream.pushCurrent"))
            assertTrue(returnList.contains("kanzi.Global.computeHistogramOrder0"))
        }
    }

    @Test
    fun connectTestTF() {
        val returnValue = controller.connectTest()
        assertEquals("test received", returnValue)
    }
}
