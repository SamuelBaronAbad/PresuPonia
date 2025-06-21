// Configuración de precios para el generador de presupuestos
export const pricingConfig = {
  // impuestos
  taxRates: {
    peninsula: 0.21,
    canarias: 0.07
  },
  defaultIrpf: 0.15,
  // Precios base
  domain: {
    registration: 15, // USD por año
    management: 25 // USD por año si lo gestionamos nosotros
  },
  
  hosting: {
    basic: 60, // USD por año - hasta 5GB, tráfico básico
    standard: 120, // USD por año - hasta 20GB, tráfico medio
    premium: 240 // USD por año - hasta 100GB, tráfico alto
  },
  
  design: {
    template: 300, // USD - diseño basado en plantilla
    custom: 800, // USD - diseño completamente personalizado
    logo: 150, // USD - diseño de logo
    content_creation_per_page: 50 // USD por página de contenido
  },
  
  features: {
    basic: {
      contact_form: 0, // Incluido en diseño base
      image_gallery: 50,
      location_map: 30,
      testimonials: 40,
      company_info: 0, // Incluido en diseño base
      product_catalog: 100
    },
    advanced: {
      ecommerce: 800,
      booking_system: 600,
      member_area: 500,
      blog: 200,
      social_integration: 100,
      live_chat: 150,
      payment_system: 300,
      multilingual: 400
    }
  },
  
  seo: {
    basic: 200, // USD - configuración inicial
    advanced: 150, // USD por mes - SEO continuo
    keyword_research: 100 // USD - investigación de palabras clave
  },
  
  maintenance: {
    basic: 50, // USD por mes - actualizaciones básicas, backup
    premium: 100, // USD por mes - incluye soporte, actualizaciones frecuentes
    on_demand: 75 // USD por hora
  },
  
  support: {
    regular: 30, // USD por mes
    occasional: 60, // USD por hora
    training: 100 // USD por sesión
  },
  
  extras: {
    development_hour: 60, // USD por hora adicional
    rush_delivery: 200, // USD - entrega urgente (menos de 2 semanas)
    additional_revisions: 50 // USD por ronda adicional de revisiones
  }
}

// Función para calcular el presupuesto basado en las respuestas del formulario
export const calculateQuote = (formData) => {
  const {
    oneTime = { items: [], total: 0 },
    monthly = { items: [], total: 0 },
    annual = { items: [], total: 0 },
    region = 'peninsula',
    irpf = pricingConfig.defaultIrpf
  } = formData;

  let quote = {
    oneTime: { ...oneTime },
    monthly: { ...monthly },
    annual: { ...annual },
    notes: []
  };
  
  // Dominio
  if (formData.needsDomainHelp === 'si' || formData.manageForClient === 'si') {
    quote.annual.items.push({
      name: 'Registro y gestión de dominio',
      price: pricingConfig.domain.registration + (formData.manageForClient === 'si' ? pricingConfig.domain.management : 0),
      description: 'Registro del dominio y gestión anual'
    })
    quote.annual.total += pricingConfig.domain.registration + (formData.manageForClient === 'si' ? pricingConfig.domain.management : 0)
  }
  
  // Hosting
  let hostingType = formData.hostingType
  if (!hostingType) {
    if (formData.expectsGrowth === 'mucho' || formData.advancedFeatures.includes('Tienda online (e-commerce)')) {
      hostingType = 'premium'
    } else if (formData.expectsGrowth === 'moderado' || formData.advancedFeatures.length > 2) {
      hostingType = 'standard'
    } else {
      hostingType = 'basic'
    }
  }
  
  quote.annual.items.push({
    name: `Hosting ${hostingType}`,
    price: pricingConfig.hosting[hostingType],
    description: `Plan de hosting ${hostingType} - renovación anual`
  })
  quote.annual.total += pricingConfig.hosting[hostingType]
  
  // Diseño
  let designCost = formData.designType === 'personalizado' ? pricingConfig.design.custom : pricingConfig.design.template
  quote.oneTime.items.push({
    name: `Diseño ${formData.designType === 'personalizado' ? 'personalizado' : 'basado en plantilla'}`,
    price: designCost,
    description: formData.designType === 'personalizado' 
      ? 'Diseño completamente personalizado y único'
      : 'Diseño profesional basado en plantilla premium'
  })
  quote.oneTime.total += designCost
  
  // Logo
  if (formData.hasLogo === 'no') {
    quote.oneTime.items.push({
      name: 'Diseño de logo',
      price: pricingConfig.design.logo,
      description: 'Diseño de logo profesional con 3 propuestas'
    })
    quote.oneTime.total += pricingConfig.design.logo
  }
  
  // Creación de contenido
  if (formData.hasContent === 'no' || formData.hasContent === 'parcial') {
    let contentPages = 3 // Estimación base
    if (formData.advancedFeatures.includes('Blog o noticias')) contentPages += 2
    if (formData.basicFeatures.includes('Catálogo de productos/servicios')) contentPages += 2
    
    let contentCost = contentPages * pricingConfig.design.content_creation_per_page
    quote.oneTime.items.push({
      name: `Creación de contenido (${contentPages} páginas)`,
      price: contentCost,
      description: 'Redacción profesional de textos para el sitio web'
    })
    quote.oneTime.total += contentCost
  }
  
  // Funcionalidades básicas
  formData.basicFeatures.forEach(feature => {
    const featureKey = feature.toLowerCase().replace(/[^a-z]/g, '_')
    const featureMap = {
      'formulario_de_contacto': 'contact_form',
      'galería_de_imágenes': 'image_gallery',
      'mapa_de_ubicación': 'location_map',
      'testimonios_de_clientes': 'testimonials',
      'información_de_la_empresa': 'company_info',
      'catálogo_de_productos_servicios': 'product_catalog'
    }
    
    const mappedFeature = featureMap[featureKey]
    if (mappedFeature && pricingConfig.features.basic[mappedFeature] > 0) {
      quote.oneTime.items.push({
        name: feature,
        price: pricingConfig.features.basic[mappedFeature],
        description: `Implementación de ${feature.toLowerCase()}`
      })
      quote.oneTime.total += pricingConfig.features.basic[mappedFeature]
    }
  })
  
  // Funcionalidades avanzadas
  formData.advancedFeatures.forEach(feature => {
    const featureMap = {
      'Tienda online (e-commerce)': 'ecommerce',
      'Sistema de reservas/citas': 'booking_system',
      'Área de miembros/login': 'member_area',
      'Blog o noticias': 'blog',
      'Integración con redes sociales': 'social_integration',
      'Chat en vivo': 'live_chat',
      'Sistema de pagos': 'payment_system',
      'Múltiples idiomas': 'multilingual'
    }
    
    const mappedFeature = featureMap[feature]
    if (mappedFeature) {
      quote.oneTime.items.push({
        name: feature,
        price: pricingConfig.features.advanced[mappedFeature],
        description: `Desarrollo e implementación de ${feature.toLowerCase()}`
      })
      quote.oneTime.total += pricingConfig.features.advanced[mappedFeature]
    }
  })
  
  // SEO
  if (formData.needsSEOHelp === 'basico') {
    quote.oneTime.items.push({
      name: 'SEO básico',
      price: pricingConfig.seo.basic,
      description: 'Configuración inicial de SEO y optimización básica'
    })
    quote.oneTime.total += pricingConfig.seo.basic
  } else if (formData.needsSEOHelp === 'avanzado') {
    quote.oneTime.items.push({
      name: 'SEO básico',
      price: pricingConfig.seo.basic,
      description: 'Configuración inicial de SEO y optimización básica'
    })
    quote.oneTime.total += pricingConfig.seo.basic
    
    quote.monthly.items.push({
      name: 'SEO continuo',
      price: pricingConfig.seo.advanced,
      description: 'Optimización continua y monitoreo de SEO'
    })
    quote.monthly.total += pricingConfig.seo.advanced
  }
  
  // Investigación de palabras clave
  if (formData.hasKeywords === 'no' && formData.needsSEOHelp !== 'no') {
    quote.oneTime.items.push({
      name: 'Investigación de palabras clave',
      price: pricingConfig.seo.keyword_research,
      description: 'Análisis y selección de palabras clave estratégicas'
    })
    quote.oneTime.total += pricingConfig.seo.keyword_research
  }
  
  // Mantenimiento
  if (formData.maintenanceType === 'mensual') {
    const maintenanceLevel = formData.needsSupport === 'si' ? 'premium' : 'basic'
    quote.monthly.items.push({
      name: `Mantenimiento ${maintenanceLevel}`,
      price: pricingConfig.maintenance[maintenanceLevel],
      description: maintenanceLevel === 'premium' 
        ? 'Mantenimiento completo con soporte prioritario'
        : 'Mantenimiento básico: actualizaciones y backups'
    })
    quote.monthly.total += pricingConfig.maintenance[maintenanceLevel]
  }
  
  // Soporte adicional
  if (formData.needsSupport === 'si' && formData.maintenanceType !== 'mensual') {
    quote.monthly.items.push({
      name: 'Soporte técnico',
      price: pricingConfig.support.regular,
      description: 'Soporte técnico mensual'
    })
    quote.monthly.total += pricingConfig.support.regular
  }
  
  // Notas importantes
  quote.notes = [
    'Todos los precios están en EUROS (€) y no incluyen IVA/IGIC',
    'El presupuesto tiene validez de 30 días',
    'Los precios mensuales/anuales se facturan por adelantado',
    'Se requiere 50% de anticipo para comenzar el proyecto',
    'El tiempo estimado de desarrollo es de 2-4 semanas'
  ]
  
  // Agregar notas específicas según las respuestas
  if (formData.futureFeatures === 'si') {
    quote.notes.push('Se recomienda arquitectura escalable para futuras expansiones')
  }
  
  if (formData.expectsGrowth === 'mucho') {
    quote.notes.push('Se incluye optimización para alto tráfico y crecimiento')
  }

 // Desglose de impuestos
 const subtotal = quote.oneTime.total + quote.monthly.total * 12 + quote.annual.total;
 const irpfAmount = subtotal * irpf;
 const netAfterIrpf = subtotal - irpfAmount;
 const taxRate = pricingConfig.taxRates[region] || pricingConfig.taxRates.peninsula;
 const taxAmount = netAfterIrpf * taxRate;
 const total = netAfterIrpf + taxAmount;

 return {
   ...quote,
   subtotal,
   irpfRate: irpf,
   irpfAmount,
   taxRate,
   taxAmount,
   total
 };
}

// Función para formatear precios
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(price)
}

// Función para generar resumen del proyecto
export const generateProjectSummary = (formData) => {
  let summary = []
  
  if (formData.projectObjective) {
    const objectives = {
      'vender': 'Sitio web para venta de productos/servicios',
      'informar': 'Sitio web informativo corporativo',
      'leads': 'Sitio web para captación de clientes',
      'portfolio': 'Sitio web tipo portfolio',
      'blog': 'Sitio web con blog/revista',
      'otro': 'Sitio web con objetivo personalizado'
    }
    summary.push(objectives[formData.projectObjective] || 'Sitio web personalizado')
  }
  
  if (formData.designType) {
    summary.push(formData.designType === 'personalizado' ? 'Diseño completamente personalizado' : 'Diseño basado en plantilla premium')
  }
  
  if (formData.basicFeatures.length > 0) {
    summary.push(`${formData.basicFeatures.length} funcionalidades básicas`)
  }
  
  if (formData.advancedFeatures.length > 0) {
    summary.push(`${formData.advancedFeatures.length} funcionalidades avanzadas`)
  }
  
  if (formData.needsSEOHelp && formData.needsSEOHelp !== 'no') {
    summary.push(`SEO ${formData.needsSEOHelp}`)
  }
  
  if (formData.maintenanceType === 'mensual') {
    summary.push('Plan de mantenimiento mensual')
  }
  
  return summary
}

