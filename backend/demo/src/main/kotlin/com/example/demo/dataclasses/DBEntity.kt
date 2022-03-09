package com.example.demo.dataclasses

import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.annotation.Id

@Document
data class DBEntity(
    val softwareSystem: String,                     // to what software system the function belongs
    val functionName: String,                     //
    val configs: Map<String, Boolean>,       // Map of configs; different software systems have different number
    val energy: Double,                     //
    val time: Double, //
    @Id val id: String = ObjectId.get().toString(),
)

