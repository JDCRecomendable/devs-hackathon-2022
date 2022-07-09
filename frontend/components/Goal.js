import { Text, View, StyleSheet, Image, Button, TouchableHighlight,TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import moment from 'moment';
import axios from "axios";



export default function Goal ({}) {
    const [bedTime, setBedTime] = useState("12:00");
    const [wakeUpTime, setWakeUpTime] = useState("12:00");
    const [totalHour,setTotalHour] = useState();
    const [total, setTotal] = useState(0);
    const [wakeDates,setWakeDate] = useState();
    const [bedDates,setBedDate] = useState();

    const onSetGoal = () => {

    }

    // useEffect(() => {
    //     axios.get("https://ripscamera0c.pythonanywhere.com/api/v0/user/a/xp").then((response) => {
    //         setXp(response.data);
    //         console.log(response.data)
    //       });
    // },[])

    useEffect(() => {

        const wakeDate = new Date( moment().format("YYYY-MM-DD") + "T"+wakeUpTime+":00");
        const bedDate = new Date(moment().format("YYYY-MM-DD") + "T"+bedTime+":00");
        setWakeDate(wakeDate);
        setBedDate(bedDate);
        const _MS_PER_HOUR = 1000 * 60 * 60;

        // Discard the time and time-zone information.
        if(wakeDate && bedDate){
            const utc2 = Date.UTC(wakeDate.getFullYear(), wakeDate.getMonth(), wakeDate.getDate());
            const utc1 = Date.UTC(bedDate.getFullYear(), bedDate.getMonth(), bedDate.getDate());
            console.log(Math. abs)
            console.log(bedDate)
            console.log(utc2)
            console.log(utc1)
            console.log((utc2 - utc1) / _MS_PER_HOUR);
            setTotal((wakeDate - bedDate) / 36e5 > 0?parseFloat((wakeDate - bedDate) / 36e5).toFixed(2):0);
            setTotalHour((wakeDate - bedDate) / 36e5 > 0?parseFloat((wakeDate - bedDate) / 36e5).toFixed(2) +" hours":"/");
        }
        

    },[bedTime,wakeUpTime]);
    

    return(
        <View style={styles.goalWrapper}>
            <Text style={{fontSize:35,fontWeight:"700", marginTop:60}}>Sleep Time</Text>

            <View style={styles.timeRow}>
                <View style={styles.timeWrapper}>
                    <TextInput
                    label="hh:mm"
                    style={styles.time}
                    onChangeText={setBedTime}
                    value={bedTime}
                    placeholder=""
                    keyboardType="time"
                    mode='outlined'
                    activeOutlineColor='#1BB55C'                
                    />
                    <Text style={styles.timeLabel}>Bedime goal</Text>
                </View>
                <View style={styles.timeWrapper}><TextInput
                label="hh:mm"
                    style={styles.time}
                    onChangeText={setWakeUpTime}
                    value={wakeUpTime}
                    placeholder=""
                    keyboardType="text"
                    mode='outlined'
                    activeOutlineColor='#1BB55C'

                    /><Text style={styles.timeLabel}>Wake-up time goal</Text></View>
            </View>
            <AnimatedCircularProgress
                size={250}
                width={40}
                rotation={0}
                fill={total/0.12}
                tintColor="#F58507"
                backgroundColor="#3d5875" 
                style={{marginTop:60}}/>

        <Text style={{fontSize:35,fontWeight:"700", marginTop:60}}>Total time: {totalHour}</Text>

        <TouchableOpacity
                                style={{marginTop:60, backgroundColor:'#F58507', paddingLeft:40,paddingRight:40,paddingTop:20,paddingBottom:20,borderRadius:30}}
                                underlayColor='#F58507'>
                                    <Text style={{color:"white",fontSize:25}}>Set Goal</Text>
                                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    goalWrapper: {
        alignItems:'center',
    justifyContent:'center',
    width:"100%"
    },

    timeWrapper: {
        alignItems:'center',
    justifyContent:'center',
    width:"45%",
    },
    time: {
        width:"100%",
        height:40
        // border:"1px solid #1BB55C",
        // height:"40px",
        // borderRadius:"10px",
        // backgroundColor:"transparent",
    },
    timeLabel: {
        fontWeight:"200",
    },
    timeRow: {
    
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent:'space-between',
    width:"80%",
    marginTop:40,
},

})