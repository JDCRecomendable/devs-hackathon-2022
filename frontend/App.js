import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Animated } from 'react-native';
import Goal from './components/Goal';
import Shop from './components/Shop';
import LoginPage from "./LoginPage";
import PetPage  from './PetPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {


  return (
    <View style={styles.container}>
      {/* <StatusBar style={styles.center} /> */}
      {/* <PetPage/> */}
      {/* <LoginPage /> */}
      {/* <Shop /> */}
      <Goal></Goal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    position: "absolute",
    width: "100%",
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});
