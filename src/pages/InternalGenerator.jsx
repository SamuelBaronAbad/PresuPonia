// File: src/pages/InternalGenerator.jsx (NEW)
// —————————————————————————————————————————
import React, { useState, useEffect } from 'react';
import { calculateQuote, formatPrice, pricingConfig } from '../pricing.js';
import { RegionSelector } from '@/components/ui/RegionSelector.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

export default function InternalGenerator() {
  const [hours, setHours] = useState(0);
  const [rate, setRate] = useState( pricingConfig.extras.development_hour );
  const [region, setRegion] = useState('peninsula');
  const [irpf, setIrpf] = useState(pricingConfig.defaultIrpf);
  const [result, setResult] = useState({});

  useEffect(() => {
    // reutilizamos calculateQuote para hacer un presupuesto interno sencillo
    const formData = {
      oneTime: { items: [], total: hours * rate },
      monthly: { items: [], total: 0 },
      annual: { items: [], total: 0 },
      region, irpf
    };
    setResult(calculateQuote(formData));
  }, [hours, rate, region, irpf]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="mb-4 text-xl font-bold">Generador Interno por Horas</h1>
      <Label>Horas:</Label>
      <Input type="number" value={hours} onChange={e => setHours(+e.target.value)} className="mb-2" />
      <Label>Tarifa €/hora:</Label>
      <Input type="number" value={rate} onChange={e => setRate(+e.target.value)} className="mb-2" />
      <RegionSelector region={region} onChange={setRegion} />
      <Label>IRPF (%):</Label>
      <Input type="number" value={irpf*100} onChange={e => setIrpf(+e.target.value/100)} className="mb-4" />

      <Card className="mt-4">
        <CardHeader><CardTitle>Resultado Interno</CardTitle></CardHeader>
        <CardContent>
          <p>Base: {formatPrice(hours*rate)}</p>
          <p>IRPF: -{formatPrice(result.irpfAmount)}</p>
          <p>{region==='canarias'?'IGIC':'IVA'}: {formatPrice(result.taxAmount)}</p>
          <hr className="my-2" />
          <p className="font-bold">Total: {formatPrice(result.total)}</p>
        </CardContent>
      </Card>
    </div>
);
}
