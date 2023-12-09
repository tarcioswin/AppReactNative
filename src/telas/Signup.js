import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Pressable, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import COLORS from '../../components/colors';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import {auth, db } from '../../src/services/firebaseConfig'; 


const Registrar = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ddd, setDdd] = useState('');
  const [backgroundColor] = useState(COLORS.white);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Criar conta',
      headerTintColor: 'black',
      headerStyle: { backgroundColor: '#48D1CC' },
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center' // Center the header title
    });
  }, [backgroundColor]);


  const handleRegister = async () => {

    if (!isChecked) {
      Alert.alert(
        'Termos e Condições',
        'Você precisa aceitar os termos e condições para prosseguir com o cadastro.'
      );
      return;
    }

    const auth = getAuth();
    setIsLoggingIn(true); // Disable the button as login starts
    setIsModalVisible(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const fullPhoneNumber = `+55${ddd}${telefone}`;
      await setDoc(doc(db, "usuario", user.uid), {
        nome: name,
        email: email,
        telefone: fullPhoneNumber,
      });
      Alert.alert('Usuário cadastrado', 'Você foi cadastrado com sucesso!', [{ text: 'OK', onPress: () => {navigation.navigate('Login'); setIsLoggingIn(false);}}]);;
      setIsModalVisible(false);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      //console.log(errorMessage);
      let customErrorMessage = "Invalid email or password"; // Default error message

      // Customize the error message based on the error code
      if (errorCode === "auth/invalid-email") {
        customErrorMessage = "Invalid email format";
      } else if (errorCode === "auth/wrong-password") {
        customErrorMessage = "Incorrect password";
      } else if (errorCode === "auth/email-already-in-use") {
        customErrorMessage = "Usuário já cadastrado";
      }
      Alert.alert("Login Error", customErrorMessage, [{ text: "OK", onPress: () => setIsLoggingIn(false) }]);
      setIsModalVisible(false);
      try {
        // Handle Firestore document writing errors here
        throw new Error('Error writing document: ' + error.message);
      } catch (error) {
        console.error(error);
      }
    }
  };





  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color='#48D1CC' />
            <Text>Loading...</Text>
          </View>
        </View>
      </Modal>

        <View style={{ flex: 1, marginHorizontal: 1 }}>

          <View style={{ marginTop: 1 }}>
            <Text style={styles.label}>Nome</Text>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder='Entre com seu nome'
                autoCapitalize="none"
                placeholderTextColor={COLORS.black}
                keyboardType='default'
                style={{ width: "100%" }}
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
                autoCapitalize="none"
              />
            </View>
          </View>


          <View style={{ marginBottom: 1 }}>
            <Text style={styles.label}>Número de telefone</Text>
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
              paddingLeft: 20,
              backgroundColor: 'white',
              borderColor: COLORS.white,
              shadowColor: '#000',  // Shadow color
              shadowOffset: { width: 0, height: 2 },  // Shadow offset
              shadowOpacity: 0.25,  // Shadow opacity
              shadowRadius: 3.84,  // Shadow radius
              elevation: 5,  // Elevation for Android
            }}>
              <TextInput
                placeholder='DDD'
                placeholderTextColor={COLORS.black}
                keyboardType='numeric'
                style={{
                  width: "12%",
                  borderRightWidth: 1,
                  height: "100%"
                }}
                onChangeText={(text) => setDdd(text)}
              />
              <TextInput
                placeholder='Entre com seu número'
                placeholderTextColor={COLORS.black}
                keyboardType='numeric'
                style={{ width: "80%" }}
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
                autoCapitalize="none"
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
              style={{ marginRight: 8, backgroundColor: 'white' }}
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? COLORS.primary : undefined}
            />
            <Text style={{
              fontWeight: 'bold', color: 'black'
            }}>Eu aceito os termos e condições propostas</Text>
          </View>




          <TouchableOpacity style={styles.registerButton} disabled={isLoggingIn} onPress={handleRegister} >
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
            <View style={{ flex: 1, height: 3, backgroundColor: COLORS.black, marginLeft: 20 }} />
            <Text style={{ paddingHorizontal: 10, fontSize: 20, color: COLORS.black,fontWeight:'bold' }}>ou</Text>
            <View style={{ flex: 1, height: 3, backgroundColor: COLORS.black, marginRight: 20 }} />
          </View>



          {/* Your Social Media Buttons JSX */}
          <View style={styles.socialMediaButtonsContainer}>
            <TouchableOpacity style={styles.socialMediaButton}>
              <Image
                source={require('../../assets/facebook.png')}
                style={{ height: 36, width: 36, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text style={{ fontWeight: 'bold', fontSize: 16, }}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialMediaButton}>
              <Image
                source={require('../../assets/google.png')}
                style={{ height: 36, width: 36, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text style={{ fontWeight: 'bold', fontSize: 16, }}>Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginTextContainer}>
            <Text style={styles.loginText}>Eu Já tenho</Text>
            <Pressable disabled={isLoggingIn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 0.8, // Adjust opacity here

  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 1,
    paddingLeft: 12,
    color: 'black',

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
  inputContainer: {
    shadowColor: '#000',  // Shadow color
    shadowOffset: { width: 0, height: 2 },  // Shadow offset
    shadowOpacity: 0.25,  // Shadow opacity
    shadowRadius: 3.84,  // Shadow radius
    elevation: 5,  // Elevation for Android
    width: '95%',
    alignSelf: 'center',
    height: 48,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 22,
    backgroundColor: 'white',
  },
  input: {
    width: '100%',
  },
  passwordVisibilityIcon: {
    position: 'absolute',
    right: 12,
  },
  registerButton: {
    backgroundColor: '#48D1CC',
    width: '95%',
    alignSelf: 'center',
    marginTop: 1,
    marginBottom: 4,
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',  // Shadow color
    shadowOffset: { width: 0, height: 2 },  // Shadow offset
    shadowOpacity: 0.25,  // Shadow opacity
    shadowRadius: 3.84,  // Shadow radius
    elevation: 5,  // Elevation for Android
  },
  registerButtonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialMediaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    paddingRight: 10,
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
    backgroundColor: 'white',
     shadowColor: '#000',  // Shadow color
    shadowOffset: { width: 0, height: 2 },  // Shadow offset
    shadowOpacity: 0.25,  // Shadow opacity
    shadowRadius: 3.84,  // Shadow radius
    elevation: 5,  // Elevation for Android
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
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  loginLinkText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default Registrar;




