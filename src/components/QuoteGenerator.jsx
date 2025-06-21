import React, { useState } from 'react'

import { optionLists, fieldLabels } from '@/constants.js'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Globe, Server, Palette, Search, Wrench, TrendingUp } from 'lucide-react'
import { calculateQuote, pricingConfig } from '@/pricing.js'
import QuoteDisplay from '@/components/QuoteDisplay.jsx'
import '@/App.css'

const QuoteGenerator = () => {
  const [formData, setFormData] = useState({
    // Información básica
    projectObjective: '',
    hasBusinessName: '',
    businessName: '',
    hasLogo: '',
    hasContent: '',
    
    // Dominio y hosting
    knowsDomainHosting: '',
    needsDomainHelp: '',
    manageForClient: '',
    
    // Diseño y funcionalidad
    hasDesignIdea: '',
    designType: '',
    basicFeatures: [],
    advancedFeatures: [],
    needsResponsive: '',
    
    // Contenido y SEO
    knowsSEO: '',
    needsSEOHelp: '',
    hasKeywords: '',
    needsBlog: '',
    
    // Mantenimiento
    knowsMaintenance: '',
    maintenanceType: '',
    needsSupport: '',
    
    // Futuras modificaciones
    futureFeatures: '',
    expectsGrowth: '',

    // Impuestos
    region: 'peninsula',
    irpf: pricingConfig.defaultIrpf
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [showQuote, setShowQuote] = useState(false)
  const [quote, setQuote] = useState(null)

  const steps = [
    {
      title: "Información Básica del Proyecto", 
      icon: <Globe className="w-6 h-6" />,
      description: "Entendamos el objetivo de su sitio web"
    },
    {
      title: "Dominio y Hosting",
      icon: <Server className="w-6 h-6" />,
      description: "Configuremos la base técnica de su sitio"
    },
    {
      title: "Diseño y Funcionalidad",
      icon: <Palette className="w-6 h-6" />,
      description: "Definamos cómo se verá y funcionará su sitio"
    },
    {
      title: "SEO y Contenido",
      icon: <Search className="w-6 h-6" />,
      description: "Optimicemos su presencia en buscadores"
    },
    {
      title: "Mantenimiento y Soporte",
      icon: <Wrench className="w-6 h-6" />,
      description: "Planifiquemos el cuidado continuo de su sitio"
    },
    {
      title: "Escalabilidad Futura",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Preparemos su sitio para el crecimiento"
    }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveQuote = async () => {
    // Esta función se implementará en el siguiente paso
    console.log('Guardar presupuesto:', { formData, quote })
  }
  
  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const calculatedQuote = calculateQuote(formData)
      setQuote(calculatedQuote)
      setShowQuote(true)
    }
  }

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex)
    }
  }

  const handleBackToForm = () => {
    setShowQuote(false)
    setCurrentStep(0)
  }

  const handleEditPrices = (editedQuote) => {
    setQuote(editedQuote)
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {

      // Paso 0: Información Básica
      case 0:
        return (
          <div className="space-y-6">
            {/* projectObjective */}
            <div>
              <Label htmlFor="projectObjective">{fieldLabels.projectObjective}</Label>
              <Select
                value={formData.projectObjective}
                onValueChange={v => handleInputChange('projectObjective', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={fieldLabels.projectObjective} />
                </SelectTrigger>
                <SelectContent>
                  {optionLists.projectObjective.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* hasBusinessName */}
            <div>
              <Label>{fieldLabels.hasBusinessName}</Label>
              <RadioGroup
                value={formData.hasBusinessName}
                onValueChange={v => handleInputChange('hasBusinessName', v)}
                className="mt-2"
              >
                {optionLists.hasBusinessName.map(o => (
                  <div key={o.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={o.value} id={`hasBusinessName-${o.value}`} />
                    <Label htmlFor={`hasBusinessName-${o.value}`}>{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* businessName (conditional) */}
            {formData.hasBusinessName === 'si' && (
              <div>
                <Label htmlFor="businessName">{fieldLabels.businessName}</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={e => handleInputChange('businessName', e.target.value)}
                  placeholder={fieldLabels.businessName}
                />
              </div>
            )}

            {/* hasLogo */}
            <div>
              <Label>{fieldLabels.hasLogo}</Label>
              <RadioGroup
                value={formData.hasLogo}
                onValueChange={v => handleInputChange('hasLogo', v)}
                className="mt-2"
              >
                {optionLists.hasLogo.map(o => (
                  <div key={o.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={o.value} id={`hasLogo-${o.value}`} />
                    <Label htmlFor={`hasLogo-${o.value}`}>{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* hasContent */}
            <div>
              <Label>{fieldLabels.hasContent}</Label>
              <RadioGroup
                value={formData.hasContent}
                onValueChange={v => handleInputChange('hasContent', v)}
                className="mt-2"
              >
                {optionLists.hasContent.map(o => (
                  <div key={o.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={o.value} id={`hasContent-${o.value}`} />
                    <Label htmlFor={`hasContent-${o.value}`}>{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )

      // Paso 1: Dominio y Hosting
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">{fieldLabels.domainHostingInfoTitle}</h4>
              <p className="text-blue-800 text-sm">{fieldLabels.domainHostingInfoText}</p>
            </div>

            {['knowsDomainHosting', 'needsDomainHelp', 'manageForClient'].map(field => (
              <div key={field}>
                <Label>{fieldLabels[field]}</Label>
                <RadioGroup
                  value={formData[field]}
                  onValueChange={v => handleInputChange(field, v)}
                  className="mt-2"
                >
                  {optionLists[field].map(o => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={`${field}-${o.value}`} />
                      <Label htmlFor={`${field}-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        )

      // Paso 2: Diseño y Funcionalidad
      case 2:
        return (
          <div className="space-y-6">
            {['hasDesignIdea', 'designType', 'needsResponsive'].map(field => (
              <div key={field}>
                <Label>{fieldLabels[field]}</Label>
                <RadioGroup
                  value={formData[field]}
                  onValueChange={v => handleInputChange(field, v)}
                  className="mt-2"
                >
                  {optionLists[field].map(o => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={`${field}-${o.value}`} />
                      <Label htmlFor={`${field}-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            {/* basicFeatures */}
            <div>
              <Label>{fieldLabels.basicFeatures}</Label>
              <div className="mt-2 space-y-2">
                {optionLists.basicFeatures.map(o => (
                  <div key={o.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`basicFeatures-${o.value}`}
                      checked={formData.basicFeatures.includes(o.value)}
                      onCheckedChange={c => handleCheckboxChange('basicFeatures', o.value, c)}
                    />
                    <Label htmlFor={`basicFeatures-${o.value}`}>{o.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* advancedFeatures */}
            <div>
              <Label>{fieldLabels.advancedFeatures}</Label>
              <div className="mt-2 space-y-2">
                {optionLists.advancedFeatures.map(o => (
                  <div key={o.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`advancedFeatures-${o.value}`}
                      checked={formData.advancedFeatures.includes(o.value)}
                      onCheckedChange={c => handleCheckboxChange('advancedFeatures', o.value, c)}
                    />
                    <Label htmlFor={`advancedFeatures-${o.value}`}>{o.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      // Paso 3: SEO y Contenido
      case 3:
        return (
          <div className="space-y-6">
            {['knowsSEO', 'needsSEOHelp', 'hasKeywords', 'needsBlog'].map(field => (
              <div key={field}>
                <Label>{fieldLabels[field]}</Label>
                <RadioGroup
                  value={formData[field]}
                  onValueChange={v => handleInputChange(field, v)}
                  className="mt-2"
                >
                  {optionLists[field].map(o => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={`${field}-${o.value}`} />
                      <Label htmlFor={`${field}-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        )

      // Paso 4: Mantenimiento y Soporte
      case 4:
        return (
          <div className="space-y-6">
            {['knowsMaintenance', 'maintenanceType', 'needsSupport'].map(field => (
              <div key={field}>
                <Label>{fieldLabels[field]}</Label>
                <RadioGroup
                  value={formData[field]}
                  onValueChange={v => handleInputChange(field, v)}
                  className="mt-2"
                >
                  {optionLists[field].map(o => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={`${field}-${o.value}`} />
                      <Label htmlFor={`${field}-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        )

      // Paso 5: Futuras modificaciones
      case 5:
        return (
          <div className="space-y-6">
            {['futureFeatures', 'expectsGrowth'].map(field => (
              <div key={field}>
                <Label>{fieldLabels[field]}</Label>
                <RadioGroup
                  value={formData[field]}
                  onValueChange={v => handleInputChange(field, v)}
                  className="mt-2"
                >
                  {optionLists[field].map(o => (
                    <div key={o.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={o.value} id={`${field}-${o.value}`} />
                      <Label htmlFor={`${field}-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (showQuote && quote) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <QuoteDisplay 
            formData={formData}
            quote={quote}
            onBack={handleBackToForm}
            onEditPrices={handleEditPrices}
            onSaveQuote={handleSaveQuote}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header con enlace al dashboard */}
        <div className="text-center mb-8 fade-in">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                Generador de Presupuestos Web
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Responda algunas preguntas para obtener un presupuesto personalizado para su sitio web
              </p>
            </div>
            <div className="hidden md:block">
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                Acceso Admin →
              </a>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 fade-in">
          <div className="flex justify-between items-center mb-4 px-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div 
                  className={`
                    step-indicator clickable flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold
                    ${index <= currentStep 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-lg' 
                      : 'bg-white border-gray-300 text-gray-400'
                    }
                    ${index === currentStep ? 'pulse-glow' : ''}
                  `}
                  onClick={() => goToStep(index)}
                  title={step.title}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    progress-line flex-1 h-2 mx-2 md:mx-4 rounded-full
                    ${index < currentStep ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Paso {currentStep + 1} de {steps.length}
            </p>
          </div>
        </div>

        {/* Step name display */}
        <div className="step-name-display">
          <div className="step-number">Paso {currentStep + 1} de {steps.length}</div>
          <h3>{steps[currentStep].title}</h3>
        </div>

        <Card className="card-hover shadow-xl border-0 bg-white/80 backdrop-blur-sm slide-in">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg card-header-improved">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="icon-container">
                {steps[currentStep].icon}
              </div>
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="panel-content">{renderStep()}
            
            <div className="step-navigation">
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="step-button hover:bg-gray-50 transition-all duration-200"
                >
                  Anterior
                </Button>
                <Button 
                  onClick={nextStep}
                  className="btn-primary step-button text-white border-0"
                >
                  {currentStep === steps.length - 1 ? 'Generar Presupuesto' : 'Siguiente'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default QuoteGenerator