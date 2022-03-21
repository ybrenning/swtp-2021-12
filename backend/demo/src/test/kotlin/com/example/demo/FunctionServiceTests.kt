package com.example.demo

import com.example.demo.dataclasses.ConfiguredFunction
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class FunctionServiceTests @Autowired constructor(
    private val service: FunctionValueCalculatorService
){

    private val functions = arrayListOf("kanzi.Global$1.compare", "kanzi.Global.<clinit>")
    private val configs = arrayListOf("root", "CHECKSUM")

    private val configuredFunction1 = ConfiguredFunction("kanzi.Global$1.compare", 0.17315721808227894, 0.09236394624248921)
    private val configuredFunction2 = ConfiguredFunction("kanzi.Global.<clinit>", 15.618572522029455, 8.61869990570836)
    private val configuredFunctions = arrayListOf(configuredFunction1, configuredFunction2)

    @Test
    fun contextLoads() {
    }

    /*
    @Test
    fun calcFunctionValuesTF() {
        val requestReturn: ArrayList<ConfiguredFunction> = service.calcFunctionValues("kanzi", functions, configs)
        Assertions.assertEquals(configuredFunctions, requestReturn)
    }

    @Test
    fun getAllFunctionsTF() {
        val returnList = service.getAllFunctions("kanzi")
        if (returnList != null) {
            Assertions.assertTrue(returnList.contains("kanzi.Global.<clinit>"))
            Assertions.assertTrue(returnList.contains("kanzi.bitstream.DefaultOutputBitStream.pushCurrent"))
            Assertions.assertTrue(returnList.contains("kanzi.Global.computeHistogramOrder0"))
        }
    }
     */
}
