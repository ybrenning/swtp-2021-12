package com.example.greenidebackend.dataclasses

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class DBEntity(
    @Id
    val id:             String,                     // primary key
    val softwareSystem: String,                     // to what software system the function belongs
    val functionName:   String,                     //
    val configs:        ArrayList<DBConfiguration>, // Map of configs; different software systems have different number
    val energy:         Double,                     //
    val time:           Double,                     //
    )
