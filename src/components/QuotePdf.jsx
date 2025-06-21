// src/components/QuotePdf.jsx - VERSIÓN MEJORADA
import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'
import { formatPrice, generateProjectSummary } from '@/pricing.js'

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica',
    fontSize: 11,
    backgroundColor: '#ffffff',
  },
  
  // Header con gradiente
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    color: 'white',
    marginBottom: 0,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  subtitle: {
    fontSize: 14,
    opacity: 0.9,
  },
  
  dateInfo: {
    textAlign: 'right',
  },
  
  dateText: {
    fontSize: 12,
    marginBottom: 3,
  },
  
  // Contenido principal
  content: {
    padding: 30,
  },
  
  // Sección de resumen del proyecto
  projectSummary: {
    backgroundColor: '#f8fafc',
    padding: 17,
    borderRadius: 8,
    marginBottom: 25,
    border: '1px solid #e2e8f0',
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  projectItem: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 4,
    paddingLeft: 10,
  },
  
  // Secciones de costos
  costSection: {
    marginBottom: 25,
  },
  
  costSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: '2px solid #667eea',
  },
  
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 2,
    backgroundColor: '#fafbfc',
    borderRadius: 4,
  },
  
  costItemAlternate: {
    backgroundColor: '#f1f5f9',
  },
  
  costItemContent: {
    flex: 3,
  },
  
  costItemName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  
  costItemDescription: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.3,
  },
  
  costItemPrice: {
    flex: 1,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },
  
  // Totales de sección
  sectionTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTop: '1px solid #d1d5db',
    backgroundColor: '#667eea',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  
  sectionTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  sectionTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Resumen final
  finalSummary: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  
  finalSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  
  summaryLabel: {
    fontSize: 12,
  },
  
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  summaryDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    marginVertical: 10,
  },
  
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTop: '2px solid rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
  },
  
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Notas importantes
  notesSection: {
    marginTop: 30,
    backgroundColor: '#fef3c7',
    padding: 20,
    borderRadius: 8,
    border: '1px solid #fbbf24',
  },
  
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 10,
  },
  
  noteItem: {
    fontSize: 9,
    color: '#92400e',
    marginBottom: 6,
    paddingLeft: 10,
    lineHeight: 1.4,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTop: '1px solid #e5e7eb',
  },
  
  footerText: {
    fontSize: 8,
    color: '#6b7280',
  },
  
  // Segunda página
  pageBreak: {
    pageBreakBefore: 'always',
  },
  
  // Gráfico de costos (simulado con elementos visuales)
  chartContainer: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    border: '1px solid #e2e8f0',
  },
  
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  chartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  chartLabel: {
    width: 100,
    fontSize: 9,
    color: '#374151',
  },
  
  chartBarFill: {
    height: 15,
    backgroundColor: '#667eea',
    marginRight: 10,
    borderRadius: 2,
  },
  
  chartValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
  },
})

export const QuotePdf = ({ formData, quote }) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const projectSummary = generateProjectSummary(formData)
  
  // Cálculos para el resumen
  const initialInvestment = quote.oneTime.total
  const monthlyRecurring = quote.monthly.total
  const annualRecurring = quote.annual.total
  const monthlyAnnualCost = monthlyRecurring * 12
  const firstYearTotal = initialInvestment + monthlyAnnualCost + annualRecurring
  
  // Para el gráfico de distribución de costos
  const maxValue = Math.max(initialInvestment, monthlyAnnualCost, annualRecurring)
  const getBarWidth = (value) => Math.max((value / maxValue) * 200, 10)

  return (
    <Document>
      {/* PÁGINA 1: Resumen ejecutivo */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>PRESUPUESTO WEB</Text>
              <Text style={styles.subtitle}>Propuesta de Desarrollo Profesional</Text>
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateText}>Fecha: {currentDate}</Text>
              <Text style={styles.dateText}>Válido: 30 días</Text>
            </View>
          </View>
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          {/* Resumen del Proyecto */}
          <View style={styles.projectSummary}>
            <Text style={styles.sectionTitle}>Resumen del Proyecto</Text>
            {projectSummary.map((item, index) => (
              <Text key={index} style={styles.projectItem}>
                • {item}
              </Text>
            ))}
          </View>

          {/* Gráfico de Distribución de Costos */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Distribución de Inversión</Text>
            
            {initialInvestment > 0 && (
              <View style={styles.chartBar}>
                <Text style={styles.chartLabel}>Inversión inicial</Text>
                <View style={[styles.chartBarFill, { width: getBarWidth(initialInvestment) }]} />
                <Text style={styles.chartValue}>{formatPrice(initialInvestment)}</Text>
              </View>
            )}
            
            {monthlyAnnualCost > 0 && (
              <View style={styles.chartBar}>
                <Text style={styles.chartLabel}>Anual mensual</Text>
                <View style={[styles.chartBarFill, { width: getBarWidth(monthlyAnnualCost) }]} />
                <Text style={styles.chartValue}>{formatPrice(monthlyAnnualCost)}</Text>
              </View>
            )}
            
            {annualRecurring > 0 && (
              <View style={styles.chartBar}>
                <Text style={styles.chartLabel}>Anual directo</Text>
                <View style={[styles.chartBarFill, { width: getBarWidth(annualRecurring) }]} />
                <Text style={styles.chartValue}>{formatPrice(annualRecurring)}</Text>
              </View>
            )}
          </View>

          {/* Resumen Financiero */}
          <View style={styles.finalSummary}>
            <Text style={styles.finalSummaryTitle}>Resumen de Inversión</Text>
            
            {initialInvestment > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Inversión inicial</Text>
                <Text style={styles.summaryValue}>{formatPrice(initialInvestment)}</Text>
              </View>
            )}
            
            {monthlyRecurring > 0 && (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Costo mensual</Text>
                  <Text style={styles.summaryValue}>{formatPrice(monthlyRecurring)}/mes</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Costo anual (servicios mensuales)</Text>
                  <Text style={styles.summaryValue}>{formatPrice(monthlyAnnualCost)}</Text>
                </View>
              </>
            )}
            
            {annualRecurring > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Costos anuales directos</Text>
                <Text style={styles.summaryValue}>{formatPrice(annualRecurring)}</Text>
              </View>
            )}

            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(quote.subtotal)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>IRPF ({(quote.irpfRate * 100).toFixed(0)}%)</Text>
              <Text style={styles.summaryValue}>-{formatPrice(quote.irpfAmount)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {formData.region === 'canarias' ? 'IGIC' : 'IVA'} ({(quote.taxRate * 100).toFixed(0)}%)
              </Text>
              <Text style={styles.summaryValue}>{formatPrice(quote.taxAmount)}</Text>
            </View>

            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total primer año</Text>
              <Text style={styles.summaryValue}>{formatPrice(firstYearTotal)}</Text>
            </View>

            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>TOTAL (con impuestos)</Text>
              <Text style={styles.grandTotalValue}>{formatPrice(quote.total)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Presupuesto generado el {currentDate}
          </Text>
          <Text style={styles.footerText}>
            Página 1 de 2
          </Text>
        </View>
      </Page>

      {/* PÁGINA 2: Desglose detallado */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>DESGLOSE DETALLADO</Text>
              <Text style={styles.subtitle}>Especificaciones y Costos por Partida</Text>
            </View>
          </View>
        </View>

        {/* Contenido detallado */}
        <View style={styles.content}>
          {/* Costos únicos */}
          {quote.oneTime.items.length > 0 && (
            <View style={styles.costSection}>
              <Text style={styles.costSectionTitle}>INVERSIÓN INICIAL</Text>
              {quote.oneTime.items.map((item, index) => (
                <View key={index} style={[
                  styles.costItem, 
                  index % 2 === 1 ? styles.costItemAlternate : {}
                ]}>
                  <View style={styles.costItemContent}>
                    <Text style={styles.costItemName}>{item.name}</Text>
                    <Text style={styles.costItemDescription}>{item.description}</Text>
                  </View>
                  <Text style={styles.costItemPrice}>{formatPrice(item.price)}</Text>
                </View>
              ))}
              <View style={styles.sectionTotal}>
                <Text style={styles.sectionTotalLabel}>SUBTOTAL INICIAL</Text>
                <Text style={styles.sectionTotalValue}>{formatPrice(quote.oneTime.total)}</Text>
              </View>
            </View>
          )}

          {/* Costos mensuales */}
          {quote.monthly.items.length > 0 && (
            <View style={styles.costSection}>
              <Text style={styles.costSectionTitle}>SERVICIOS MENSUALES</Text>
              {quote.monthly.items.map((item, index) => (
                <View key={index} style={[
                  styles.costItem, 
                  index % 2 === 1 ? styles.costItemAlternate : {}
                ]}>
                  <View style={styles.costItemContent}>
                    <Text style={styles.costItemName}>{item.name}</Text>
                    <Text style={styles.costItemDescription}>{item.description}</Text>
                  </View>
                  <Text style={styles.costItemPrice}>{formatPrice(item.price)}/mes</Text>
                </View>
              ))}
              <View style={styles.sectionTotal}>
                <Text style={styles.sectionTotalLabel}>SUBTOTAL MENSUAL</Text>
                <Text style={styles.sectionTotalValue}>{formatPrice(quote.monthly.total)}/mes</Text>
              </View>
              <View style={[styles.sectionTotal, { backgroundColor: '#059669' }]}>
                <Text style={styles.sectionTotalLabel}>EQUIVALENTE ANUAL (×12)</Text>
                <Text style={styles.sectionTotalValue}>{formatPrice(quote.monthly.total * 12)}</Text>
              </View>
            </View>
          )}

          {/* Costos anuales */}
          {quote.annual.items.length > 0 && (
            <View style={styles.costSection}>
              <Text style={styles.costSectionTitle}>SERVICIOS ANUALES</Text>
              {quote.annual.items.map((item, index) => (
                <View key={index} style={[
                  styles.costItem, 
                  index % 2 === 1 ? styles.costItemAlternate : {}
                ]}>
                  <View style={styles.costItemContent}>
                    <Text style={styles.costItemName}>{item.name}</Text>
                    <Text style={styles.costItemDescription}>{item.description}</Text>
                  </View>
                  <Text style={styles.costItemPrice}>{formatPrice(item.price)}/año</Text>
                </View>
              ))}
              <View style={styles.sectionTotal}>
                <Text style={styles.sectionTotalLabel}>SUBTOTAL ANUAL</Text>
                <Text style={styles.sectionTotalValue}>{formatPrice(quote.annual.total)}/año</Text>
              </View>
            </View>
          )}

          {/* Notas importantes */}
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>TÉRMINOS Y CONDICIONES</Text>
            {quote.notes.map((note, index) => (
              <Text key={index} style={styles.noteItem}>
                • {note}
              </Text>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Este presupuesto es válido por 30 días desde la fecha de emisión
          </Text>
          <Text style={styles.footerText}>
            Página 2 de 2
          </Text>
        </View>
      </Page>
    </Document>
  )
}