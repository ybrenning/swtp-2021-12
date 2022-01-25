package com.example.greenidebackend

import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Spy
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
internal class FunctionValueCalculatorServiceTest {

    @Mock
    lateinit var repo: Repository

    @InjectMocks
    lateinit var functionValueCalculatorService: FunctionValueCalculatorService

    @Test
    fun calcFunctionValues() {
    }

    @Test
    fun getAllFunctions() {
        val service: FunctionValueCalculatorService = FunctionValueCalculatorService(repo)
       service.getAllFunctions("kanzi")
    }

    @Test
    fun configurationNameFromNumber() {
    }

    @Test
    fun getRepository() {
    }
}