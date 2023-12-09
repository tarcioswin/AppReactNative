import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebaseConfig';
import { updatePassword, updateEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import COLORS from '../../components/colors';

const EditInformation = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ddd, setDdd] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);


  useEffect(() => {

    // Fetch the user's current information when the component mounts
    const fetchUserData = async () => {
      setIsModalVisible(true); // Show the modal when update starts
      try {
        const user = auth.currentUser;

        // Fetch the user's document from Firestore
        const db = getFirestore();
        const userDocRef = doc(db, "usuario", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setEmail(userData.email || '');
          setName(userData.nome || '');

          // If the telephone field is stored as "+55XXXXXXXXX", split it to DDD and telephone number
          if (userData.telefone && userData.telefone.startsWith('+55')) {
            const telefoneParts = userData.telefone.slice(3).match(/(\d{2})(\d{8,9})/);
            if (telefoneParts) {
              setDdd(telefoneParts[1]);
              setTelefone(telefoneParts[2]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setIsModalVisible(false); // Hide the modal after update
    };

    fetchUserData();
  }, []);




  useEffect(() => {
    navigation.setOptions({
      headerStyle: styles.headerStyle,
      headerTitle: 'Editar informações', // Set the header title here
      headerTitleAlign: 'center' // Center the header title
    });
  }, [navigation]);


  const handleUpdateInformation = async () => {
    setIsModalVisible(true); // Show the modal when update starts
    try {
      const user = auth.currentUser;

      // Check if all mandatory fields are filled
      if (!email || !password || !name || !ddd || !telefone) {
        Alert.alert('Incomplete Information', 'Please fill in all mandatory fields.');
        return;
      }

      // Check if passwords match
      if (password !== passwordConfirmation) {
        Alert.alert('Password Mismatch', 'Passwords do not match.');
        return;
      }

      // Update user's email
      await updateEmail(user, email);

      // Update user's password
      await updatePassword(user, password);

      // Initialize Firestore
      const db = getFirestore();
      const userDoc = doc(db, "usuario", user.uid);

      // Update user's information
      await setDoc(userDoc, {
        email: email,
        nome: name,
        telefone: `+55${ddd}${telefone}`
      });

      Alert.alert('Information Updated', 'Your information has been updated successfully.',
        [{ text: 'OK', onPress: () => navigation.navigate('acesso') }]);
    } catch (error) {
      Alert.alert('Update Error', 'An error occurred while updating your information. Please try again.');
    }
    setIsModalVisible(false); // Hide the modal after update
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>


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



      <View style={{ flex: 1, marginHorizontal: 16 }}>
        <View style={{ marginTop: 1 }}>
          <Text style={styles.label}>Nome</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Name"
              placeholderTextColor={COLORS.black}
              style={styles.input}
              onChangeText={(text) => setName(text)}
              value={name} // Set the initial value
            />
          </View>
        </View>



        <View style={{ marginTop: 1 }}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email} // Set the initial value
            />
          </View>
        </View>

        <Text style={styles.label}>Número de telefone</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="DDD"
            placeholderTextColor={COLORS.black}
            keyboardType="numeric"
            style={[styles.dddInput, { color: COLORS.black }]}
            onChangeText={(text) => setDdd(text)}
            value={ddd} // Set the initial value
          />
          <TextInput
            placeholder="Entre com seu novo número"
            placeholderTextColor={COLORS.black}
            keyboardType="numeric"
            style={[styles.telefoneInput, { color: COLORS.black }]}
            onChangeText={(text) => setTelefone(text)}
            value={telefone} // Set the initial value
          />
        </View>


        <Text style={styles.label}>Nova Senha</Text>
        <View style={styles.passwordShadowContainer}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              placeholder="Nova senha"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              style={[styles.passwordInput, { color: COLORS.black }]}
              onChangeText={(text) => setPassword(text)}
              value={password} // Set the initial value
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


        <Text style={styles.label}>Confirme a nova senha</Text>
        <View style={styles.passwordShadowContainer}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              placeholder="Confirme a nova senha"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              style={[styles.passwordInput, { color: COLORS.black }]}
              onChangeText={(text) => setPasswordConfirmation(text)}
              value={passwordConfirmation} // Set the initial value
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

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateInformation}>
          <Text style={styles.updateButtonText}>Atualizar Informações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 1,
    paddingLeft: 1,
    color: 'black',
  },
  headerStyle: {
    backgroundColor: '#48D1CC',  // Background color of the header
    elevation: 4,                // Shadow under the header for Android
    shadowOpacity: 0.3,          // Shadow opacity for iOS
    shadowRadius: 3,             // Shadow radius for iOS
    shadowOffset: { height: 2, width: 0 },  // Shadow offset for iOS
    borderBottomWidth: 0,        // Remove border bottom if needed
    height: 60,                  // Height of the header
    // Additional styles as needed
  },
  input: {
    shadowColor: '#000',  // Shadow color
    shadowOffset: { width: 0, height: 2 },  // Shadow offset
    shadowOpacity: 0.25,  // Shadow opacity
    shadowRadius: 3.84,  // Shadow radius
    elevation: 5,  // Elevation for Android
    width: '100%',
    alignSelf: 'center',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 22,
    backgroundColor: 'white',
  },
  passwordShadowContainer: {
    width: '100%',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
  },
  passwordVisibilityIcon: {
    marginRight: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',

    // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Elevation for Android
    elevation: 5,
  },

  dddInput: {
    width: '20%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8, // Adjust if you need rounded corners
    paddingHorizontal: 16,
    // Other styling as necessary
  },

  telefoneInput: {
    width: '80%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8, // Adjust if you need rounded corners
    paddingHorizontal: 16,
    // Other styling as necessary
  },
  updateButton: {
    backgroundColor: '#48D1CC',
    width: '95%',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 14,
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
  updateButtonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});

export default EditInformation;
