import { Animated, Image, StyleSheet, Text, View, ImageBackground, Button, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';

class LandingPage extends Component {

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('./assets/sleepycat-crop.jpg')} resizeMode="cover" style={styles.container}>

                    <View style={styles.statusContainer}>
                        <Text style={{fontSize: 30, margin: 15}}>PLACE HOLDER</Text>
                        <View style={{width: "100%", alignItems: 'center'}}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={{color: 'white', fontSize:20}}>Begin your journey</Text>
                            </TouchableOpacity>
                            {/* BUTTON ISN"T ROUTED TO ANYTHING YET */}
                        </View>
                    </View>
                    
                </ImageBackground>
            </View>
        )
    }    
}

export default LandingPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: "100%",
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
  