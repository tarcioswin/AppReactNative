import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../components/colors';

import { auth } from '../services/firebaseConfig';
import { getAuth, updatePassword, updateEmail } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';

const EditInformation = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ddd, setDdd] = useState('');

  const handleUpdateInformation = async () => {
    // Here, you can add your code to update the user information in Firebase Firestore
    // Example code for updating user information
    try {
      const user = auth.currentUser;
      const auth = getAuth();

      // Update user's email if the email input is not empty
      if (email) {
        await updateEmail(user, email);
      }

      // Update user's password if the password input is not empty
      if (password) {
        await updatePassword(user, password);
      }

      // Update other user information in Firestore or your data store
      const db = collection(db, 'users'); // Replace 'users' with your Firestore collection name
      const userDoc = doc(db, user.uid);

      // You can update other fields like 'name', 'telefone', 'ddd', etc.
      await setDoc(userDoc, {
        name: name,
        telefone: telefone,
        ddd: ddd,
      });

      // Show a success message
      Alert.alert('User Information Updated', 'Your information has been updated successfully.');
    } catch (error) {
      // Handle errors, such as invalid email or password
      Alert.alert('Update Error', 'An error occurred while updating your information. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 16 }}>
        {/* Rest of your UI components and form fields */}
        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.black}
          keyboardType="email-address"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          placeholder="name"
          placeholderTextColor={COLORS.black}
          secureTextEntry={!isPasswordShown}
          style={styles.input}
          onChangeText={(text) => setName(text)}
        />
        
        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.black}
          secureTextEntry={!isPasswordShown}
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
        />

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
            placeholder="DDD"
            placeholderTextColor={COLORS.black}
            keyboardType="numeric"
            style={{
                width: "12%",
                borderRightWidth: 1,
                borderLeftColor: COLORS.grey,
                height: "100%"
            }}
            onChangeText={(text) => setDdd(text)}
          />
          <TextInput
            placeholder="Entre com seu número"
            placeholderTextColor={COLORS.black}
            keyboardType="numeric"
            style={{width: "90%" }}
            onChangeText={(text) => setTelefone(text)}
          />
        </View>

        {/* Add more input fields for 'name', 'telefone', 'ddd', etc. */}

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateInformation}>
          <Text style={styles.updateButtonText}>Update Information</Text>
        </TouchableOpacity>

        {/* Rest of your UI components */}
      </View>
    </SafeAreaView>
  );
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical:10,
  },
});

export default EditInformation;
