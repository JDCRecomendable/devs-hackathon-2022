import axios from "axios";
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ImageBackground } from 'react-native-web';

const Shop = ({ navigation }) => {
    const [xp, setXp] = useState(0);

    // useEffect(() => {
    //     axios.get("/api/v0/user/" + id + "/xp").then((response) => {
    //         setXp(response.data);
    //     });
    // }, [])

    return (
        <View style={styles.shopCenter}>
            <View style={styles.shopWrapper}>
                <Image style={styles.title} source={require("./../assets/Component4.png")}></Image>

                <ImageBackground style={{
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexDirection: 'row', width: 450, marginTop: 20, height: 450
                }} resizeMode="cover" source={require("./../assets/wood3.png")}>
                    <TouchableOpacity style={styles.item}>
                        <Image style={styles.foodImg} source={require("./../assets/stake.png")}></Image>
                        <Text style={styles.xp}>5 xp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={styles.foodImg} source={require("./../assets/egg.png")}></Image>
                        <Text style={styles.xp}>10 xp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Image style={styles.foodImg2} source={require("./../assets/rice.png")}></Image>
                        <Text style={styles.xp}>25 xp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                    </TouchableOpacity>
                </ImageBackground>
                <Text style={{ fontSize: 35, fontWeight: 600 }}>Your XP: {xp}</Text>
                <TouchableOpacity
                    style={{ marginTop: 40, backgroundColor: '#F58507', paddingLeft: "40px", paddingRight: 40, paddingTop: 20, paddingBottom: 20, borderRadius: 30 }}
                    underlayColor='#F58507'>
                    <Text style={{ color: "white", fontSize: 25 }}>Back</Text>
                </TouchableOpacity>


            </View>



        </View>

    );
}

const styles = StyleSheet.create({
    shopCenter: {
        width: "100%",
        height: "100%",
    },
    shopWrapper: {
        backgroundColor: "#DFCEAF",
        width: "100%",
        height: "100%",
        textAlign: "center",
        alignItems: "center"
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        width: 250,
        height: 100,
        resizeMode: "contain",
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    foodImg: {
        width: "100%",
        height: "70px",
        resizeMode: "contain",
        marginTop: 80,

    },
    item: {
        width: "40%",
        position: "relative",
        alignItems: 'center',

    },
    xp: {
        backgroundColor: "#F58507",
        width: "40%",
        padding: "5px",
        borderRadius: "20px",
        marginTop: "10px",
    },
    foodImg2: {
        width: "100%",
        height: "80px",
        resizeMode: "contain",
    },
});

export default Shop;