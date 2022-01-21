package com.example.greenidebackend

import com.example.greenidebackend.supportdata.ConfiguredFunction
import com.example.greenidebackend.supportdata.DBEntity
import org.springframework.stereotype.Service

@Service
class FunctionValueCalculatorService(
    val repository: Repository
) {
    // functions related to calculating the required values from the given configurations
    fun calcFunctionValues(
        softwareSystem: String,
        functionsToFind: ArrayList<String>,
        configsToFind: ArrayList<Boolean>
    ): ArrayList<ConfiguredFunction> {
        val configuredFunctions: ArrayList<ConfiguredFunction> = ArrayList()

        //repeat for all functions that are requested
        for(function in functionsToFind) {
            val functionConfigsRaw: List<DBEntity> = repository.findConfigsForFunction(function)
            var functionResultEnergy = 0.0
            var functionResultTime   = 0.0

            //repeat for each configuration returned from the database
            for(functionConfigRaw in functionConfigsRaw) {
                var requestedConfigNr = 0

                //repeat for every configuration that is requested
                for(configToFind in configsToFind) {

                    //is this config #requested AND #the one in this database entry
                    if(configToFind && functionConfigRaw.configs[configurationNameFromNumber(requestedConfigNr, functionConfigRaw.softwareSystem)] == true) {
                        functionResultEnergy += functionConfigRaw.energy
                        functionResultTime   += functionConfigRaw.time
                        break
                    }
                    // increment the config counter to keep track of the requested config in question
                    // (the config in the requested configs is determined by the position in the array)
                    requestedConfigNr++
                }
            }
            //add the function with its calculated values to the return list
            configuredFunctions.add(ConfiguredFunction(function, functionResultEnergy, functionResultTime))
        }

        return configuredFunctions
    }

    // functions related to getting all available functions in the programs
    fun getAllFunctions(softwareSystem: String): ArrayList<String>? {
        val functionsNoDupes: ArrayList<String> = ArrayList()
        val functions: List<DBEntity> = repository.findBySoftwareSystem(softwareSystem)

        for (obj in functions) {
            if(!functionsNoDupes.contains(obj.functionName)){
                functionsNoDupes.add(obj.functionName)
            }
        }

        return functionsNoDupes
    }

    //convert position in the requested configs list to the actual config name
    fun configurationNameFromNumber(i: Number, softwareSystem: String): String {
        return when (softwareSystem) {
            "kanzi" -> when (i) {
                0  -> "root"
                1  -> "BLOCKSIZE"
                2  -> "JOBS"
                3  -> "LEVEL"
                4  -> "CHECKSUM"
                5  -> "SKIP"
                6  -> "NoTransform"
                7  -> "Huffman"
                8  -> "ANS0"
                9  -> "ANS1"
                10 -> "Range"
                11 -> "FPAQ"
                12 -> "TPAQ"
                13 -> "CM"
                14 -> "NoEntropy"
                15 -> "BWTS"
                16 -> "ROLZ"
                17 -> "RLT"
                18 -> "ZRLT"
                19 -> "MTFT"
                20 -> "RANK"
                21 -> "TEXT"
                22 -> "X86"
                else -> ""
            }
            "density-converter" -> when (i) {
                0  -> "root"
                1  -> "AllPlatforms"
                2  -> "Android"
                3  -> "Windows"
                4  -> "Web"
                5  -> "IOS"
                6  -> "IncludeLdpiTvdpi"
                7  -> "MipmapInODrawable"
                8  -> "AntiAliasing"
                9  -> "CreateImagesetFolders"
                10 -> "Keep"
                11 -> "PNG"
                12 -> "BMP"
                13 -> "GIF"
                14 -> "JPG"
                15 -> "round"
                16 -> "ceil"
                17 -> "floor"
                18 -> "skipExisting"
                19 -> "QualityComp"
                20 -> "Scale"
                21 -> "Threads"
                else -> ""
            }
            else -> ""
        }
    }

}
