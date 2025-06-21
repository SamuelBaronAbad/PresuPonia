# Generador de Presupuestos Web - Instrucciones de Uso

## Descripción
Este es un sitio web completo para generar presupuestos personalizados de desarrollo web. Está diseñado específicamente para ayudar a profesionales del desarrollo web a crear presupuestos detallados para clientes que no tienen conocimientos técnicos.

## Características Principales

### 📋 Formulario Completo de 6 Pasos
1. **Información Básica del Proyecto** - Objetivo, nombre, logo, contenido
2. **Dominio y Hosting** - Registro de dominio, tipo de hosting, certificados SSL
3. **Funcionalidades del Sitio** - Características técnicas y funcionales
4. **SEO y Marketing** - Optimización, analytics, marketing digital
5. **Mantenimiento y Soporte** - Actualizaciones, backups, soporte técnico
6. **Presupuesto y Cronograma** - Plazos, forma de pago, garantías

### 💰 Sistema de Precios Inteligente
- Cálculo automático basado en las respuestas del cliente
- Precios separados por categorías: únicos, mensuales y anuales
- Posibilidad de editar precios manualmente
- Exportación del presupuesto en formato texto

### 🎨 Diseño Profesional
- Interfaz moderna y responsive
- Animaciones suaves y efectos visuales
- Compatible con dispositivos móviles
- Indicador de progreso visual

## Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de software adicional

### Instrucciones de Uso

1. **Abrir el sitio web**
   - Abra el archivo `index.html` en la carpeta `dist/` con su navegador web
   - O suba los archivos de la carpeta `dist/` a su servidor web

2. **Completar el formulario**
   - Responda las preguntas paso a paso
   - Use el indicador de progreso para ver su avance
   - Puede navegar entre pasos usando los botones "Anterior" y "Siguiente"

3. **Generar presupuesto**
   - Al completar todos los pasos, se generará automáticamente un presupuesto detallado
   - Revise los costos calculados en las diferentes categorías

4. **Editar precios (opcional)**
   - Haga clic en "Editar Precios" para ajustar manualmente cualquier valor
   - Los totales se recalcularán automáticamente

5. **Exportar presupuesto**
   - Use el botón "Descargar Presupuesto" para obtener un archivo de texto
   - El archivo incluye resumen del proyecto, costos detallados y notas importantes

## Personalización de Precios

Los precios se pueden ajustar editando el archivo `src/pricing.js`. Este archivo contiene:

- **Precios base** para diferentes tipos de servicios
- **Multiplicadores** según la complejidad del proyecto
- **Costos adicionales** por funcionalidades específicas
- **Precios de mantenimiento** mensual y anual

### Ejemplo de modificación:
```javascript
// En src/pricing.js
export const basePrices = {
  development: {
    simple: 800,      // Sitio web básico
    medium: 1500,     // Sitio web intermedio
    complex: 3000     // Sitio web complejo
  },
  // ... más configuraciones
}
```

## Estructura de Archivos

```
presupuesto-web/
├── dist/                 # Archivos de producción (usar estos)
│   ├── index.html       # Archivo principal
│   ├── assets/          # CSS y JavaScript compilados
│   └── ...
├── src/                 # Código fuente (para modificaciones)
│   ├── App.jsx         # Componente principal
│   ├── pricing.js      # Configuración de precios
│   ├── components/     # Componentes React
│   └── ...
├── package.json        # Dependencias del proyecto
└── README.md          # Este archivo
```

## Soporte Técnico

### Problemas Comunes

1. **El sitio no carga correctamente**
   - Asegúrese de abrir el archivo `dist/index.html`
   - Verifique que su navegador sea compatible (versión reciente)

2. **Los precios no se calculan**
   - Revise que todas las preguntas estén respondidas
   - Intente refrescar la página y volver a completar el formulario

3. **La descarga no funciona**
   - Algunos navegadores pueden bloquear descargas automáticas
   - Permita las descargas en la configuración de su navegador

### Modificaciones Avanzadas

Para realizar cambios en el código:

1. Instale Node.js y pnpm
2. Ejecute `pnpm install` en la carpeta del proyecto
3. Modifique los archivos en `src/`
4. Ejecute `pnpm run build` para generar nueva versión
5. Use los archivos actualizados en `dist/`

## Licencia y Créditos

Este proyecto fue desarrollado como una herramienta profesional para la generación de presupuestos web. Puede ser modificado y distribuido según sus necesidades comerciales.

---

**¡Listo para usar!** Simplemente abra `dist/index.html` en su navegador y comience a generar presupuestos profesionales para sus clientes.

