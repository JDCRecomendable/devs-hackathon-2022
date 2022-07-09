import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View, ImageBackground } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Progress = ({ step, steps, height, text, color, iconName }) => {
    const [width, setWidth] = useState(0);
    const animatedValue = useRef(new Animated.Value(-1000)).current;
    const reactivate = useRef(new Animated.Value(-1000)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: reactivate,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [])

    useEffect(() => {
        reactivate.setValue(-width + (width * step) / steps)
    }, [step, width])

    return (
        <View style={{ width: "50%", padding: 30 }}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
                {iconName == "happy" ? <Ionicons name="happy" size={32} color={color} />
                    :
                    <MaterialCommunityIcons name="food-drumstick" size={32} color={color} />
                }
                <Text style={{
                    fontSize: 18,
                    fontWeight: '900',
                    color: "white",
                    paddingHorizontal: 8
                }}>
                    {/* {step / steps} */}
                    {text}
                </Text>
            </View>
            <View onLayout={(e) => {
                const newWidth = e.nativeEvent.layout.width;

                setWidth(newWidth);
            }}
                style={{
                    height,
                    // backgroundColor: 'rgba(0,0,0,0.1)',
                    backgroundColor: 'white',
                    borderRadius: height,
                    overflow: 'hidden',
                    outlineColor: "#11A6DA",
                    outlineStyle: "solid",
                    outlineWidth: 5,
                }}>
                <Animated.View style={{
                    height,
                    width: '100%',
                    borderRadius: height,
                    backgroundColor: color,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transform: [
                        {
                            translateX: animatedValue,
                        }
                    ]
                }}></Animated.View>
            </View>
        </View>
    )
}

const PetPage = () => {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index + 1) % (10 + 1));
        }, 500);

        return () => {
            clearInterval(interval);
        }
    }, [index])

    return (
        <View style={styles.container}>
            <ImageBackground source={require('./assets/BG.png')} resizeMode="cover" style={styles.container}>
                <StatusBar style={styles.center} />
                <View style={styles.statusContainer}>
                    <Progress step={index} steps={10} height={30} text="Hunger" color="#F58507" iconName="" />
                    <Progress step={index} steps={10} height={30} text="Happiness" color="#07F51F" iconName="happy" />
                </View>
                <View style={styles.center}>
                    <Image style={{ width: 300, height: 350 }} source={require('./assets/happy_cat_no_bg.gif')} />
                </View>
            </ImageBackground>
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

export default PetPage;