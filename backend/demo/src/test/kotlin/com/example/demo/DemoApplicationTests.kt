package com.example.demo

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class DemoApplicationTests {

	@Test
	fun contextLoads() {
		assertEquals(0, 1 - 0)
	}

}
