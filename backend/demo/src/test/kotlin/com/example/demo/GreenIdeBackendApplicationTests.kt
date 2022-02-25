package com.example.demo

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

@ContextConfiguration(classes=[GreenIdeBackendApplication::class])
@SpringBootTest(classes=[GreenIdeBackendApplication::class])
class GreenIdeBackendApplicationTests {

    @Test
    fun contextLoads() {
        assertEquals(0, 1 - 1)
    }

}
