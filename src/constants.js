// src/constants.js
// Listado de opciones reutilizables para App.jsx y QuoteDisplay.jsx

export const fieldLabels = {
  projectObjective: '¿Cuál es el objetivo principal de su sitio web?',
  hasBusinessName: '¿Ya tiene un nombre para su empresa o proyecto?',
  businessName: 'Nombre de su empresa/proyecto',
  hasLogo: '¿Tiene ya un logo o identidad visual?',
  hasContent: '¿Tiene contenido preparado (textos, imágenes, videos)?',
  knowsDomainHosting: '¿Sabía qué son el dominio y hosting?',
  needsDomainHelp: '¿Necesita ayuda para registrar un dominio y contratar hosting?',
  manageForClient: '¿Prefiere que gestionemos dominio/hosting por usted?',
  hasDesignIdea: '¿Tiene alguna idea de cómo le gustaría que se viera su sitio web?',
  designType: '¿Qué tipo de diseño prefiere?',
  basicFeatures: 'Funcionalidades básicas (seleccione todas)',
  advancedFeatures: 'Funcionalidades avanzadas (seleccione todas)',
  needsResponsive: '¿Su sitio web debe funcionar bien en celulares y tablets?',
  knowsSEO: '¿Sabía qué es el SEO y por qué es importante?',
  needsSEOHelp: '¿Necesita ayuda para que su sitio aparezca en buscadores?',
  hasKeywords: '¿Tiene palabras clave en mente para su negocio?',
  needsBlog: '¿Necesita que su sitio web tenga un blog o sección de noticias?',
  knowsMaintenance: '¿Sabía que un sitio web necesita mantenimiento regular?',
  maintenanceType: '¿Qué tipo de plan de mantenimiento prefiere?',
  needsSupport: '¿Necesitará soporte técnico o ayuda con el sitio una vez lanzado?',
  futureFeatures: '¿Tiene planes de añadir nuevas funcionalidades o secciones en el futuro?',
  expectsGrowth: '¿Espera que su sitio web crezca mucho en visitas o contenido?',
  hostingType: 'Tipo de hosting',
  seoLevel: 'Nivel de SEO',
  ecommerceFeatures: 'Funcionalidades de tienda',
  region: 'Región para impuestos',
  oneTimeCosts: 'Costes Únicos',
  monthlyCosts: 'Costes Mensuales',
  annualCosts: 'Costes Anuales',
};


export const optionLists = {
    projectObjective: [
      { value: 'vender', label: 'Vender productos o servicios' },
      { value: 'informar', label: 'Informar sobre mi empresa' },
      { value: 'leads', label: 'Captar clientes potenciales' },
      { value: 'portfolio', label: 'Mostrar mi trabajo/portfolio' },
      { value: 'blog', label: 'Crear un blog o revista' },
      { value: 'otro', label: 'Otro objetivo' }
    ],
    hasBusinessName: [
      { value: 'si', label: 'Sí, ya tengo nombre' },
      { value: 'no', label: 'No, necesito ayuda para elegirlo' }
    ],
    hasLogo: [
      { value: 'si', label: 'Sí, tengo logo' },
      { value: 'no', label: 'No, necesito que lo diseñen' }
    ],
    hasContent: [
      { value: 'si', label: 'Sí, tengo todo el contenido' },
      { value: 'parcial', label: 'Tengo algo, pero necesito ayuda' },
      { value: 'no', label: 'No, necesito que lo creen' }
    ],
    knowsDomainHosting: [
      { value: 'si', label: 'Sí, lo sabía' },
      { value: 'no', label: 'No, es nuevo para mí' }
    ],
    needsDomainHelp: [
      { value: 'si', label: 'Sí, necesito ayuda completa' },
      { value: 'parcial', label: 'Solo necesito recomendaciones' },
      { value: 'no', label: 'No, yo me encargo' }
    ],
    manageForClient: [
      { value: 'si', label: 'Sí, prefiero que lo gestionen ustedes' },
      { value: 'no', label: 'No, prefiero gestionarlo yo' }
    ],
    hasDesignIdea: [
      { value: 'si', label: 'Sí, tengo referencias o ideas claras' },
      { value: 'parcial', label: 'Tengo algunas ideas generales' },
      { value: 'no', label: 'No, confío en su criterio profesional' }
    ],
    designType: [
      { value: 'plantilla', label: 'Plantilla profesional' },
      { value: 'personalizado', label: 'Diseño completamente personalizado' }
    ],
    basicFeatures: [
      { value: 'Formulario de contacto', label: 'Formulario de contacto' },
      { value: 'Galería de imágenes', label: 'Galería de imágenes' },
      { value: 'Mapa de ubicación', label: 'Mapa de ubicación' },
      { value: 'Testimonios de clientes', label: 'Testimonios de clientes' },
      { value: 'Información de la empresa', label: 'Información de la empresa' },
      { value: 'Catálogo de productos/servicios', label: 'Catálogo de productos/servicios' }
    ],
    advancedFeatures: [
      { value: 'Tienda online (e-commerce)', label: 'Tienda online (e-commerce)' },
      { value: 'Sistema de reservas/citas', label: 'Sistema de reservas/citas' },
      { value: 'Área de miembros/login', label: 'Área de miembros/login' },
      { value: 'Blog o noticias', label: 'Blog o noticias' },
      { value: 'Integración con redes sociales', label: 'Integración con redes sociales' },
      { value: 'Chat en vivo', label: 'Chat en vivo' },
      { value: 'Sistema de pagos', label: 'Sistema de pagos' },
      { value: 'Múltiples idiomas', label: 'Múltiples idiomas' }
    ],
    needsResponsive: [
      { value: 'si', label: 'Sí, es muy importante' },
      { value: 'no', label: 'No es prioritario' }
    ],
    knowsSEO: [
      { value: 'si', label: 'Sí, lo conozco' },
      { value: 'no', label: 'No, es nuevo para mí' }
    ],
    needsSEOHelp: [
      { value: 'basico', label: 'Configuración básica' },
      { value: 'avanzado', label: 'SEO completo y continuo' },
      { value: 'no', label: 'No es prioritario ahora' }
    ],
    hasKeywords: [
      { value: 'si', label: 'Sí, sé qué busca mi público' },
      { value: 'no', label: 'No, necesito investigación' }
    ],
    needsBlog: [
      { value: 'si', label: 'Sí, quiero publicar contenido regularmente' },
      { value: 'futuro', label: 'Tal vez en el futuro' },
      { value: 'no', label: 'No, no es necesario' }
    ],
    knowsMaintenance: [
      { value: 'si', label: 'Sí, lo sabía' },
      { value: 'no', label: 'No, es nuevo para mí' }
    ],
    maintenanceType: [
      { value: 'mensual', label: 'Plan mensual (más económico)' },
      { value: 'demanda', label: 'Pago por demanda' },
      { value: 'ninguno', label: 'Prefiero no incluir mantenimiento' }
    ],
    needsSupport: [
      { value: 'si', label: 'Sí, necesitaré soporte regular' },
      { value: 'ocasional', label: 'Solo ocasionalmente' },
      { value: 'no', label: 'No, prefiero ser independiente' }
    ],
    futureFeatures: [
      { value: 'si', label: 'Sí, tengo planes de expansión' },
      { value: 'posible', label: 'Es posible, depende del éxito' },
      { value: 'no', label: 'No, quiero algo simple y estático' }
    ],
    expectsGrowth: [
      { value: 'mucho', label: 'Sí, espero mucho crecimiento' },
      { value: 'moderado', label: 'Crecimiento moderado' },
      { value: 'poco', label: 'Poco crecimiento esperado' }
    ],
    hostingType: [
      { value: 'basic', label: 'Hosting básico' },
      { value: 'standard', label: 'Hosting estándar' },
      { value: 'premium', label: 'Hosting premium' }
    ],
    seoLevel: [
      { value: 'basic', label: 'SEO básico' },
      { value: 'advanced', label: 'SEO avanzado' },
      { value: 'premium', label: 'SEO premium' }
    ],
    ecommerceFeatures: [
      { value: 'basic', label: 'Tienda básica' },
      { value: 'advanced', label: 'Tienda avanzada' },
      { value: 'enterprise', label: 'Tienda empresarial' }
    ],
    region: [
      { value: 'peninsula', label: 'Península (IVA 21%)' },
      { value: 'canarias', label: 'Canarias (IGIC 7%)' }
    ]
  };
  