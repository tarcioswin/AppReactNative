import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../components/colors';
import { getAuth, sendPasswordResetEmail,fetchSignInMethodsForEmail } from 'firebase/auth';



const Reset = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [backgroundColor] = useState(COLORS.white);
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


  const handlePasswordReset = () => {
    setIsModalVisible(true); // Show a loading indicator
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Sucesso', 'Um link de redefinição de senha foi enviado para o seu email');
        setIsModalVisible(false); // Hide loading indicator
      })
      .catch((error) => {
        // Firebase handles the case where the email is not registered
        Alert.alert('Erro', error.message);
        setIsModalVisible(false); // Hide loading indicator
      });
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>


      <View style={{ flex: 1, marginHorizontal: 1 }}>

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

        <TouchableOpacity style={styles.registerButton} onPress={handlePasswordReset} >
          <Text style={styles.registerButtonText}>Enviar</Text>
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

export default Reset;





