package com.example.demo.dataclasses

import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.annotation.Id

@Document
data class DBEntity(
    val softwareSystem: String,
    val functionName: String,
    val configs: Map<String, Boolean>,
    val energy: Double,
    val time: Double,
    @Id val id: String = ObjectId.get().toString(),
)
