
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";



const firebaseConfig = {
  apiKey: "AIzaSyDsjpaiUGsSX6umoxBSBWVwkfk26w5eXXM",
  authDomain: "dbboiapp.firebaseapp.com",
  projectId: "dbboiapp",
  storageBucket: "dbboiapp.appspot.com",
  messagingSenderId: "52349007610",
  appId: "1:52349007610:web:c988a944c6f7e478aefb43",
  measurementId: "G-VB0NZPHDN4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const auth=initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app; // Export the app instance

