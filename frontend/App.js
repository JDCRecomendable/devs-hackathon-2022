import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Animated } from 'react-native';
import Goal from './components/Goal';
import LoginPage from "./LoginPage";
import LandingPage from './LandingPage';
import PetPage from './PetPage';
import GetStarted from './GetStarted';
import Shop from './components/Shop';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style={styles.center} />
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen
            name="LandingPage"
            component={LandingPage}
          />
          <Stack.Screen
            name="GetStarted"
            component={GetStarted}
          />
          <Stack.Screen
            name="PetPage"
            component={PetPage}
          />
          <Stack.Screen
            name="Shop"
            component={Shop}
          />
          <Stack.Screen
            name="Goal"
            component={Goal}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer >
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
