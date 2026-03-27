export interface Product {
  id: string;
  name: string;
  costPrice: number;
  packagingCost: number;
  shippingCost: number;
  sellingPrice: number;
  shopeeCommission: number; // percentage
  additionalFees: number;
  quantity: number;
  category?: string;
  createdAt?: string;
}

export interface ProfitAnalysis {
  revenue: number;
  totalCost: number;
  shopeeFee: number;
  netProfit: number;
  profitMargin: number;
  markup: number;
  roi: number;
  costPerUnit: number;
  profitPerUnit: number;
}

export function calculateProfit(product: Product): ProfitAnalysis {
  const revenue = product.sellingPrice * product.quantity;
  const shopeeFee = revenue * (product.shopeeCommission / 100);
  const costPerUnit = product.costPrice + product.packagingCost + product.shippingCost;
  const totalCost =
    costPerUnit * product.quantity + shopeeFee + product.additionalFees;
  const netProfit = revenue - totalCost;
  const profitPerUnit = product.quantity > 0 ? netProfit / product.quantity : 0;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const markup = costPerUnit > 0 ? ((product.sellingPrice - costPerUnit) / costPerUnit) * 100 : 0;
  const totalInvestment = totalCost - shopeeFee;
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  return { revenue, totalCost, shopeeFee, netProfit, profitMargin, markup, roi, costPerUnit, profitPerUnit };
}

/**
 * Calculate the ideal selling price for a target profit margin
 */
export function calculateIdealPrice(
  costPrice: number,
  packagingCost: number,
  shippingCost: number,
  shopeeCommission: number,
  additionalFees: number,
  quantity: number,
  targetMargin: number
): number {
  const costPerUnit = costPrice + packagingCost + shippingCost;
  const totalBaseCost = costPerUnit * quantity + additionalFees;
  // revenue - (commissionRate * revenue) - totalBaseCost = targetMargin/100 * revenue
  // revenue * (1 - commissionRate - targetMargin/100) = totalBaseCost
  const denominator = 1 - shopeeCommission / 100 - targetMargin / 100;
  if (denominator <= 0) return 0;
  const totalRevenue = totalBaseCost / denominator;
  return quantity > 0 ? totalRevenue / quantity : 0;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function exportProductsToCSV(products: Product[]): string {
  const headers = [
    'Nome', 'Categoria', 'Custo', 'Embalagem', 'Frete', 'Preço Venda',
    'Comissão %', 'Taxas Adicionais', 'Quantidade', 'Faturamento',
    'Lucro Líquido', 'Margem %', 'Markup %', 'ROI %'
  ];

  const rows = products.map(p => {
    const a = calculateProfit(p);
    return [
      p.name, p.category || '', p.costPrice, p.packagingCost, p.shippingCost,
      p.sellingPrice, p.shopeeCommission, p.additionalFees, p.quantity,
      a.revenue.toFixed(2), a.netProfit.toFixed(2), a.profitMargin.toFixed(1),
      a.markup.toFixed(1), a.roi.toFixed(1)
    ].join(';');
  });

  return [headers.join(';'), ...rows].join('\n');
}

export const CATEGORIES = [
  'Eletrônicos',
  'Moda',
  'Casa e Decoração',
  'Beleza e Saúde',
  'Acessórios',
  'Brinquedos',
  'Esportes',
  'Outros',
] as const;
