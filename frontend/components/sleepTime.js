import { StyleSheet, Text, TextInput, View, Form, Button } from 'react-native';
import React, { Component, useState } from 'react';

export default class SleepTime extends Component {

    constructor(props){
        super( props);
        this.state = {
            startTime: '',
            endTime: '',
            grace: ''
        }

        this.setStartTime = this.setStartTime.bind(this);
        this.setEndTime = this.setEndTime.bind(this);
        this.setGrace = this.setGrace.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setStartTime (event) {
        this.setState({
            startTime: event.nativeEvent.text
        })
    } 

    setEndTime (event) {
      this.setState({
          endTime: event.nativeEvent.text
      })
    }

    setGrace (event) {
      this.setState({
          grace: event.nativeEvent.text
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
                onChange={this.setStartTime}
                value={this.state.startTime}
                placeholder="Start Time"
            />

            <Text>Target Wake Time</Text>
            <TextInput
                style={styles.input}
                onChange={this.setEndTime}
                value={this.state.endTime}
                placeholder="End Time"
            />

          <Text>Grace Time</Text>
            <TextInput
                style={styles.input}
                onChange={this.setGrace}
                value={this.state.grace}
                placeholder="Grace time"
            />

            <Button
              title="Submit"
              
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
