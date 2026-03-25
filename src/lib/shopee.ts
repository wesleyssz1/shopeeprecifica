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
}

export interface ProfitAnalysis {
  revenue: number;
  totalCost: number;
  shopeeFee: number;
  netProfit: number;
  profitMargin: number;
  markup: number;
  roi: number;
}

export function calculateProfit(product: Product): ProfitAnalysis {
  const revenue = product.sellingPrice * product.quantity;
  const shopeeFee = revenue * (product.shopeeCommission / 100);
  const totalCost =
    (product.costPrice + product.packagingCost + product.shippingCost) *
      product.quantity +
    shopeeFee +
    product.additionalFees;
  const netProfit = revenue - totalCost;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const costPerUnit = product.costPrice + product.packagingCost + product.shippingCost;
  const markup = costPerUnit > 0 ? ((product.sellingPrice - costPerUnit) / costPerUnit) * 100 : 0;
  const totalInvestment = totalCost - shopeeFee;
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  return { revenue, totalCost, shopeeFee, netProfit, profitMargin, markup, roi };
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
