import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from './src/telas/Login';
import Signup from './src/telas/Signup';
import Forgot from './src/telas/forgot';
import acesso from './src/telas/acesso';
import AboutScreen from './src/telas/AboutScreen';
import EditInformation from './src/telas/EditInformation';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="forgot" component={Forgot} />
        <Stack.Screen name="acesso" component={acesso} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="EditInformation" component={EditInformation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
