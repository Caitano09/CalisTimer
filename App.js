import * as React from "react";
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import HomeScreen from "./src/screen/HomeScreen"
import EMOMScreen from "./src/screen/EMOMScreen"
import IsometriaScreen from "./src/screen/IsometriaScreen"
import AMRAPScreen from "./src/screen/AMRAPScreen"
import AboutScreen from './src/screen/AboutScreen'

const  AppNavigator = createStackNavigator({
  Home: HomeScreen,
  EMOM: EMOMScreen,
  Isometria: IsometriaScreen,
  AMRAP: AMRAPScreen,
  About: AboutScreen
}, {initialRouteName: 'Home'})

export default createAppContainer(AppNavigator)       


