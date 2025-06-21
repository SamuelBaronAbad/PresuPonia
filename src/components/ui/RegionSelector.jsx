// File: src/components/ui/RegionSelector.jsx
import React from 'react';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select.jsx';

/**
 * Selector de región para IVA/IGIC.
 * @param {{ region: string, onChange: (value: string) => void }} props
 */
export function RegionSelector({ region, onChange }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Label>Región:</Label>
      <Select value={region} onValueChange={onChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Seleccione región" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="peninsula">Península (IVA 21%)</SelectItem>
          <SelectItem value="canarias">Canarias (IGIC 7%)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
