import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import petNameHolder from '../assets/PetNameHolder.png';

const PET_NAME_HOLDER = Image.resolveAssetSource(petNameHolder).uri;

export default function PetName({ petName }) {
    return (
        <View style={styles.petNameContainer}>
            <ImageBackground style={{ width: "100%", height: 50, justifyContent: "center", alignItems: "center" }} source={{ uri: PET_NAME_HOLDER }} >
                <Text style={styles.text}>
                    {petName}
                </Text>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    petNameContainer: {
        width: "50%"
    }
});