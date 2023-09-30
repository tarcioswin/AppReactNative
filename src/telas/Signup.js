import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Pressable, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import Boi from '../../assets/logoboi.png';
import COLORS from '../../components/colors';

import {auth} from '../services/firebaseConfig'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from "firebase/firestore"; 

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDsjpaiUGsSX6umoxBSBWVwkfk26w5eXXM",
  authDomain: "dbboiapp.firebaseapp.com",
  projectId: "dbboiapp",
  storageBucket: "dbboiapp.appspot.com",
  messagingSenderId: "52349007610",
  appId: "1:52349007610:web:c988a944c6f7e478aefb43",
  measurementId: "G-VB0NZPHDN4"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const Registrar = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ddd, setDdd] = useState('');

  const [backgroundColor, setBackgroundColor] = useState(COLORS.white);
  const [boiHeaderImageWidth, setBoiHeaderImageWidth] = useState(30);
  const [boiContentImageWidth, setBoiContentImageWidth] = useState(100);



  useLayoutEffect(() => {
    const windowWidth = Dimensions.get('window').width;
    // You can adjust the header image size here based on your preference
    const headerImageWidth = 200;
    setBoiHeaderImageWidth(headerImageWidth);
  }, []);

  
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image source={Boi} style={[styles.boiImage, { width: boiHeaderImageWidth, height: boiHeaderImageWidth }]} />
          <Text style={styles.headerTitle}>Cotação do Boi</Text>
        </View>
      ),
      headerTintColor: 'black',
      headerStyle: { backgroundColor: "white" },
      headerTitleStyle: { fontWeight: 'bold' }
    });
  }, [backgroundColor]);




  const handleRegister = async () => {

    if (!isChecked) {
      // Show an alert or take any other action to notify the user that they need to accept the terms and conditions.
      Alert.alert(
        'Termos e Condições',
        'Você precisa aceitar os termos e condições para prosseguir com o cadastro.'
      );
      return;
    }

    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const fullPhoneNumber = `+55${ddd}${telefone}`;

      await setDoc(doc(db, "usuario", user.uid), {
        nome: name,
        email: email,
        telefone: fullPhoneNumber,
      });
  
      console.log('Document successfully written!');
      console.log('User created:', user);
  
      // Show the pop-up with the message "Usuário cadastrado"
      Alert.alert(
        'Usuário cadastrado',
        'Você foi cadastrado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      let customErrorMessage = "Invalid email or password"; // Default error message

      // Customize the error message based on the error code
      if (errorCode === "auth/invalid-email") {
        customErrorMessage = "Invalid email format";
      } else if (errorCode === "auth/wrong-password") {
        customErrorMessage = "Incorrect password";
      } else if (errorCode === "auth/email-already-in-use") {
        customErrorMessage = "Usuário já cadastrado";
      }
      Alert.alert("Login Error", customErrorMessage, [{ text: "OK" }]);
  
      try {
        // Handle Firestore document writing errors here
        throw new Error('Error writing document: ' + error.message);
      } catch (error) {
        console.error(error);
      }
    }
  };
  






  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 1 }}>
        <View style={{ marginTop: 1 }}>
          <Text style={styles.label}>Nome</Text>
          <View style={{
            width: "95%",
            alignSelf: "center", 
            height: 48,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 22,
          }}>
            <TextInput
              placeholder='Entre com seu nome'
              placeholderTextColor={COLORS.black}
              keyboardType='default'
              style={{width: "100%"}}
              onChangeText={(text) => setName(text)}
            />
          </View>
        </View>

        <View style={{ marginBottom: 1 }}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Entre com seu email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
        </View>
        <View style={{ marginBottom: 1 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 1,
                        fontWeight: 'bold',
                        paddingLeft: 12,
                    }}>Número de telefone</Text>
                    


                    
                    <View style={{
                        width: "95%",
                        alignSelf: "center", 
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingLeft: 20
                    }}>
                        <TextInput
                            placeholder='DDD'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "12%",
                                borderRightWidth: 1,
                                borderLeftColor: COLORS.grey,
                                height: "100%"
                            }}
                            onChangeText={(text) => setDdd(text)}
                        />
                        <TextInput
                            placeholder='Entre com seu número'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{width: "80%" }}
                            onChangeText={(text) => setTelefone(text)}
                        />
                    </View>
                </View>



        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Entre com seu password"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.passwordVisibilityIcon}
            >
              {isPasswordShown ? (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>



        <View style={{
                    flexDirection: 'row',
                    marginVertical: 6,
                    width: "95%",
                    alignSelf: "center", 
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? COLORS.primary : undefined}
                    />
            <Text style={{
                         fontWeight: 'bold',
                    }}>Eu aceito os termos e condições propostas</Text>
                </View>




        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} >
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>



        {/* Your Social Media Buttons JSX */}
        <View style={styles.socialMediaButtonsContainer}>
          <TouchableOpacity style={styles.socialMediaButton}>
            <Image
              source={require('../../assets/facebook.png')}
              style={{ height: 36, width: 36, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialMediaButton}>
            <Image
              source={require('../../assets/google.png')}
              style={{ height: 36, width: 36, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text>Google</Text>
          </TouchableOpacity>
        </View>


       

        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Eu Já tenho login</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 1,
    paddingLeft: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    left: 10
  },
  boiImage: {
    borderRadius: 15,
    alignSelf: 'center', // Center the image horizontally
    marginVertical: 0, // Add some margin to the image
  },
  inputContainer: {
    width: '95%',
    alignSelf: 'center',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 22,
  },
  input: {
    width: '100%',
  },
  passwordVisibilityIcon: {
    position: 'absolute',
    right: 12,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    width: '95%',
    alignSelf: 'center',
    marginTop: 1,
    marginBottom: 4,
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialMediaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  socialMediaButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.black,
    marginLeft: 10,
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    width: '95%',
    alignSelf: 'center',
  },
  checkbox: {
    marginRight: 8,
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontWeight: 'bold',
  },
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 22,
  },
  loginText: {
    fontSize: 16,
    color: COLORS.black,
  },
  loginLinkText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default Registrar;




