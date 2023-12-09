import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Pressable, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import COLORS from '../../components/colors';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../src/services/firebaseConfig';


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
      headerTitle: 'Recuperação de senha',
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
      Alert.alert('Usuário cadastrado', 'Você foi cadastrado com sucesso!', [{ text: 'OK', onPress: () => { navigation.navigate('Login'); setIsLoggingIn(false); } }]);;
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


      <View style={{ flex: 1, marginHorizontal: 1 }}>


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

        <TouchableOpacity style={styles.registerButton}  >
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
          <View style={{ flex: 1, height: 3, backgroundColor: COLORS.black, marginRight: 20, marginLeft: 20 }} />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 1, padding: 10 }}>
          <Text style={styles.infoText}>
            Um link de acesso será enviado para seu email cadastrado!
          </Text>
        </View>

      </View>




    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  infoText: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center', // Center text if needed
    marginTop: 10, // Adjust top margin as needed
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 1,
    paddingLeft: 12,
    color: 'black',

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

  registerButton: {
    backgroundColor: '#48D1CC',
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
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
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Registrar;





