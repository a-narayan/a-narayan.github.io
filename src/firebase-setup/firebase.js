// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAh5VeC42mRQGdhK4XM55OIZ7OraggJz-Y",
  authDomain: "idsl-web.firebaseapp.com",
  projectId: "idsl-web",
  storageBucket: "idsl-web.appspot.com",
  messagingSenderId: "431459416070",
  appId: "1:431459416070:web:e5ce45cc5a445dec712b87",
  measurementId: "G-P6BC4NQDP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);