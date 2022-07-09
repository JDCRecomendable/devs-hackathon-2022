import { StyleSheet, Text, TextInput, View, Form } from 'react-native';
import React, { Component, useState } from 'react';

export default class SleepTime extends Component {

    constructor(props){
        super( props);
        this.state = {
            startTime: '',
        }

        this.handleStartTime = this.handleStartTime.bind(this);
        this.handleEndTime = this.handleEndTime.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleStartTime (event) {
        this.setState({
            startTime: event.nativeEvent.text
        })
    } 

    handleEndTime (event) {
      this.setState({
          endTime: event.nativeEvent.text
      })
  } 

    handleSubmit = (event) => {
        this.setState({

        })
    }


  render() {
        return  (
        <View style={styles.container}>
          <Text>Set Sleep Time</Text>
          
            <Text>Target Sleep Time</Text>
            <TextInput
                style={styles.input}
                onChange={this.handleStartTime}
                value={this.state.startTime}
                placeholder="Start Time"
            />

            <Text>Target Wake Time</Text>
            <TextInput
                style={styles.input}
                onChange={this.handleEndTime}
                value={this.state.endTime}
                placeholder="End Time"
            />

          
          
          
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
