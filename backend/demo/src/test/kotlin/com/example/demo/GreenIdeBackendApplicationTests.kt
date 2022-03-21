package com.example.demo

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration

@ContextConfiguration(classes=[GreenIdeBackendApplication::class])
@SpringBootTest(classes=[GreenIdeBackendApplication::class])
class GreenIdeBackendApplicationTests {

    @Test
    fun contextLoads() {
    }
}
