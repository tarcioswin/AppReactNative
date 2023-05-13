import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Animated, StyleSheet, Image, TouchableHighlight, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

//        source={require('../../assets/logoboi.png')}

//const db = SQLite.openDatabase('mydb.db');
//const db = SQLite.openDatabase('../../dataBase/boiDataBasedb.db');
const db = SQLite.openDatabase('../../dataBase/boiDataBasedb.db');
SQLite.openDatabase();

db.transaction(tx => {
  // tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS  usuarios ( id integer PRIMARY KEY AUTOINCREMENT,    nome varchar,    endereco varchar,   numero integer, email varchar, login varchar, senha varchar, data_acesso datetime, data_criacao datetime, trocar_senha datetime, numero_telefone integer, numero_fixo integer, estado varchar, data_bloqueio datetime, logado_sistema numeric) CREATE TABLE IF NOT EXISTS dados_Ia (id integer PRIMARY KEY AUTOINCREMENT,dados_IA float,id_usuarios float) IF NOT EXISTS  CREATE TABLE produtos ( id integer PRIMARY KEY AUTOINCREMENT, nome varchar, tipo varchar, estado varchar, preco float, id_usuarios integer, imagem blob) CREATE TABLE IF NOT EXISTS  dados_Log (id integer PRIMARY KEY AUTOINCREMENT,dados_acesso datetime,   id_usuarios integer)')

});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  /*
    const handleLogin3 = () => {
      db.transaction(
        tx => {
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
        },
        error => {
          console.error(error);
          Alert.alert('Error', 'Failed to execute database operation');
        }
      );
    };*/

  const handleLogin = () => {
    SQLite.openDatabase();
    const myArray = undefined;
    const arrayLength = myArray ? myArray.length : 0;
    console.log(arrayLength); // 0



    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM usuarios WHERE email = ? AND password = ?',
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

  /*
  const handleInsert = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, password],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log('User inserted successfully');
          } else {
            console.log('Insertion failed');
          }
        }
      );
    });
  };

*/
  //tela de cadastro
  const handleCadastrar = () => {
    SQLite.openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO usuarios (email, password) VALUES (?, ?)',
        //['breno2321@test.com', 'caralho'],
        [email, password],
        (_, { rowsAffected }) => {
          console.log(`${rowsAffected} row(s) inserted`);
        },
        (_, error) => {
          console.log(`Insert error: ${error}`);
        }
      );
    });

  };
  //Retornar os valores do banco de de Dados
  const handleSelecionarBase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT email, password FROM usuarios',
        [],
        (tx, results) => {
          const { rows } = results;
          const len = rows.length;
          for (let i = 0; i < len; i++) {
            const { email, password } = rows.item(i);
            console.log(`Email: ${email}, Password: ${password}`);
          }
        },
        (error) => {
          console.log('SELECT error: ', error);
        }
      );
    });




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
      <TouchableHighlight style={styles.button} onPress={handleSelecionarBase} underlayColor="#00529b">
        <Text style={styles.buttonText}>EncontrarDados</Text>
      </TouchableHighlight>

    </View>
  );
};

export default Login;
