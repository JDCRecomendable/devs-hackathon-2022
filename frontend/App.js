import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text>Wow this s awd</Text> */}
      <StatusBar style="auto" />
      <ImageBackground source={require('./assets/BG.png')} resizeMode="cover" style={styles.image}>
        <Image style={{ width: 300, height: 350 }} source={require('./assets/happy_cat_no_bg.gif')} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
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
