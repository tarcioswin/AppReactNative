import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, TextInput, TouchableOpacity, Text, StyleSheet, Animated, Keyboard, Alert, ImageBackground, Image, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../components/colors';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import topo from '../../assets/FigureApp.jpeg';


const window = Dimensions.get('window');

const Login = () => {
  const [offset] = useState(new Animated.ValueXY({ x: window.width / 2, y: 100 }));
  const [opacity] = useState(new Animated.Value(0));
  const [logo] = useState(new Animated.ValueXY({ x: window.width / 2, y: 200 }));

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);



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
        toValue: window.width / 2,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(logo.y, {
        toValue: 200,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }

  function keyboardDidHide() {
    Animated.parallel([
      Animated.timing(logo.x, {
        toValue: window.width / 2,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(logo.y, {
        toValue: 200,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  }

  const handleLogin = () => {
    setIsLoggingIn(true); // Disable the button as login starts
    setIsModalVisible(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserId(user.uid);
        setEmail('');
        setPassword('');
        setIsLoggingIn(false)
        setIsModalVisible(false);
        navigation.navigate("acesso");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        let customErrorMessage = "Invalid email or password";
        if (errorCode === "auth/invalid-email") {
          customErrorMessage = "Invalid email format";
        } else if (errorCode === "auth/wrong-password") {
          customErrorMessage = "Incorrect password";
        }

        Alert.alert("Login Error", customErrorMessage, [{ text: "OK", onPress: () => setIsLoggingIn(false) }]);
        setIsModalVisible(false);

      });
  };

  const imageStyle = {
    width: logo.x,  // Assuming logo.x and logo.y are your animated values
    height: logo.y,
    borderRadius: 100,  // Adjust for rounded corners
    borderWidth: 2,   // Border width
    borderColor: '#F0F3F4',  // Border color
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
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        </View>
      </Modal>


      <KeyboardAvoidingView style={styles.background}>
        
        <View style={styles.containerLogo}>
          <Animated.Image
            style={imageStyle}
            source={topo}
          />
           <Text style={styles.logoText}>ArrobaTrends</Text>
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
            placeholder='Email'
            placeholderTextColor={COLORS.black}
            keyboardType='email-address'
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCapitalize="none"
          />
          <View style={{ position: "relative", width: "100%", alignItems: "center" }}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={COLORS.black}
              keyboardType='default'
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
          <TouchableOpacity style={styles.btnSubmit} disabled={isLoggingIn} onPress={handleLogin}>
            <Text style={styles.submitText}>Acessar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnRegister} disabled={isLoggingIn} onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.registerText}>Criar conta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnForgot} disabled={isLoggingIn} onPress={() => navigation.navigate("forgot")}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>


          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
            <View style={{ flex: 1, height: 3, backgroundColor: COLORS.black }} />
            <Text style={{ paddingHorizontal: 10, fontSize: 20, color: COLORS.black, fontWeight: 'bold' }}>ou</Text>
            <View style={{ flex: 1, height: 3, backgroundColor: COLORS.black }} />
          </View>


          <View style={styles.socialMediaButtonsContainer}>
            <TouchableOpacity style={styles.socialMediaButton}>
              <Image source={require('../../assets/facebook.png')} style={{
                height: 36, width: 36, marginRight: 8, borderColor: '#ddd',
                shadowColor: '#000'
              }} resizeMode="contain" />
              <Text style={{ fontWeight: 'bold', fontSize: 16, }}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialMediaButton}>
              <Image source={require('../../assets/google.png')} style={{
                height: 36, width: 36, marginRight: 8, borderColor: '#ddd',
                shadowColor: '#000'
              }} resizeMode="contain" />
              <Text style={{ fontWeight: 'bold', fontSize: 16, }}>Google</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

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
    borderColor: 'black',  // Border color
    shadowColor: '#000',  // Shadow color
    shadowOffset: { width: 0, height: 2 },  // Shadow offset
    shadowOpacity: 0.25,  // Shadow opacity
    shadowRadius: 3.84,  // Shadow radius
    elevation: 5,  // Elevation for Android
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  backgroundstyle: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogo: {
    flex: 1,
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
    borderColor: 'black',  // Border color
    backgroundColor: 'white',
    shadowColor: '#000',  // Shadow color
    shadowOffset: { width: 0, height: 2 },  // Shadow offset
    shadowOpacity: 0.25,  // Shadow opacity
    shadowRadius: 3.84,  // Shadow radius
    elevation: 5,  // Elevation for Android
    width: '90%',
    marginBottom: 15,
    color: '#222',
    fontSize: 17,
    borderRadius: 7,
    padding: 10,
  },
  btnSubmit: {
    borderColor: '#48D1CC',  // Border color
    shadowColor: '#000',  // Shadow color
    shadowOffset: { width: 0, height: 2 },  // Shadow offset
    shadowOpacity: 0.25,  // Shadow opacity
    shadowRadius: 3.84,  // Shadow radius
    elevation: 10,  // Elevation for Android
    backgroundColor: '#48D1CC',
    width: '95%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  submitText: {
    color: 'black',
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
    fontWeight: 'bold',
  },
  logoText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // Center text horizontally
  },
  forgotText: {
    marginTop: 10,
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Login;
