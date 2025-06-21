import React, { useState, useEffect, useRef, useMemo } from 'react'
import {  usePDF } from '@react-pdf/renderer'
import { QuotePdf } from '@/components/QuotePdf.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { optionLists, fieldLabels } from '@/constants.js'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Calculator, Download, Edit3, DollarSign, Calendar, Clock, Settings, Percent, FileText } from 'lucide-react'
import { calculateQuote, formatPrice, generateProjectSummary } from '../pricing.js'
import { RegionSelector } from '@/components/ui/RegionSelector.jsx'


const QuoteDisplay = ({ formData, quote, onBack, onEditPrices }) => {
  const [editMode, setEditMode] = useState(false)
  const [editedQuote, setEditedQuote] = useState(quote)
  const [editOptionsMode, setEditOptionsMode] = useState(false)
  const [editedFormData, setEditedFormData] = useState(formData)
  const [discount, setDiscount] = useState({ type: 'none', value: 0 })
  const quoteRef = useRef(null)

  const memoizedDoc = useMemo(
    () => <QuotePdf formData={editedFormData} quote={editedQuote} />,
    [editedFormData, editedQuote]
  )

  const [pdfInstance] = usePDF({ document: memoizedDoc })

  
  // Recalcula presupuesto completo al cambiar opciones
  useEffect(() => {
    setEditedQuote(calculateQuote(editedFormData))
  }, [editedFormData])

  const handlePriceEdit = (section, index, newPrice) => {
    const updated = { ...editedQuote }
    updated[section].items[index].price = parseFloat(newPrice) || 0
    updated[section].total = updated[section].items.reduce((sum, i) => sum + i.price, 0)
    setEditedQuote(updated)
  }

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

  const saveEdits = () => {
    setEditMode(false)
    onEditPrices(editedQuote)
  }

  const cancelEdits = () => {
    setEditedQuote(quote)
    setEditMode(false)
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


  return (
    <div className="space-y-8 fade-in" ref={quoteRef}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Su Presupuesto Personalizado</h2>
        <p className="text-gray-600 text-lg">Basado en sus necesidades específicas</p>
      </div>

      {/* Region + IRPF */}
      <RegionSelector
        region={editedFormData.region}
        onChange={val => handleOptionEdit('region', val)}
      />
      <div className="flex items-center gap-2">
        <Label>IRPF (%):</Label>
        <Input
          type="number"
          value={(editedFormData.irpf * 100).toFixed(0)}
          onChange={e => handleOptionEdit('irpf', parseFloat(e.target.value) / 100)}
          className="w-20"
        />
      </div>

      {/* Edit Prices */}
      {editMode && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {sections.map(({ key }) => (
            <Card key={key} className="bg-white">
              <CardHeader>
                <CardTitle>Edit {fieldLabels[key]}</CardTitle>
              </CardHeader>
              <CardContent>
                {editedQuote[key].items.map((item, idx) => (
                  <div key={idx} className="flex justify-between mb-4">
                    <span>{item.name}</span>
                    <Input
                      value={item.price}
                      onChange={e => handlePriceEdit(key, idx, e.target.value)}
                      className="w-24"
                    />
                  </div>
                ))}
                <div className="flex space-x-2 mt-4">
                  <Button onClick={saveEdits}>Guardar Precios</Button>
                  <Button variant="outline" onClick={cancelEdits}>Cancelar</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
        
        {editMode ? (
          <>
            <Button onClick={saveEdits} className="btn-primary px-6 py-3 text-white border-0">
              Guardar Cambios
            </Button>
            <Button variant="outline" onClick={cancelEdits} className="px-6 py-3 hover:bg-gray-50 transition-all duration-200">
              Cancelar
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => setEditMode(true)} className="px-6 py-3 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
            <Edit3 className="w-4 h-4 mr-2" />
            Ajustar Precios
          </Button>
        )}

        {pdfInstance.error && (
       <div className="text-red-500">Error generando PDF: {pdfInstance.error.message}</div>
          )}
          {pdfInstance.url
        ? (
          <a href={pdfInstance.url} download={`presupuesto-web-${new Date().toLocaleDateString('es-ES').replace(/\//g,'-')}.pdf`}>
            <Button className="btn-primary px-6 py-3 text-white border-0">
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
        
        <Button 
          variant="outline" 
          onClick={exportQuoteText} 
          className="px-6 py-3 hover:bg-gray-50 transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar TXT
        </Button>
      </div>
    </div>
  )
}

export default QuoteDisplay

