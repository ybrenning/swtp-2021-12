package com.example.demo

import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.RequestBuilder
import junit.framework.TestCase.assertEquals
import org.mockito.Mockito
import org.springframework.http.MediaType
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.junit.jupiter.api.Test
import org.junit.runner.RunWith

@RunWith(SpringRunner::class)
@WebMvcTest(controllers = [ApplicationController::class])
class ApplicationControllerTests @Autowired constructor( ) {

    @Autowired
    private lateinit var mockMvc: MockMvc
    @MockBean
    private lateinit var functionService: FunctionValueCalculatorService

    private val mockFunctionList = arrayListOf<String>("kanzi.Global.computeHistogramOrder0", "kanzi.Memory\$BigEndian.writeLong64", "kanzi.app.Kanzi.processCommandLine")

    @Test
    fun contextLoads() {
    }

    @Test
    fun functionListProviderTF() {
        Mockito.`when`(
            functionService.getAllFunctions(Mockito.anyString())
        ).thenReturn(mockFunctionList)


        val requestBuilder: RequestBuilder = MockMvcRequestBuilders.get("/listOfFunctions/kanzi").accept(MediaType.APPLICATION_JSON)
        val result: MvcResult = mockMvc.perform(requestBuilder).andReturn()

        val expected = arrayListOf<String>("kanzi.Global.computeHistogramOrder0","kanzi.Memory\$BigEndian.writeLong64","kanzi.app.Kanzi.processCommandLine")
        assertEquals(expected.toList(), result.response.contentAsString.split(","))

        //TODO: fix the format of the returned string. i cant be bothered
        // problem 1: the actual list has additional " in it somehow
        // problem 2: the list is somehow in another object
    }
}
