// src/pages/QuoteEditor.jsx - Editor directo para admins
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuoteById, updateQuote } from '@/firebase/firestore'
import QuoteDisplay from '@/components/QuoteDisplay'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'

const QuoteEditor = () => {
  const { quoteId } = useParams()
  const navigate = useNavigate()
  const [quoteData, setQuoteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadQuote = useCallback(async () => {
    if (!quoteId) return
    
    console.log('Cargando presupuesto:', quoteId)
    
    try {
      const { quote, error } = await getQuoteById(quoteId)
      if (error) {
        console.error('Error al cargar:', error)
        setError(error)
      } else {
        console.log('Presupuesto cargado:', quote)
        setQuoteData(quote)
      }
    } catch (err) {
      console.error('Error de conexión:', err)
      setError('Error al cargar presupuesto')
    } finally {
      setLoading(false)
    }
  }, [quoteId]) // ✅ Solo depende de quoteId

  useEffect(() => {
    loadQuote()
  }, [loadQuote]) // ✅ Ahora incluye loadQuote sin warning

  const handleSaveChanges = async (newQuote) => {
    setSaving(true)
    try {
      const { error } = await updateQuote(quoteId, {
        quote: newQuote,
        formData: quoteData.formData
      })
      
      if (error) {
        alert('Error al guardar: ' + error)
      } else {
        setQuoteData(prev => ({ ...prev, quote: newQuote }))
        alert('Cambios guardados exitosamente')
      }
    } catch {
      alert('Error de conexión al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando presupuesto...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Editando: {quoteData?.formData?.businessName || 'Sin nombre'}
                </h1>
                <p className="text-sm text-gray-500">
                  ID: {quoteId}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {saving && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Guardando...
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido - Solo la pantalla de presupuesto */}
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <QuoteDisplay 
            formData={quoteData.formData}
            quote={quoteData.quote}
            onBack={() => navigate('/dashboard')}
            onEditPrices={handleSaveChanges}
            readOnly={false}
            isAdminView={true}
          />
        </div>
      </main>
    </div>
  )
}

export default QuoteEditor
 