import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBH1q0cAYUfKg04brS2JN4Rmm4FSqne2JU",
  authDomain: "life-matrix-c6b45.firebaseapp.com",
  projectId: "life-matrix-c6b45",
  storageBucket: "life-matrix-c6b45.firebasestorage.app",
  messagingSenderId: "586491009176",
  appId: "1:586491009176:web:3c60fce03bc5e8033098ed",
  measurementId: "G-XTY0XDG3DF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
