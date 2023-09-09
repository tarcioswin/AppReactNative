import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, TextInput, TouchableOpacity, Text, StyleSheet, Animated, Keyboard,Alert } from 'react-native';
import topo from '../../assets/logoboi.png';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../components/colors';

import {auth} from '../services/firebaseConfig'
import { getAuth,signInWithEmailAndPassword } from "firebase/auth";



const Login = () => {
  const [offset] = useState(new Animated.ValueXY({ x: 0, y: 90 }));
  const [opacity] = useState(new Animated.Value(0));
  const [logo] = useState(new Animated.ValueXY({ x: 180, y: 195 }));

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null); // State for user ID





  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    Animated.parallel([
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 4,
        bounciness: 20,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  function keyboardDidShow() {
    Animated.parallel([
      Animated.timing(logo.x, {
        toValue: 130,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(logo.y, {
        toValue: 155,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  }

  function keyboardDidHide() {
    Animated.parallel([
      Animated.timing(logo.x, {
        toValue: 200,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(logo.y, {
        toValue: 195,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  }



    const handleLogin = () => {
    const auth = getAuth(); // Get the authentication instance
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        setUserId(user.uid); // Set the user ID in the state
        // Clear the email and password fields
        setEmail('');
        setPassword('');

        navigation.navigate("acesso");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        let customErrorMessage = "Invalid email or password"; // Default error message
  
        // Customize the error message based on the error code
        if (errorCode === "auth/invalid-email") {
          customErrorMessage = "Invalid email format";
        } else if (errorCode === "auth/wrong-password") {
          customErrorMessage = "Incorrect password";
        }
  
        Alert.alert("Login Error", customErrorMessage, [{ text: "OK" }]);
      });
  };


  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Animated.Image
          style={{
            width: logo.x,
            height: logo.y,
            borderRadius: 30,
          }}
          source={topo}
        />
        <Text style={styles.logoText}>App Boi</Text>
      </View>

      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacity,
            transform: [
              { translateY: offset.y.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }) },
            ],
          },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCorrect={false}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        
        <View style={{ position: "relative", width: "100%", alignItems: "center" }}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            autoCorrect={false}
            secureTextEntry={!isPasswordShown}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordShown(!isPasswordShown)}
            style={{
              position: "absolute",
              right: 30,
              top: "40%",
              transform: [{ translateY: -12 }],
            }}
          >
            {isPasswordShown ? (
              <Ionicons name="eye" size={24} color={COLORS.black} />
            ) : (
              <Ionicons name="eye-off" size={24} color={COLORS.black} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnSubmit} onPress={handleLogin}>
          <Text style={styles.submitText}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnRegister} onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.registerText}>Criar conta gratuita</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnForgot} onPress={() => navigation.navigate("forgot")}>
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  containerLogo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    paddingBottom: 100,
  },
  input: {
    backgroundColor: '#dddd',
    width: '90%',
    marginBottom: 15,
    color: '#222',
    fontSize: 17,
    borderRadius: 7,
    padding: 20,
  },
  btnSubmit: {
    backgroundColor: '#35AAFF',
    width: '95%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  submitText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold', 
  },
  btnRegister: {
    marginTop: 10,
    color: 'black',
  },
  registerText: {
    color: 'black',
    fontSize: 18,
  },
  logoText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  forgotText: {
    marginTop: 10,
    fontSize: 18,
    color: 'red',
  },
});

export default Login;
