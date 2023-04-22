import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Animated, StyleSheet, Image, TouchableHighlight, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydb.db');

db.transaction(tx => {
  tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)');
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {

    /*try{}

    catch(Exception){
      
    }*/
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            console.log('Login successful');
          } else {
            Alert.alert('Error', 'Invalid email or password');
          }
        }
      );
    });
  };

  //tela de cadastro
  const handleCadastrar = () => {

  };

  const Logo = () => {
    return (
      <Image
        style={styles.logo}
        source={require('../../assets/logoboi.png')}
      />
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',// cor de fundo
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 40,
    },

    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      marginHorizontal: 10,

    },

    button: {
      backgroundColor: '#00BFFF',
      padding: 10,
      borderRadius: 20,
      marginHorizontal: 10,
      marginTop: 10, // distância entre os botões
    },

    buttonText: {
      color: 'black',
      fontSize: 24,
      fontWeight: 'bold',
    },

    textBotao:
    {
      marginTop: 10, // distância entre os botões
      backgroundColor: 'white'
    },

    logo: {
      width: 100,
      height: 100,
      borderRadius: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        style={{
          width: 200,
          height: 190,
          marginBottom: 100,
          borderRadius: 50,
        }}
        source={require('../../assets/logoboi.png')}
      />
      <TextInput style={styles.textBotao}
        placeholder="Email"
        textContentType="emailAddress"
        autoCapitalize="none"
        autoCompleteType="email"
        autoCorrect={false}
        onChangeText={setEmail}
        // style={{ backgroundColor: 'white' }}
        value={email}

      />
      <TextInput style={styles.textBotao}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      // style={{ backgroundColor: 'white' }}

      />
      <TouchableHighlight style={styles.button} onPress={handleLogin} underlayColor="#00529b">
        <Text style={styles.buttonText}>Login</Text>
      </TouchableHighlight>

      <TouchableHighlight style={styles.button} onPress={handleCadastrar} underlayColor="#00529b">
        <Text style={styles.buttonText}>Cadastra-se</Text>
      </TouchableHighlight>

    </View>
  );
};

export default Login;
