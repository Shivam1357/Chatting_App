// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnn5rwYgHKRPk3I6ATW3mhWUof92AhPaE",
  authDomain: "bffdoraemon.firebaseapp.com",
  projectId: "bffdoraemon",
  storageBucket: "bffdoraemon.appspot.com",
  messagingSenderId: "790970833344",
  appId: "1:790970833344:web:d91ad9bdb636db23655025",
  measurementId: "G-KKVNDP6B3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export {db};