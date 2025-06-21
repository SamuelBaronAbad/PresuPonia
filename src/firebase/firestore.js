// src/firebase/firestore.js
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
  } from 'firebase/firestore'
  import { db } from './config'
  
  // Colección de presupuestos
  const QUOTES_COLLECTION = 'quotes'
  
  // Guardar presupuesto
  export const saveQuote = async (userId, quoteData) => {
    try {
      const docRef = await addDoc(collection(db, QUOTES_COLLECTION), {
        ...quoteData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { id: docRef.id, error: null }
    } catch (error) {
      return { id: null, error: error.message }
    }
  }
  
export const getUserQuotes = async (userId) => {
    try {
      const q = query(
        collection(db, QUOTES_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const quotes = []
      
      querySnapshot.forEach((doc) => {
        quotes.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      // ✅ ORDENAR EN JAVASCRIPT en lugar de Firestore
      quotes.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
        return dateB - dateA // Más recientes primero
      })
      
      return { quotes, error: null }
    } catch (error) {
      console.error('Error obteniendo presupuestos:', error)
      return { quotes: [], error: error.message }
    }
  }
  
  // Obtener un presupuesto específico
  export const getQuoteById = async (quoteId) => {
    try {
      const docRef = doc(db, QUOTES_COLLECTION, quoteId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { 
          quote: { id: docSnap.id, ...docSnap.data() }, 
          error: null 
        }
      } else {
        return { quote: null, error: 'Presupuesto no encontrado' }
      }
    } catch (error) {
      return { quote: null, error: error.message }
    }
  }
  
  // Actualizar presupuesto
  export const updateQuote = async (quoteId, updateData) => {
    try {
      const docRef = doc(db, QUOTES_COLLECTION, quoteId)
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      })
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }
  
  // Eliminar presupuesto
  export const deleteQuote = async (quoteId) => {
    try {
      const docRef = doc(db, QUOTES_COLLECTION, quoteId)
      await deleteDoc(docRef)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }