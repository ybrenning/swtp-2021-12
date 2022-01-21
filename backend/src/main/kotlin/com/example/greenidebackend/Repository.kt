package com.example.greenidebackend

import com.example.greenidebackend.supportdata.DBEntity
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface Repository: MongoRepository<DBEntity, String> {

    fun findBySoftwareSystem(softwareSystem: String): List<DBEntity>
    fun findConfigsForFunction(functionName: String): List<DBEntity>
}