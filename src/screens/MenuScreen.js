import React from "react";
import { View,Text,StatusBar,Image } from "react-native";

const MenuScreen = ()=>{
    return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"white"}}>
            <StatusBar backgroundColor={'white'} barStyle={'dark-content'}  />
            <Text>Menu Screen</Text>
            <Image source={require("../assets/data.png")} style={{height:300,width:300,resizeMode:"contain"}}></Image>
        </View>
    )
}

export default MenuScreen