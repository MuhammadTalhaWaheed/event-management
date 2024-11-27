// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCKhryHK7SliSurFJN6AAAhQqcu39RRbG4",
  authDomain: "event-management-system-446fa.firebaseapp.com",
  projectId: "event-management-system-446fa",
  storageBucket: "event-management-system-446fa.firebasestorage.app",
  messagingSenderId: "944262160641",
  appId: "1:944262160641:web:7fe0c1f9a82675fc9d7b00",
  measurementId: "G-SS6CS2VMNC"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
