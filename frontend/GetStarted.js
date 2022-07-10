import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TextInput } from 'react-native';
import HappyCat from './assets/happy_cat_no_bg.gif';
import AppButton from "./components/AppButton";
import PetName from './components/PetName';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios"


const HAPPY_CAT = Image.resolveAssetSource(HappyCat).uri;
const names = ["Fizzy", "Timo", "Jed", "Tom", "Nar"]

const GetStarted = ({ navigation }) => {
    const [name, setName] = useState("")
    const [catNameAlert, setCatNameAlert] = useState(true)

    const createName = async (value) => {
        try {
            console.log(value)
            const name = await AsyncStorage.setItem('petName', value)
            console.log(value);
            setName(value);
            setCatNameAlert(false);
        } catch (e) {
            // saving error
            console.log(e)
        }
    }

    // useEffect(() => {
    //     const min = Math.ceil(0);
    //     const max = Math.floor(5);
    //     let randIndex = Math.floor(Math.random() * (max - min + 1) + min);
    //     createName(names[randIndex])
    // }, [])

    useEffect(() => {
        fetch("https://ripscamera0c.pythonanywhere.com/api/v0/reset-user",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ ID: "a" })
            })
            .then(response => {
                response.json()
            }
            )
            .then(data => {
                console.log('Success:', data);
            })
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
                <AppButton title={`adopt ${name}`} onPress={() => navigation.navigate('Goal')} />
                {/* <Text style={styles.subHeader}>(-500 Sleep Coins)</Text> */}
            </View>
            <AwesomeAlert
                show={catNameAlert}
                showProgress={false}
                title="A cat has arrived by your doorstep"
                message="Give it a new name!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="Contiue"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    createName(name);
                }}
                customView={
                    <TextInput
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                        placeholder="Cat name"

                    />
                }
            />
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    // button: {
    //     textColor: "white",
    //     fontSize: 24
    // }
});

export default GetStarted;