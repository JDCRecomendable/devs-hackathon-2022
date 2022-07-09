import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import HappyCat from './assets/happy_cat_no_bg.gif';
import AppButton from "./components/AppButton";
import PetName from './components/PetName';


const HAPPY_CAT = Image.resolveAssetSource(HappyCat).uri;
const names = ["Fizzy", "Timo", "Jed", "Tom", "Nar"]

const GetStarted = ({ navigation }) => {
    const [name, setName] = useState("")

    const createName = async (value) => {
        try {
            console.log(value)
            const name = await AsyncStorage.setItem('petName', value)
            console.log(value);
            setName(value)
        } catch (e) {
            // saving error
            console.log(e)
        }
    }

    useEffect(() => {
        const min = Math.ceil(0);
        const max = Math.floor(5);
        let randIndex = Math.floor(Math.random() * (max - min + 1) + min);
        createName(names[randIndex])
    }, [])

    return (
        <View
            style={{
                paddingTop: 80,
                flex: 1,
                alignItems: "center"
            }}>
            <Text style={styles.heading}>Theres a sleepy cat lurking by...</Text>
            {/* <Text style={styles.subHeader}>Sleep Coins: 500</Text> */}
            <Image style={{ width: 300, height: 350 }} source={{ uri: HAPPY_CAT }} />
            <PetName petName={name} />
            <View style={{ position: "absolute", bottom: "20%" }}>
                <AppButton title={`adopt ${name}`} onPress={() => navigation.navigate('PetPage')} />
                {/* <Text style={styles.subHeader}>(-500 Sleep Coins)</Text> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 36,
        fontWeight: 'bold',
        paddingBottom: 30,
    },
    subHeader: {
        color: '#452500',
        fontSize: 24,
        fontWeight: 'bold',
    },
    // button: {
    //     textColor: "white",
    //     fontSize: 24
    // }
});

export default GetStarted;