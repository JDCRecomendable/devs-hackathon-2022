import { Animated, Image, StyleSheet, Text, View, ImageBackground, Button, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import SleepyCatsHeading from './assets/SleepyCatsHeading.png';

const HEADING = Image.resolveAssetSource(SleepyCatsHeading).uri;


export default function LandingPage({ navigation }) {

    return (
        <View style={styles.container}>
            <ImageBackground source={require('./assets/sleepycat-crop.jpg')} resizeMode="cover" style={styles.container}>

                <View style={styles.statusContainer}>
                    <Image style={{ width: "80%", height: 95 }} source={{ uri: HEADING }} />
                    <View style={{ width: "100%", alignItems: 'center', paddingTop: 50 }}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GetStarted')}>
                            <Text style={{ color: 'white', fontSize: 20 }}>Begin your journey</Text>
                        </TouchableOpacity>
                        {/* BUTTON ISN"T ROUTED TO ANYTHING YET */}
                    </View>
                </View>

            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: "100%",
        backgroundColor: ""
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    statusContainer: {
        position: "absolute",
        width: "100%",
        paddingTop: 150,
        justifyContent: "center",
        alignItems: 'center'
    },
    button: {
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 100,
        width: "80%",
        padding: 10,
        backgroundColor: '#F58507',
    }
});
