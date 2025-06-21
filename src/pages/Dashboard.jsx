// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getUserQuotes, deleteQuote } from '@/firebase/firestore'
import { logoutUser } from '@/firebase/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LogOut, 
  FileText, 
  DollarSign, 
  Calendar,
  User,
  Settings,
  Plus
} from 'lucide-react'
import { formatPrice } from '@/pricing'
import { Eye, Trash2 } from 'lucide-react'


const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadQuotes = useCallback(async () => {
    if (!user) return
    
    try {
      const { quotes, error } = await getUserQuotes(user.uid)
      if (error) {
        setError(error)
      } else {
        setQuotes(quotes)
      }
    } catch {
      setError('Error al cargar presupuestos')
    } finally {
      setLoading(false)
    }
  }, [user]) // ✅ Dependencia solo de user

  useEffect(() => {
    loadQuotes()
  }, [loadQuotes]) // ✅ Ahora incluye loadQuotes sin warning

  const handleLogout = async () => {
    await logoutUser()
  }

   // ✅ Función para ver/editar presupuesto
   const handleViewQuote = (quoteId) => {
    navigate(`/edit-quote/${quoteId}`)
  }

  // ✅ Función para eliminar presupuesto (opcional)
  const handleDeleteQuote = async (quoteId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      try {
        const { error } = await deleteQuote(quoteId)
        if (error) {
          alert('Error al eliminar: ' + error)
        } else {
          // Recargar la lista
          loadQuotes()
        }
      } catch  {
        alert('Error de conexión al eliminar')
      }
    }
  }


  const totalQuotes = quotes.length
  const totalValue = quotes.reduce((sum, quote) => {
    return sum + (quote.quote?.oneTime?.total || 0) + (quote.quote?.monthly?.total || 0) * 12 + (quote.quote?.annual?.total || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">Gestión de presupuestos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.displayName || user?.email}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Presupuestos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuotes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotes.filter(q => {
                  const createdAt = q.createdAt?.toDate?.() || new Date(q.createdAt)
                  const thisMonth = new Date()
                  return createdAt.getMonth() === thisMonth.getMonth() && 
                         createdAt.getFullYear() === thisMonth.getFullYear()
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón para crear nuevo presupuesto */}
        <div className="mb-6">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Nuevo Presupuesto
          </Button>
        </div>

        {/* Lista de presupuestos */}
        <Card>
          <CardHeader>
            <CardTitle>Presupuestos Guardados</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Cargando presupuestos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>Error: {error}</p>
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No hay presupuestos guardados</p>
                <p className="text-sm">Crea tu primer presupuesto para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {quote.formData?.businessName || 'Sin nombre'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {quote.formData?.projectObjective || 'Sin objetivo definido'}
                        </p>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">
                            {formatPrice((quote.quote?.oneTime?.total || 0) + (quote.quote?.monthly?.total || 0) * 12 + (quote.quote?.annual?.total || 0))}
                          </Badge>
                          <Badge variant="secondary">
                            {new Date(quote.createdAt?.toDate?.() || quote.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* ✅ BOTONES FUNCIONALES */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewQuote(quote.id)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver/Editar
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Dashboard