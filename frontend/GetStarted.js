import React from 'react';
import { Text, View, StyleSheet, Image, Button } from 'react-native';
import HappyCat from './assets/happy_cat_no_bg.gif';
import AppButton from "./components/AppButton"
import PetName from './components/PetName';


const HAPPY_CAT = Image.resolveAssetSource(HappyCat).uri;

const GetStarted = ({ navigation }) => {
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
            <PetName />
            <View style={{ position: "absolute", bottom: "20%" }}>
                <AppButton title="Adopt Bob" onPress={() => navigation.navigate('PetPage')} />
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