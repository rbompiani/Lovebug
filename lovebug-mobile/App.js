import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';

export default function App() {

  const [angle, setAngle] = useState();

  const angleInputHandler = (ang) => {
    setAngle(ang);
  }

  const clearInputHandler = () => {
    setAngle("");
  }

  const sendAngle = () => {
    console.log("your angle is: ", angle);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Servo Angle:</Text>
      <TextInput
        autoCompleteType="off"
        autoCorrect={false}
        autoFocus={true}
        style={styles.input}
        placeholder="0 - 180"
        value={angle}
        onChangeText={angleInputHandler}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.button} >
          <Button title="Send" onPress={sendAngle} />
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
