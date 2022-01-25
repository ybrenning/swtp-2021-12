package com.example.greenidebackend.dataclasses

import org.springframework.data.annotation.Id


data class DBConfiguration(

    @Id
    val id: String,                 // primary key
    val softwareSystem: String,     // what software system does it belong to
    val name: String,               // name of the configuration as in the .csv
    val number: Int,                // what position is it in the request list
    val status: Boolean,            // is it active for the current function (see DBEntity)
)