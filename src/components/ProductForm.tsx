import { useState } from 'react';
import { Product } from '@/lib/shopee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, DollarSign, Truck, Percent, Plus } from 'lucide-react';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id'>) => void;
  initialData?: Product;
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
};

export function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [form, setForm] = useState(initialData || defaultProduct);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: field === 'name' ? value : Number(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    setForm(defaultProduct);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <DollarSign className="h-4 w-4 text-primary" />
            Custo do Produto (R$)
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
            Comissão Shopee (%)
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
          <Label className="text-sm font-medium text-foreground">Taxas Adicionais (R$)</Label>
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

      <Button type="submit" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        {initialData ? 'Atualizar Produto' : 'Adicionar Produto'}
      </Button>
    </form>
  );
}
