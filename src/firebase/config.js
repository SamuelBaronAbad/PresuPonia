// src/firebase/config.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Reemplaza con tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBk_Z-WuMsEuczTtHZxOvu7117Okj9TGIE",
    authDomain: "presuponia.firebaseapp.com",
    projectId: "presuponia",
    storageBucket: "presuponia.firebasestorage.app",
    messagingSenderId: "440278686938",
    appId: "1:440278686938:web:9b3c8647bf40272c7b19e3",
    measurementId: "G-GX41DFCDKR"
  };
  

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app