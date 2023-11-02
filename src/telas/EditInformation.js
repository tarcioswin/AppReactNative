import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebaseConfig';
import { getAuth, updatePassword, updateEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const EditInformation = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ddd, setDdd] = useState('');

  useEffect(() => {
    // Fetch the user's current information when the component mounts
    const fetchUserData = async () => {
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
    };

    fetchUserData();
  }, []);

  const handleUpdateInformation = async () => {
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
         telefone: `+55${ddd}${telefone}` });

      Alert.alert('Information Updated', 'Your information has been updated successfully.',
      [{ text: 'OK', onPress: () => navigation.navigate('acesso') }]);
    } catch (error) {
      Alert.alert('Update Error', 'An error occurred while updating your information. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 16 }}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.black}
          keyboardType="email-address"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email} // Set the initial value
        />

        <TextInput
          placeholder="Name"
          placeholderTextColor={COLORS.black}
          style={styles.input}
          onChangeText={(text) => setName(text)}
          value={name} // Set the initial value
        />

        
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
            placeholder="Enter your number"
            placeholderTextColor={COLORS.black}
            keyboardType="numeric"
            style={[styles.telefoneInput, { color: COLORS.black }]}
            onChangeText={(text) => setTelefone(text)}
            value={telefone} // Set the initial value
          />
        </View>

        <View style={styles.passwordInputContainer}>
          <TextInput
            placeholder="New Password"
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


      <View style={styles.passwordInputContainer}>
         <TextInput
          placeholder="Confirm the New Password"
          placeholderTextColor={COLORS.black}
          secureTextEntry={!isPasswordShown}
          style={[styles.passwordInput, { color: COLORS.black }]}
          onChangeText={(text) => setPasswordConfirmation(text)}
          value={passwordConfirmation} // Set the initial value
         />
       </View>



        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateInformation}>
          <Text style={styles.updateButtonText}>Update Information</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  primary: '#007BFF',
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
  },
  passwordVisibilityIcon: {
    marginRight: 8,
  },
  dddInput: {
    width: '20%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  telefoneInput: {
    width: '80%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});

export default EditInformation;
