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

  const [message, setMessage] = useState();
  const [binaryMessage, setBinaryMessage] = useState([]);
  const [encodedMessage, setEncodedMessage] = useState([]);

  const clearInputHandler = () => {
    setMessage("");
  }

  const messageInputHandler = (mes) => {
    let tempBinary = [];
    for (i = 0; i < mes.length; i++) {
      const letter = mes[i].toUpperCase();
      tempBinary.push(binaryCharacters[letter]);
    }
    setMessage(mes);
    setBinaryMessage(tempBinary)
  }

  const sendMessage = () => {
    // take messsage and encode it to binary
    console.log("This is what you have saved as binary: ", binaryMessage);
    //split even & odd characters (left/right)
    //convert left & right binary configurations to servo angles
    //send fetch post request to arduino...& firebase?
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
