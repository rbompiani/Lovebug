import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';

import * as translations from './assets/translations.json';

export default function App() {

  /* STATE AND HANDLERS FOR DIRECT SERVO ANGLE CONTROL
  const [angle, setAngle] = useState();

  const angleInputHandler = (ang) => {
    setAngle(ang);
  }

  const clearInputHandler = () => {
    setAngle("");
  }

  const sendAngle = () => {
    console.log("your angle is: ", angle);
    fetch('http://10.0.0.218/angle', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        angle: angle
      })
    }).then(clearInputHandler())
  }*/

  const binaryCharacters = translations.characters;
  const servoAngles = translations.angles;

  const [message, setMessage] = useState();
  const [binaryMessage, setBinaryMessage] = useState([]);
  const [encodedMessage, setEncodedMessage] = useState();

  const clearInputHandler = () => {
    setMessage("");
    setBinaryMessage([]);
    setEncodedMessage();
  }

  // ----- HANDLE INPUT ----- // stores plain text and binary characters from input to state
  const messageInputHandler = (mes) => {

    // binary lookup
    let tempBinary = [];
    for (i = 0; i < mes.length; i++) {
      const letter = mes[i].toUpperCase();
      tempBinary.push(binaryCharacters[letter]);
    }

    // set plain text message
    setMessage(mes);

    // set binary message
    setBinaryMessage(tempBinary)
  }

  // ----- SEND MESSAGE ----- // this converts text message to encoded object (char,binary char, servo angles) and sends fetch POST
  const sendMessage = () => {

    // create temporary object to add to encoded state
    let tempMessage = { message: [] };

    // for each character in the message...
    for (i = 0; i < message.length; i++) {

      //select binary character that matches message character
      const binaryChar = binaryMessage[i];
      let leftBinary = "";
      let rightBinary = "";

      //split binary digits into left & right columns
      for (let digitIndex = 0; digitIndex < binaryChar.length; digitIndex++) {
        if (!(digitIndex % 2)) {
          leftBinary += binaryChar.charAt(digitIndex);
        } else {
          rightBinary += binaryChar.charAt(digitIndex);
        }
      }

      // TO DO:: convert binary left and rights to servo angles

      // create object for each message character
      const tempCharObj = { character: message.charAt(i), binary: binaryMessage[i], leftAngle: servoAngles[leftBinary], rightAngle: servoAngles[rightBinary] };

      tempMessage.message.push(tempCharObj);
    }

    setEncodedMessage(tempMessage);
    console.log("This is what you have saved as text: ", message);
    console.log("This is what you have saved as binary: ", binaryMessage);
    console.log("This is what you have saved as encoded: ", tempMessage);

    // TO DO:: fetch post request to arduino...& firebase?
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Message:</Text>
      <TextInput
        autoCompleteType="off"
        autoCorrect={false}
        autoFocus={true}
        style={styles.input}
        placeholder="enter message"
        underlineColorAndroid="transparent"
        //keyboardType="number-pad"
        value={message}
        onChangeText={messageInputHandler}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.button} >
          <Button title="Send" onPress={sendMessage} />
        </View>
        <View style={styles.button} >
          <Button title="Clear" onPress={clearInputHandler} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginVertical: 20,
    fontSize: 30
  },
  input: {
    width: '80%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    fontSize: 80,
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonContainer: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20
  },
  button: {
    width: 100,
    margin: 10
  }
});
