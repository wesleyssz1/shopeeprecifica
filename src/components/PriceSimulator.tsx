import { useState } from 'react';
import { calculateIdealPrice, formatCurrency } from '@/lib/shopee';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function PriceSimulator() {
  const [cost, setCost] = useState(0);
  const [packaging, setPackaging] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [commission, setCommission] = useState(12);
  const [fees, setFees] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [targetMargin, setTargetMargin] = useState(30);

  const idealPrice = calculateIdealPrice(cost, packaging, shipping, commission, fees, quantity, targetMargin);

  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-6 shadow-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h3 className="text-lg font-display font-semibold text-foreground mb-5 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        Simulador de Preço Ideal
      </h3>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Field label="Custo (R$)" value={cost} onChange={setCost} />
        <Field label="Embalagem (R$)" value={packaging} onChange={setPackaging} />
        <Field label="Frete (R$)" value={shipping} onChange={setShipping} />
        <Field label="Comissão (%)" value={commission} onChange={setCommission} />
        <Field label="Taxas (R$)" value={fees} onChange={setFees} />
        <Field label="Quantidade" value={quantity} onChange={setQuantity} min={1} step={1} />
      </div>

      <div className="mt-4 space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4 text-primary" />
          Margem desejada: {targetMargin}%
        </Label>
        <input
          type="range"
          min="5"
          max="80"
          value={targetMargin}
          onChange={e => setTargetMargin(Number(e.target.value))}
          className="w-full accent-primary h-2 rounded-lg"
        />
      </div>

      <motion.div
        className="mt-5 rounded-lg bg-accent p-4 text-center border border-primary/20"
        key={idealPrice}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-xs text-muted-foreground mb-1">Preço de venda sugerido</p>
        <p className="text-2xl font-display font-bold text-primary">
          {idealPrice > 0 ? formatCurrency(idealPrice) : 'Margem inviável'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          para atingir {targetMargin}% de margem líquida
        </p>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, value, onChange, min = 0, step = 0.01 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; step?: number;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        step={step}
        min={min}
        value={value || ''}
        onChange={e => onChange(Number(e.target.value) || 0)}
        className="h-8 text-sm"
      />
    </div>
  );
}
