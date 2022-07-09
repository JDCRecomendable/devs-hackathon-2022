import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, Animated } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const Progress = ({ step, steps, height, text, color }) => {
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
      <Text style={{
        fontSize: 12,
        fontWeight: '900',
        marginBottom: 4
      }}>
        {/* {step / steps} */}
        {text}
      </Text>
      <View onLayout={(e) => {
        const newWidth = e.nativeEvent.layout.width;

        setWidth(newWidth);
      }}
        style={{
          height,
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: height,
          overflow: 'hidden',
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

export default function App() {
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
      {/* <Text>Wow this s awd</Text> */}
      <StatusBar style={styles.center} />
      <View style={styles.statusContainer}>
        <Progress step={index} steps={10} height={30} text="Hunger" color="#F58507" />
        <Progress step={index} steps={10} height={30} text="Happiness" color="#07F51F" />
      </View>
      {/* <ImageBackground source={require('./assets/BG.png')} resizeMode="cover" style={styles.image}> */}
      <View style={styles.center}>
        <Image style={{ width: 300, height: 350 }} source={require('./assets/happy_cat_no_bg.gif')} />
      </View>
      {/* </ImageBackground> */}
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
