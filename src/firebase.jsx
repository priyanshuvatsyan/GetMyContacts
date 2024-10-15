// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDo1AxtFTvpwYKtpedgxQMC3xcLVmHySBw",
  authDomain: "my-contacts-3ccb6.firebaseapp.com",
  projectId: "my-contacts-3ccb6",
  storageBucket: "my-contacts-3ccb6.appspot.com",
  messagingSenderId: "737173895170",
  appId: "1:737173895170:web:bfad623f62ddd17552cf1b",
  measurementId: "G-X5PH5W9LHY"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);