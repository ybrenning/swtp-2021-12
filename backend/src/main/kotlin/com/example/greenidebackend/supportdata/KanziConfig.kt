package com.example.greenidebackend.supportdata

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class KanziConfig(
    @Id
    val id:             String,                     // primary key
    val softwareSystem: String,                     // to what software system the function belongs
    val functionName:   String,                     //
    val configs:        Map<String, Boolean>,       // Map of confings; different software systems have different number
    val energy:         Number,                     //
    val time:           Number,                     //
    )
