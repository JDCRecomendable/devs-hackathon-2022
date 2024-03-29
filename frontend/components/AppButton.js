import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function AppButton(props) {
    const { onPress, title = 'Save' } = props;
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignContent: "center",
        textAlign: "center",
        backgroundColor: "#F58507",
        paddingVertical: 16,
        paddingHorizontal: 50,
        borderRadius: 50
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
        fontWeight: 'bold'
    }
});