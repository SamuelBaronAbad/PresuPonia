import React, { useState, useEffect, useRef, useMemo } from 'react'
import {  usePDF } from '@react-pdf/renderer'
import { QuotePdf } from '@/components/QuotePdf.jsx'
import PriceEditor from '@/components/PriceEditor.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { optionLists, fieldLabels } from '@/constants.js'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Calculator, Download, Edit3, DollarSign, Calendar, Clock, Settings, Percent, FileText, Save } from 'lucide-react'
import { calculateQuote, formatPrice, generateProjectSummary } from '@/pricing.js'
import { RegionSelector } from '@/components/ui/RegionSelector.jsx'
import { useAuth } from '@/contexts/AuthContext'
import { saveQuote } from '@/firebase/firestore'


const QuoteDisplay = ({ formData, quote, onBack, onEditPrices }) => {
  const [editMode, setEditMode] = useState(false)
  const [editedQuote, setEditedQuote] = useState(quote)
  const [editOptionsMode, setEditOptionsMode] = useState(false)
  const [editedFormData, setEditedFormData] = useState(formData)
  const [discount, setDiscount] = useState({ type: 'none', value: 0 })
  //const quoteRef = useRef(null)

  const { user, isAuthenticated } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const quoteSerialized = JSON.stringify(editedQuote)
  
  const memoizedDoc = useMemo(
    () => <QuotePdf formData={editedFormData} quote={editedQuote} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editedFormData, quoteSerialized, editedQuote]
  )

  const [pdfInstance] = usePDF({ document: memoizedDoc })

  
  // Recalcula presupuesto completo al cambiar opciones
  useEffect(() => {
    setEditedQuote(calculateQuote(editedFormData))
  }, [editedFormData])

  const handleOptionEdit = (field, value) => {
    setEditedFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckboxOptionEdit = (field, value, checked) => {
    setEditedFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const calculateDiscountedTotal = (total) => {
    if (discount.type === 'none' || discount.value === 0) return total
    
    return discount.type === 'percentage'
      ? total * (1 - discount.value / 100)
      : Math.max(0, total - discount.value)
  }

  const handlePriceEditorSave = (newQuote) => {
    setEditedQuote(newQuote)
    setEditMode(false)
    onEditPrices(newQuote)
  }

  const handlePriceEditorCancel = () => {
    setEditMode(false)
  }

  // Función para guardar presupuesto
const handleSaveQuote = async () => {
  if (!isAuthenticated) {
    alert('Debes estar logueado para guardar presupuestos')
    return
  }

  setSaving(true)
  try {
    const { error } = await saveQuote(user.uid, {
      formData: editOptionsMode ? editedFormData : formData,
      quote: editedQuote
    })

    if (error) {
      alert('Error al guardar: ' + error)
    } else {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  } catch  {
    alert('Error de conexión al guardar')
  } finally {
    setSaving(false)
  }
}

  const exportQuoteText = () => {
    const projectSummary = generateProjectSummary(editOptionsMode ? editedFormData : formData)
    const currentDate = new Date().toLocaleDateString('es-ES')
    
    let content = `PRESUPUESTO PARA DESARROLLO WEB\\n`
    content += `Fecha: ${currentDate}\\n\\n`
    
    content += `RESUMEN DEL PROYECTO:\\n`
    projectSummary.forEach(item => {
      content += `• ${item}\\n`
    })
    content += `\\n`
    
    if (editedQuote.oneTime.items.length > 0) {
      content += `COSTOS ÚNICOS:\\n`
      editedQuote.oneTime.items.forEach(item => {
        content += `• ${item.name}: ${formatPrice(item.price)}\\n`
        content += `  ${item.description}\\n`
      })
      content += `\\nTOTAL ÚNICO: ${formatPrice(editedQuote.oneTime.total)}\\n\\n`
    }
    
    if (editedQuote.monthly.items.length > 0) {
      content += `COSTOS MENSUALES:\\n`
      editedQuote.monthly.items.forEach(item => {
        content += `• ${item.name}: ${formatPrice(item.price)}/mes\\n`
        content += `  ${item.description}\\n`
      })
      content += `\\nTOTAL MENSUAL: ${formatPrice(editedQuote.monthly.total)}\\n`
      content += `TOTAL ANUAL DE SERVICIOS MENSUALES (x12): ${formatPrice(editedQuote.monthly.total * 12)}\\n\\n`
    }
    
    if (editedQuote.annual.items.length > 0) {
      content += `COSTOS ANUALES:\\n`
      editedQuote.annual.items.forEach(item => {
        content += `• ${item.name}: ${formatPrice(item.price)}/año\\n`
        content += `  ${item.description}\\n`
      })
      content += `\\nTOTAL ANUAL: ${formatPrice(editedQuote.annual.total)}\\n\\n`
    }
    
    // Agregar información de descuentos
    if (discount.type !== 'none' && discount.value > 0) {
      content += `DESCUENTOS APLICADOS:\\n`
      content += `Tipo: ${discount.type === 'percentage' ? 'Porcentaje' : 'Cantidad fija'}\\n`
      content += `Valor: ${discount.type === 'percentage' ? `${discount.value}%` : formatPrice(discount.value)}\\n\\n`
    }
    
    content += `NOTAS IMPORTANTES:\\n`
    editedQuote.notes.forEach(note => {
      content += `• ${note}\\n`
    })
    
    // Crear y descargar archivo
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `presupuesto-web-${currentDate.replace(/\//g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const {
    oneTime, monthly, annual,
    subtotal, irpfAmount, taxAmount, total,
    irpfRate, taxRate
  } = editedQuote

  // Totales descontados
  const discountedOneTime = calculateDiscountedTotal(oneTime.total)
  const discountedMonthly = calculateDiscountedTotal(monthly.total)
  const discountedAnnual = calculateDiscountedTotal(annual.total)
  const monthlyAnnualCost = monthly.total * 12
  const discountedMonthlyAnnualCost = discountedMonthly * 12
  const firstYearTotal = oneTime.total + monthlyAnnualCost + annual.total
  const discountedFirstYearTotal = discountedOneTime + discountedMonthlyAnnualCost + discountedAnnual

  // Definimos qué campos mostrar en el editor de opciones
  const editableFields = [
     // --- Proyecto básico ---
  'projectObjective',
  'designType',
  'hasLogo',
  'hasContent',

  // --- Dominio & Hosting ---
  'needsDomainHelp',
  'manageForClient',
  'hostingType',

  // --- Contenido & SEO ---
  'needsSEOHelp',
  'hasKeywords',
  'seoLevel',

  // --- Mantenimiento & Soporte ---
  'maintenanceType',
  'needsSupport',

  // --- Escalabilidad futura ---
  'futureFeatures',
  'expectsGrowth',

  // --- E-commerce ---
  'ecommerceFeatures',

  // --- Funcionalidades (listas) ---
  'basicFeatures',
  'advancedFeatures',
  
    // Hosting, Mantenimiento, E-commerce (si aplica)
    ...(editedQuote.annual.items.length > 0      ? ['hostingType']   : []),
    ...(editedQuote.monthly.items.length > 0     ? ['maintenanceType']: []),
    ...(editedQuote.oneTime.items.some(i => /seo/i.test(i.name))           ? ['seoLevel']          : []),
    ...(editedQuote.oneTime.items.some(i => /tienda|e-commerce/i.test(i.name)) 
                                                                           ? ['ecommerceFeatures'] : []),

  ]

  const sections = [
    { key: 'oneTime', label: fieldLabels.oneTimeCosts, descKey: 'oneTimeDescription', icon: <DollarSign className="w-5 h-5" />, gradient: 'from-purple-500 to-pink-500' },
    { key: 'monthly', label: fieldLabels.monthlyCosts, descKey: 'monthlyDescription', icon: <Calendar className="w-5 h-5" />, gradient: 'from-blue-500 to-cyan-500' },
    { key: 'annual', label: fieldLabels.annualCosts, descKey: 'annualDescription', icon: <Clock className="w-5 h-5" />, gradient: 'from-orange-500 to-red-500' }
  ]

  // Si estamos en modo de edición de precios, mostrar el editor
  if (editMode) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <PriceEditor
            quote={editedQuote}
            onSave={handlePriceEditorSave}
            onCancel={handlePriceEditorCancel}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ✅ NUEVO: Header con botón de admin */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Presupuesto Generado</h2>
          <p className="text-gray-600 text-sm">
            {formData.businessName ? `para ${formData.businessName}` : 'Proyecto web personalizado'}
          </p>
        </div>
        
        {/* Botón de admin solo para usuarios logueados */}
        {isAuthenticated && (
          <a href="/dashboard">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Settings className="w-4 h-4 mr-2" />
              Panel de Admin
            </Button>
          </a>
        )}
        
        {/* Enlace discreto al login para usuarios no logueados */}
        {!isAuthenticated && (
          <a 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
          >
            Acceso Admin
          </a>
        )}
      </div>
  
      {/* ✅ NUEVO: Selects de IRPF e IVA mejorados */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-blue-50">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Configuración Fiscal
          </CardTitle>
          <CardDescription className="text-gray-200">
            Ajusta los impuestos según tu situación
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Selector de Región (IVA/IGIC) */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Región (Impuestos)
              </Label>
              <Select
                value={editedFormData.region}
                onValueChange={v => handleOptionEdit('region', v)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors bg-white shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <SelectItem value="peninsula" className="hover:bg-blue-50">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <div>
                        <div className="font-medium">Península</div>
                        <div className="text-xs text-gray-500">IVA 21%</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="canarias" className="hover:bg-blue-50">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                      <div>
                        <div className="font-medium">Canarias</div>
                        <div className="text-xs text-gray-500">IGIC 7%</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            {/* Selector de IRPF */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Retención IRPF
              </Label>
              <Select
                value={editedFormData.irpf?.toString()}
                onValueChange={v => handleOptionEdit('irpf', Number(v))}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-400 focus:border-purple-500 transition-colors bg-white shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <SelectItem value="0" className="hover:bg-purple-50">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                      <div>
                        <div className="font-medium">Sin retención</div>
                        <div className="text-xs text-gray-500">0% IRPF</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="15" className="hover:bg-purple-50">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <div>
                        <div className="font-medium">Retención estándar</div>
                        <div className="text-xs text-gray-500">15% IRPF</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="21" className="hover:bg-purple-50">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <div>
                        <div className="font-medium">Retención alta</div>
                        <div className="text-xs text-gray-500">21% IRPF</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Información fiscal */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Configuración actual:</p>
                <p>
                  {editedFormData.region === 'peninsula' ? 'IVA 21%' : 'IGIC 7%'} • 
                  IRPF {editedFormData.irpf || 0}%
                </p>
                {editedFormData.irpf > 0 && (
                  <p className="text-xs mt-1 text-blue-600">
                    Los precios mostrados incluyen la retención del IRPF
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tu Resumen del Proyecto + Options Editor (sin alterar clases) */}
        <Card className="card-hover shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calculator className="w-5 h-5" />
              </div>
              Resumen del Proyecto
            </CardTitle>
          </CardHeader>
    
          <CardContent className="p-6">
            {/* Aquí va tu grid de badges */}
            <div className="flex overflow-x-auto space-x-2 py-2 mb-4">
              {generateProjectSummary(editOptionsMode ? editedFormData : formData)
                .map((item, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors whitespace-nowrap"
                  >
                    {item}
                  </Badge>
                ))
              }
            </div>

            {/* Edit Options Button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOptionsMode(!editOptionsMode)}
              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              {editOptionsMode ? 'Guardar Opciones' : 'Editar Opciones'}
            </Button>
          </div>

          {/* Options Editor - Grid two columns with section headers */}
          {editOptionsMode && (
            <div className="grid gap-6 md:grid-cols-2">

              {/* Dominio & Hosting */}
              <div className="md:col-span-2">
                <h3 className="text-base font-semibold mb-2 border-b pb-1">Dominio & Hosting</h3>
              </div>
              {['needsDomainHelp','manageForClient','hostingType'].map(field => (
                <div key={field}>
                  <Label htmlFor={`edit-${field}`}>{fieldLabels[field]}</Label>
                  <Select
                    id={`edit-${field}`}
                    className="w-72"
                    value={editedFormData[field] || ''}
                    onValueChange={v => handleOptionEdit(field, v)}
                  >
                    <SelectTrigger><SelectValue placeholder={fieldLabels[field]} /></SelectTrigger>
                    <SelectContent>
                      {optionLists[field].map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Diseño & Contenido */}
              <div className="md:col-span-2">
                <h3 className="text-base font-semibold mb-2 border-b pb-1">Diseño & Contenido</h3>
              </div>
              {['hasLogo','hasContent','designType'].map(field => (
                <div key={field}>
                  <Label htmlFor={`edit-${field}`}>{fieldLabels[field]}</Label>
                  <Select
                    id={`edit-${field}`}
                    className="w-72"
                    value={editedFormData[field] || ''}
                    onValueChange={v => handleOptionEdit(field, v)}
                  >
                    <SelectTrigger><SelectValue placeholder={fieldLabels[field]} /></SelectTrigger>
                    <SelectContent>
                      {optionLists[field].map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* SEO & Extras */}
              <div className="md:col-span-2">
                <h3 className="text-base font-semibold mb-2 border-b pb-1">SEO & Extras</h3>
              </div>
              {['needsSEOHelp','hasKeywords','seoLevel','ecommerceFeatures'].map(field =>
                editableFields.includes(field) && (
                <div key={field}>
                  <Label htmlFor={`edit-${field}`}>{fieldLabels[field]}</Label>
                  {Array.isArray(editedFormData[field]) ? (
                    <div className="space-y-2">
                      {optionLists[field].map(opt => (
                        <div key={opt.value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={editedFormData[field].includes(opt.value)}
                            onCheckedChange={chk => handleCheckboxOptionEdit(field, opt.value, chk)}
                          />
                          <Label>{opt.label}</Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Select
                      id={`edit-${field}`}
                      className="w-72"
                      value={editedFormData[field] || ''}
                      onValueChange={v => handleOptionEdit(field, v)}
                    >
                      <SelectTrigger><SelectValue placeholder={fieldLabels[field]} /></SelectTrigger>
                      <SelectContent>
                        {optionLists[field].map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}

              {/* Mantenimiento & Soporte */}
              <div className="md:col-span-2">
                <h3 className="text-base font-semibold mb-2 border-b pb-1">Mantenimiento & Soporte</h3>
              </div>
              {['maintenanceType','needsSupport'].map(field => (
                <div key={field}>
                  <Label htmlFor={`edit-${field}`}>{fieldLabels[field]}</Label>
                  <Select
                    id={`edit-${field}`}
                    className="w-72"
                    value={editedFormData[field] || ''}
                    onValueChange={v => handleOptionEdit(field, v)}
                  >
                    <SelectTrigger><SelectValue placeholder={fieldLabels[field]} /></SelectTrigger>
                    <SelectContent>
                      {optionLists[field].map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Escalabilidad Futura */}
              <div className="md:col-span-2">
                <h3 className="text-base font-semibold mb-2 border-b pb-1">Escalabilidad Futura</h3>
              </div>
              {['futureFeatures','expectsGrowth'].map(field => (
                <div key={field}>
                  <Label htmlFor={`edit-${field}`}>{fieldLabels[field]}</Label>
                  <Select
                    id={`edit-${field}`}
                    className="w-72"
                    value={editedFormData[field] || ''}
                    onValueChange={v => handleOptionEdit(field, v)}
                  >
                    <SelectTrigger><SelectValue placeholder={fieldLabels[field]} /></SelectTrigger>
                    <SelectContent>
                      {optionLists[field].map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Funcionalidades */}
              <div className="md:col-span-2">
                <h3 className="text-base font-semibold mb-2 border-b pb-1">Funcionalidades</h3>
              </div>
              {['basicFeatures','advancedFeatures'].map(field => (
                <div key={field}>
                  <Label>{fieldLabels[field]}</Label>
                  <div className="space-y-2">
                    {optionLists[field].map(opt => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <Checkbox
                          checked={editedFormData[field].includes(opt.value)}
                          onCheckedChange={chk => handleCheckboxOptionEdit(field, opt.value, chk)}
                        />
                        <Label>{opt.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          )}

        </CardContent>
     
      </Card>

      {/* Cost Breakdown */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {sections.map(({ key, label, descKey, icon, gradient }) => (
          <Card key={key} className="card-hover shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className={`cost-panel-header bg-gradient-to-r ${gradient} text-white rounded-t-lg`}>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
                {label} 
              </CardTitle>
              <CardDescription className="text-white/70">
                {fieldLabels[descKey]} 
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {editedQuote[key].items.map((item, i) => (
                <div key={i} className="quote-item flex justify-between mb-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.price)}{key === 'monthly' ? '/mes' : key === 'annual' ? '/año' : ''}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{fieldLabels.total}</span>
                <span>{formatPrice(editedQuote[key].total)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Summary */}
      <Card className="card-hover shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Resumen de Inversión</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {oneTime.total > 0 && (
              <div className="flex justify-between text-lg">
                <span>Inversión inicial:</span>
                <span className="font-bold">{formatPrice(discount.type!=='none'?discountedOneTime:oneTime.total)}</span>
              </div>
            )}
            {monthly.total > 0 && (
              <>              
                <div className="flex justify-between text-lg">
                  <span>Costo mensual:</span>
                  <span className="font-bold">{formatPrice(discount.type!=='none'?discountedMonthly:monthly.total)}/mes</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Costo anual servicios (x12):</span>
                  <span className="font-bold">{formatPrice(discount.type!=='none'?discountedMonthlyAnnualCost:monthlyAnnualCost)}</span>
                </div>
              </>
            )}
            {annual.total > 0 && (
              <div className="flex justify-between text-lg">
                <span>Costo anual:</span>
                <span className="font-bold">{formatPrice(discount.type!=='none'?discountedAnnual:annual.total)}/año</span>
              </div>
            )}

             {/* → Aquí: subtotal */}
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {/* → Aquí: irpfRate e irpfAmount */}
            <div className="flex justify-between text-lg">
              <span>IRPF ({(irpfRate*100).toFixed(0)}%):</span>
              <span>-{formatPrice(irpfAmount)}</span>
            </div>

            {/* → Aquí: taxRate y taxAmount */}
            <div className="flex justify-between text-lg">
              <span>{editedFormData.region==='canarias'?'IGIC':'IVA'} ({(taxRate*100).toFixed(0)}%):</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>

            <Separator className="bg-white/30" />

            {/* → Aquí: total */}
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>

            {/* Discount Section */}
            <div className="bg-white/20 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Percent className="w-5 h-5" />
                <span className="font-semibold">Descuentos</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-white text-sm">Tipo</Label>
                  <Select value={discount.type} onValueChange={val => setDiscount(prev=>({...prev,type:val}))}>
                    <SelectTrigger className="bg-white/90 text-black"><SelectValue placeholder="Seleccione" className="text-black"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin descuento</SelectItem>
                      <SelectItem value="percentage">Porcentaje</SelectItem>
                      <SelectItem value="fixed">Cantidad fija</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {discount.type!=='none' && (
                  <div>
                    <Label className="text-white text-sm">{discount.type==='percentage'?'Porcentaje (%)':'Cantidad'}</Label>
                    <Input
                      type="number"
                      value={discount.value}
                      onChange={e=>setDiscount(prev=>({...prev,value:parseFloat(e.target.value)||0}))}
                      className="bg-white/90 placeholder:text-black-500 text-black"
                      placeholder={discount.type==='percentage'?'10':'1000'}
                    />
                  </div>
                )}
              </div>
              {discount.type!=='none'&&discount.value>0&&<div className="text-sm text-white/90">Aplicado: {discount.type==='percentage'?`${discount.value}%`:formatPrice(discount.value)}</div>}
            </div>

            <Separator className="bg-white/30" />

            {discount.type!=='none'&&discount.value>0?(
              <>
                <div className="flex justify-between text-lg text-white/70 line-through">
                  <span>Total primer año (orig):</span><span>{formatPrice(firstYearTotal)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold bg-white/20 p-4 rounded-lg">
                  <span>Total primer año (desc):</span><span>{formatPrice(discountedFirstYearTotal)}</span>
                </div>
              </>
            ):(
              <div className="flex justify-between text-2xl font-bold bg-white/20 p-4 rounded-lg">
                <span>Total primer año:</span><span>{formatPrice(firstYearTotal)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="card-hover shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Notas Importantes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-2 text-sm text-gray-700">
            {editedQuote.notes.map((note, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 text-blue-500 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="outline" onClick={onBack} className="px-6 py-3 hover:bg-gray-50 transition-all duration-200">
          Volver al Formulario
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setEditMode(true)} 
          className="px-6 py-3 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Editor de Precios Avanzado
        </Button>

        {pdfInstance.error && (
       <div className="text-red-500">Error generando PDF: {pdfInstance.error.message}</div>
          )}
          {pdfInstance.url
        ? (
          <a href={pdfInstance.url} download={`presupuesto-web-${new Date().toLocaleDateString('es-ES').replace(/\//g,'-')}.pdf`}>
            <Button className="btn-primary px-6 py-3 text-white border-0">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </a>
        )
        : (
          <Button disabled className="btn-primary px-6 py-3 text-white border-0">
            Generando PDF...
          </Button>
        )
      }
        {isAuthenticated && (
          <Button 
            onClick={handleSaveQuote}
            disabled={saving}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </div>
            ) : saveSuccess ? (
              <div className="flex items-center gap-2">
                ✓ Guardado
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Guardar Presupuesto
              </div>
            )}
          </Button>
        )}

        {!isAuthenticated && (
          <a href="/login">
            <Button variant="outline" className="px-6 py-3 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
              <Save className="w-4 h-4 mr-2" />
              Login para Guardar
            </Button>
          </a>
        )}
        {/* <Button 
          variant="outline" 
          onClick={exportQuoteText} 
          className="px-6 py-3 hover:bg-gray-50 transition-all duration-200"
        >
          <FileText className="w-4 h-4 mr-2" />
          Descargar TXT
        </Button> */}
      </div>
    </div>
  )
}

export default QuoteDisplay