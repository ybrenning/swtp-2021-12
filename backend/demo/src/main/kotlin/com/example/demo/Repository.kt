package com.example.demo

import com.example.demo.dataclasses.DBEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface Repository: MongoRepository<DBEntity, String> {
    fun findBySoftwareSystem(softwareSystem: String): List<DBEntity>
    fun findByFunctionName(functionName: String): List<DBEntity>
}
