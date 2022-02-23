package com.example.demo.dataclasses

//format of incoming request to the api
data class Request (val functions: ArrayList<String>, val configs: ArrayList<String>)
