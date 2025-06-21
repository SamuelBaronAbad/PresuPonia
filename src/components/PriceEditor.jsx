// src/components/PriceEditor.jsx - NUEVO COMPONENTE
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Edit3, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  DollarSign, 
  Calendar, 
  Clock,
  Calculator,
  AlertCircle,
  Check
} from 'lucide-react'
import { formatPrice } from '../pricing.js'

const PriceEditor = ({ quote, onSave, onCancel }) => {
  const [editedQuote, setEditedQuote] = useState(JSON.parse(JSON.stringify(quote)))
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('oneTime')
  const [newItemDialog, setNewItemDialog] = useState({ open: false, section: '' })
  const [newItem, setNewItem] = useState({ name: '', description: '', price: 0 })

  // Detectar cambios
  useEffect(() => {
    const hasChanged = JSON.stringify(quote) !== JSON.stringify(editedQuote)
    setHasChanges(hasChanged)
  }, [editedQuote, quote])

  const handlePriceChange = (section, index, newPrice) => {
    const updated = { ...editedQuote }
    const price = parseFloat(newPrice) || 0
    updated[section].items[index].price = price
    
    // Recalcular total de la sección
    updated[section].total = updated[section].items.reduce((sum, item) => sum + item.price, 0)
    
    setEditedQuote(updated)
  }

  const handleItemNameChange = (section, index, newName) => {
    const updated = { ...editedQuote }
    updated[section].items[index].name = newName
    setEditedQuote(updated)
  }

  const handleItemDescriptionChange = (section, index, newDescription) => {
    const updated = { ...editedQuote }
    updated[section].items[index].description = newDescription
    setEditedQuote(updated)
  }

  const removeItem = (section, index) => {
    const updated = { ...editedQuote }
    updated[section].items.splice(index, 1)
    updated[section].total = updated[section].items.reduce((sum, item) => sum + item.price, 0)
    setEditedQuote(updated)
  }

  const addNewItem = () => {
    if (!newItem.name.trim()) return

    const updated = { ...editedQuote }
    const section = newItemDialog.section
    
    updated[section].items.push({
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price) || 0
    })
    
    updated[section].total = updated[section].items.reduce((sum, item) => sum + item.price, 0)
    
    setEditedQuote(updated)
    setNewItemDialog({ open: false, section: '' })
    setNewItem({ name: '', description: '', price: 0 })
  }

  const resetChanges = () => {
    setEditedQuote(JSON.parse(JSON.stringify(quote)))
  }

  const sectionConfig = {
    oneTime: {
      label: 'Costos Únicos',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    monthly: {
      label: 'Costos Mensuales', 
      icon: <Calendar className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    annual: {
      label: 'Costos Anuales',
      icon: <Clock className="w-4 h-4" />,
      color: 'from-orange-500 to-red-500', 
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con estado de cambios */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
        <div className="flex items-center gap-3">
          <Edit3 className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Editor de Precios</h3>
          {hasChanges && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Cambios sin guardar
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetChanges}
            disabled={!hasChanges}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4 mr-1" />
            Resetear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave(editedQuote)}
            disabled={!hasChanges}
            className="bg-green-500 border-green-500 text-white hover:bg-green-600"
          >
            <Save className="w-4 h-4 mr-1" />
            Guardar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>

      {/* Resumen rápido de totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(sectionConfig).map(([section, config]) => (
          <Card key={section} className={`${config.bgColor} ${config.borderColor} border-2`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {config.icon}
                  <span className="font-medium text-sm">{config.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {formatPrice(editedQuote[section].total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {editedQuote[section].items.length} partidas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Editor por pestañas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {Object.entries(sectionConfig).map(([section, config]) => (
            <TabsTrigger key={section} value={section} className="flex items-center gap-2">
              {config.icon}
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(sectionConfig).map(([section, config]) => (
          <TabsContent key={section} value={section} className="space-y-4">
            <Card>
              <CardHeader className={`bg-gradient-to-r ${config.color} text-white`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {config.icon}
                    {config.label}
                  </CardTitle>
                  <Dialog open={newItemDialog.open} onOpenChange={(open) => setNewItemDialog({ open, section })}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                        onClick={() => setNewItemDialog({ open: true, section })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar partida
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar nueva partida</DialogTitle>
                        <DialogDescription>
                          Agrega una nueva partida a {config.label.toLowerCase()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="itemName">Nombre de la partida</Label>
                          <Input
                            id="itemName"
                            value={newItem.name}
                            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Desarrollo de formulario"
                          />
                        </div>
                        <div>
                          <Label htmlFor="itemDescription">Descripción</Label>
                          <Input
                            id="itemDescription"
                            value={newItem.description}
                            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Ej: Formulario de contacto con validación"
                          />
                        </div>
                        <div>
                          <Label htmlFor="itemPrice">Precio (€)</Label>
                          <Input
                            id="itemPrice"
                            type="number"
                            value={newItem.price}
                            onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="0"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={addNewItem} className="flex-1">
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setNewItemDialog({ open: false, section: '' })}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {editedQuote[section].items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No hay partidas en esta sección</p>
                    <p className="text-sm">Haz clic en "Agregar partida" para añadir costos</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editedQuote[section].items.map((item, index) => (
                      <Card key={index} className="border border-gray-200 hover:border-gray-300 transition-colors">
                        <CardContent className="p-4">
                          <div className="grid gap-4 md:grid-cols-12 items-start">
                            {/* Nombre */}
                            <div className="md:col-span-4">
                              <Label className="text-xs text-gray-500">NOMBRE</Label>
                              <Input
                                value={item.name}
                                onChange={(e) => handleItemNameChange(section, index, e.target.value)}
                                className="mt-1 font-medium"
                                placeholder="Nombre de la partida"
                              />
                            </div>

                            {/* Descripción */}
                            <div className="md:col-span-5">
                              <Label className="text-xs text-gray-500">DESCRIPCIÓN</Label>
                              <Input
                                value={item.description}
                                onChange={(e) => handleItemDescriptionChange(section, index, e.target.value)}
                                className="mt-1"
                                placeholder="Descripción detallada"
                              />
                            </div>

                            {/* Precio */}
                            <div className="md:col-span-2">
                              <Label className="text-xs text-gray-500">
                                PRECIO {section === 'monthly' ? '/MES' : section === 'annual' ? '/AÑO' : ''}
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => handlePriceChange(section, index, e.target.value)}
                                  className="pr-8 font-bold text-green-600"
                                  step="0.01"
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                  €
                                </span>
                              </div>
                            </div>

                            {/* Acciones */}
                            <div className="md:col-span-1 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(section, index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Separator />

                    {/* Total de la sección */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-lg">
                        Total {config.label}:
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(editedQuote[section].total)}
                        </div>
                        {section === 'monthly' && editedQuote[section].total > 0 && (
                          <div className="text-sm text-gray-500">
                            ≈ {formatPrice(editedQuote[section].total * 12)}/año
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Resumen final */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-sm opacity-90">Inversión Inicial</div>
              <div className="text-2xl font-bold">{formatPrice(editedQuote.oneTime.total)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-90">Mensual</div>
              <div className="text-2xl font-bold">{formatPrice(editedQuote.monthly.total)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-90">Anual</div>
              <div className="text-2xl font-bold">{formatPrice(editedQuote.annual.total)}</div>
            </div>
          </div>
          
          <Separator className="my-4 bg-white/30" />
          
          <div className="text-center">
            <div className="text-sm opacity-90">Total Primer Año</div>
            <div className="text-3xl font-bold">
              {formatPrice(editedQuote.oneTime.total + editedQuote.monthly.total * 12 + editedQuote.annual.total)}
            </div>
            {hasChanges && (
              <div className="mt-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Check className="w-3 h-3 mr-1" />
                  Recuerda guardar los cambios
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PriceEditor