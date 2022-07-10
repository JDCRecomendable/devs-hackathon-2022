import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View, ImageBackground, Touchable, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HappyCat from './assets/happy_cat_no_bg.gif';
import SadCat from './assets/sad_cat_no_bg.gif';
import NeutralCat from './assets/neutral_cat_no_bg.gif';
import leaveImage from './assets/leaveImage.png';
import shopIcon from './assets/shop_icon.png';
import axios from "axios";
import PetName from './components/PetName';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import changeSleepButton from './assets/setSleepButton.png';
import healthKit from './assets/healthkitIcon.png';
import { Feather } from '@expo/vector-icons';



const HAPPY_CAT = Image.resolveAssetSource(HappyCat).uri;
const SAD_CAT = Image.resolveAssetSource(SadCat).uri;
const NEUTRAL_CAT = Image.resolveAssetSource(NeutralCat).uri;
const LEAVE_IMAGE = Image.resolveAssetSource(leaveImage).uri;
const SHOP_ICON = Image.resolveAssetSource(shopIcon).uri;
const CHANGE_SLEEP_ICON = Image.resolveAssetSource(changeSleepButton).uri;
const HEALTH_KIT = Image.resolveAssetSource(healthKit).uri;


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
    const [xp, setXp] = useState(0);
    const [catImg, setCatImg] = useState(CatState.happy);
    const [catLeaveAlert, setCatLeaveAlert] = useState(false)
    const [name, setName] = useState("")
    const [achieveGoalAlert, setAchieveGoalAlert] = useState(false);
    const [achievedGoal, setAchievedGoal] = useState(false)
    const [happyColor, setHappyColor] = useState("#07F51F")

    const showGoalAchieved = () => {
        setAchieveGoalAlert(true)
    }

    useEffect(() => {
        const getName = async () => {
            const petName = await AsyncStorage.getItem("petName")
            setName(petName)
        }
        getName();
    }, [])

    const resetGame = () => {
        setCatLeaveAlert(false);
        navigation.navigate('LandingPage')
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
            // console.log("Hunger: " + hunger)
            setHunger(hunger)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchXP = async () => {
        try {
            const xpRes = await axios.get("https://ripscamera0c.pythonanywhere.com/api/v0/user/a/xp")
            const xpData = xpRes.data.xp;
            // console.log("xp: " + xpData)
            setXp(xpData)
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
            fetchXP();
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [])


    useEffect(() => {
        const interval = setInterval(() => {
            fetch("https://ripscamera0c.pythonanywhere.com/api/v0/user/a/hunger",
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({ requestType: "subtract", value: 5 })
                })
                .then(response => {
                    response.text()
                    console.log(response.text)
                })
                .catch(err => {
                    console.log(err)
                })
        }, 5000);

        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(() => {
        fetchHappiness();
        fetchHunger();
        fetchXP();
    }, [])

    useEffect(() => {
        if (happiness < 10) {
            setCatImg(CatState.sad);
            setHappyColor("#ff0000")
        } else if (happiness >= 10 && happiness < 30) {
            setCatImg(CatState.neutral)
            setHappyColor("#07F51F")
        } else {
            setCatImg(CatState.happy);
            setHappyColor("#07F51F")
        }
        console.log(hunger)
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
                    <Progress step={happiness} steps={100} height={30} text="Happiness" color={happyColor} iconName="happy" />
                </View>
                <TouchableOpacity style={{ position: "absolute", right: 30, top: 200 }} onPress={() => navigation.navigate("Goal")}>
                    <Image style={{ width: 57, height: 57, bottom: 50 }} source={{ uri: CHANGE_SLEEP_ICON }} />
                </TouchableOpacity>
                <Feather style={{ position: "absolute", left: 30, top: 150 }} name="target" size={57} color="white" onPress={() => showGoalAchieved()} />
                <View style={styles.center}>
                    <Image style={{ width: 300, height: 350 }} source={{ uri: catImg }} />
                    <PetName petName={name} />
                </View>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Shop")}>
                        <Image style={{ width: 129, height: 74, left: 20, bottom: 50 }} source={{ uri: SHOP_ICON }} />
                    </TouchableOpacity>
                    <View style={styles.xpHolder}>
                        <Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 24 }}>XP: {xp}</Text>
                    </View>
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

            <AwesomeAlert
                show={achieveGoalAlert}
                showProgress={false}
                title={achievedGoal ? "You have achieved your sleep goals!" : "Oh no, you did not meet your target :("}
                message={achievedGoal ? "+500 XP" : "No XP rewarded..."}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Contiue"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setAchieveGoalAlert(false);
                }}
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
        paddingTop: 30,
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
    xpHolder: {
        height: 50,
        width: 160,
        borderRadius: 20,
        position: "absolute",
        right: 10,
        bottom: 50,
        backgroundColor: "#F58507",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default PetPage;