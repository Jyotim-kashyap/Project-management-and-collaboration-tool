// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR34RMyFq1_Qpy4ABkD2UnmU_9RithgtA",
  authDomain: "nic-test-7116e.firebaseapp.com",
  projectId: "nic-test-7116e",
  storageBucket: "nic-test-7116e.appspot.com",
  messagingSenderId: "1026082744536",
  appId: "1:1026082744536:web:375b1aaf8eaa07a0f08fad"
};



// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const  googleAuthProvider = new firebase.auth.GoogleAuthProvider()