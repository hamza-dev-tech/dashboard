import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "conveyor-data.firebaseapp.com",
  projectId: "conveyor-data",
  storageBucket: "conveyor-data.appspot.com",
  messagingSenderId: "26417860272",
  appId: "1:26417860272:web:6a036669a0b3c127673575"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };