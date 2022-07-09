import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View, ImageBackground } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HappyCat from './assets/happy_cat_no_bg.gif';
import SadCat from './assets/sad_cat_no_bg.gif';
import NeutralCat from './assets/neutral_cat_no_bg.gif';
import leaveImage from './assets/leaveImage.png';
import axios from "axios";
import PetName from './components/PetName';
import AwesomeAlert from 'react-native-awesome-alerts';


const HAPPY_CAT = Image.resolveAssetSource(HappyCat).uri;
const SAD_CAT = Image.resolveAssetSource(SadCat).uri;
const NEUTRAL_CAT = Image.resolveAssetSource(NeutralCat).uri;
const LEAVE_IMAGE = Image.resolveAssetSource(leaveImage).uri;

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
                {iconName == "happy" ? <MaterialCommunityIcons name="emoticon-happy" size={32} color={color} />
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
                    borderColor: 'black',
                    borderStyle: 'solid',
                    borderWidth: 3
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

const CatState = {
    neutral: NEUTRAL_CAT,
    sad: SAD_CAT,
    happy: HAPPY_CAT
}



const PetPage = ({ navigation }) => {
    const [hunger, setHunger] = useState(100);
    const [happiness, setHappiness] = useState(100);
    const [catImg, setCatImg] = useState(CatState.happy);
    const [catLeaveAlert, setCatLeaveAlert] = useState(false)

    const resetGame = () => {
        setCatLeaveAlert(false);
        navigation.navigate('GetStarted')
    }

    const fetchHappiness = async () => {
        try {
            const happinessRes = await axios.get("https://ripscamera0c.pythonanywhere.com/api/v0/user/a/happiness")
            const happiness = happinessRes.data.happiness;
            console.log("Happiness: " + happiness)
            setHappiness(happiness)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchHunger = async () => {
        try {
            const hungerRes = await axios.get("https://ripscamera0c.pythonanywhere.com/api/v0/user/a/hunger")
            const hunger = hungerRes.data.hunger;
            console.log("Hunger: " + hunger)
            setHunger(hunger)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (happiness == 0) {
                setCatLeaveAlert(true);
            }
            fetchHappiness();
            fetchHunger();
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(() => {
        if (happiness < 33) {
            setCatImg(CatState.sad);
        } else if (happiness >= 33 && happiness < 66) {
            setCatImg(CatState.neutral)
        } else {
            setCatImg(CatState.happy);
        }
    }, [happiness])

    return (
        <View style={styles.container}>
            {/* <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
                <Text>
                    {"Hunger " + hunger}
                </Text>
                <Text>
                    {"Happiness " + happiness}
                </Text>
            </View> */}
            <ImageBackground source={require('./assets/BG.png')} resizeMode="cover" style={styles.container}>
                <StatusBar style={styles.center} />
                <View style={styles.statusContainer}>
                    <Progress step={hunger} steps={100} height={30} text="Hunger" color="#F58507" iconName="" />
                    <Progress step={happiness} steps={100} height={30} text="Happiness" color="#07F51F" iconName="happy" />
                </View>
                <View style={styles.center}>
                    <Image style={{ width: 300, height: 350 }} source={{ uri: catImg }} />
                    <PetName />
                </View>
            </ImageBackground>

            <AwesomeAlert
                show={happiness === 0}
                showProgress={false}
                title="Oh No!"
                message="Bob has left you for the wild... Try get a healthier sleep schedule!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Contiue"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    resetGame();
                }}
                customView={
                    <Image style={{ width: 200, height: 200, marginTop: 20 }} source={{ uri: LEAVE_IMAGE }} />
                }
            />
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
    }
});

export default PetPage;