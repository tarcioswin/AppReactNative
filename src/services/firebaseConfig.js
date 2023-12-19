
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";



const firebaseConfig = {
  apiKey: "AIzaSyBHNmeyMMAEd0lNiyJHuWWyq_PIGofVW2E",
  authDomain: "arrobatrends-71e4c.firebaseapp.com",
  projectId: "arrobatrends-71e4c",
  storageBucket: "arrobatrends-71e4c.appspot.com",
  messagingSenderId: "204711201523",
  appId: "1:204711201523:web:667aa6ffcc16293f8c0586",
  measurementId: "G-Q7F1HRXGP2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const auth=initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, db }; // Export the app instance

