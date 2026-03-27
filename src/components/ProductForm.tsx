import { useState, useEffect } from 'react';
import { Product, CATEGORIES } from '@/lib/shopee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, DollarSign, Truck, Percent, Plus, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id'>) => void;
  initialData?: Product;
  onCancel?: () => void;
}

const defaultProduct = {
  name: '',
  costPrice: 0,
  packagingCost: 0,
  shippingCost: 0,
  sellingPrice: 0,
  shopeeCommission: 12,
  additionalFees: 0,
  quantity: 1,
  category: '',
};

export function ProductForm({ onSubmit, initialData, onCancel }: ProductFormProps) {
  const [form, setForm] = useState(initialData || defaultProduct);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: field === 'name' || field === 'category' ? value : Number(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    if (!initialData) setForm(defaultProduct);
  };

  // Live preview of profit
  const costPerUnit = form.costPrice + form.packagingCost + form.shippingCost;
  const revenue = form.sellingPrice * form.quantity;
  const shopeeFee = revenue * (form.shopeeCommission / 100);
  const totalCost = costPerUnit * form.quantity + shopeeFee + form.additionalFees;
  const estimatedProfit = revenue - totalCost;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Package className="h-4 w-4 text-primary" />
          Nome do Produto
        </Label>
        <Input
          id="name"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder="Ex: Capa para celular"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Categoria</Label>
        <Select value={form.category} onValueChange={v => handleChange('category', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <DollarSign className="h-4 w-4 text-primary" />
            Custo (R$)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.costPrice || ''}
            onChange={e => handleChange('costPrice', e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Package className="h-4 w-4 text-primary" />
            Embalagem (R$)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.packagingCost || ''}
            onChange={e => handleChange('packagingCost', e.target.value)}
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Truck className="h-4 w-4 text-primary" />
            Frete (R$)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.shippingCost || ''}
            onChange={e => handleChange('shippingCost', e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <DollarSign className="h-4 w-4 text-primary" />
            Preço de Venda (R$)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.sellingPrice || ''}
            onChange={e => handleChange('sellingPrice', e.target.value)}
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Percent className="h-4 w-4 text-primary" />
            Comissão (%)
          </Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={form.shopeeCommission || ''}
            onChange={e => handleChange('shopeeCommission', e.target.value)}
            placeholder="12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Taxas (R$)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.additionalFees || ''}
            onChange={e => handleChange('additionalFees', e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Quantidade</Label>
          <Input
            type="number"
            min="1"
            value={form.quantity || ''}
            onChange={e => handleChange('quantity', e.target.value)}
            placeholder="1"
          />
        </div>
      </div>

      {/* Live profit preview */}
      {form.sellingPrice > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`rounded-lg p-3 text-sm font-medium border ${
            estimatedProfit >= 0
              ? 'bg-success/10 text-success border-success/20'
              : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}
        >
          Lucro estimado: R$ {estimatedProfit.toFixed(2)}
        </motion.div>
      )}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1 gap-2">
          {initialData ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {initialData ? 'Salvar Alterações' : 'Adicionar Produto'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </motion.form>
  );
}
