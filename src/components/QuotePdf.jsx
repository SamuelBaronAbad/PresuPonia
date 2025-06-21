// src/components/QuotePdf.jsx
import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import { formatPrice } from '@/pricing.js'


const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: 'Helvetica', fontSize: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold' },
  section: { marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  detailLabel: { flex: 3 },
  detailValue: { flex: 1, textAlign: 'right' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginVertical: 8 },
  summaryContainer: { marginTop: 16, padding: 10, backgroundColor: '#f7f7f7', borderRadius: 4 },
  summaryTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
})

export const QuotePdf = ({ formData, quote }) => {
  // Cálculos para resumen
  const initialInvestment = quote.oneTime.total
  const annualCost = quote.annual.total
  const subtotal = quote.subtotal
  const irpfAmt = quote.irpfAmount
  const ivaAmt = quote.taxAmount
  const total = quote.total

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Presupuesto Web</Text>
          <Text>{new Date().toLocaleDateString('es-ES')}</Text>
        </View>

        {/* Detalle de partidas */}
        <View style={styles.section}>
          {quote.oneTime.items.map((it,i) => (
            <View key={`o${i}`} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{it.name}</Text>
              <Text style={styles.detailValue}>{formatPrice(it.price)}</Text>
            </View>
          ))}
          {quote.monthly.items.map((it,i) => (
            <View key={`m${i}`} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{it.name} /mes</Text>
              <Text style={styles.detailValue}>{formatPrice(it.price)}</Text>
            </View>
          ))}
          {quote.annual.items.map((it,i) => (
            <View key={`a${i}`} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{it.name} /año</Text>
              <Text style={styles.detailValue}>{formatPrice(it.price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Resumen de inversión */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumen de Inversión</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inversión inicial:</Text>
            <Text style={styles.detailValue}>{formatPrice(initialInvestment)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Costo anual:</Text>
            <Text style={styles.detailValue}>{formatPrice(annualCost)} €/año</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subtotal:</Text>
            <Text style={styles.detailValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>IRPF ({(quote.irpfRate*100).toFixed(0)}%):</Text>
            <Text style={styles.detailValue}>-{formatPrice(irpfAmt)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{formData.region === 'canarias' ? 'IGIC' : 'IVA'} ({(quote.taxRate*100).toFixed(0)}%):</Text>
            <Text style={styles.detailValue}>{formatPrice(ivaAmt)}</Text>
          </View>

          <View style={[styles.divider, { marginVertical: 6 }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { fontWeight: 'bold' }]}>Total:</Text>
            <Text style={[styles.detailValue, { fontWeight: 'bold' }]}>{formatPrice(total)}</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}
