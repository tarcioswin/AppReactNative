
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";



const firebaseConfig = {
  apiKey: "AIzaSyBWX85JWyqwONsr9w73tsun-EyRPRlhYaM",
  authDomain: "arrobatrends-4d051.firebaseapp.com",
  projectId: "arrobatrends-4d051",
  storageBucket: "arrobatrends-4d051.appspot.com",
  messagingSenderId: "102790426332",
  appId: "1:102790426332:web:31d7b8f320b83420c38e19",
  measurementId: "G-9JLHG8945D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const auth=initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, db }; // Export the app instance

