// src/firebase/auth.js
import { 
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile
  } from 'firebase/auth'
  import { auth } from './config'
  
  // Login con email y contraseña
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  }
  
  // Registro de nuevo usuario
  export const registerUser = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Actualizar el perfil con el nombre
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error.message }
    }
  }
  
  // Logout
  export const logoutUser = async () => {
    try {
      await signOut(auth)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }
  
  // Observador del estado de autenticación
  export const onAuthStateChangedListener = (callback) => {
    return onAuthStateChanged(auth, callback)
  }