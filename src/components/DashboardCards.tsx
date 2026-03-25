import { Product, calculateProfit, formatCurrency } from '@/lib/shopee';
import { TrendingUp, DollarSign, BarChart3, ShoppingCart } from 'lucide-react';

interface DashboardCardsProps {
  products: Product[];
}

export function DashboardCards({ products }: DashboardCardsProps) {
  const analyses = products.map(p => calculateProfit(p));

  const totalRevenue = analyses.reduce((s, a) => s + a.revenue, 0);
  const totalProfit = analyses.reduce((s, a) => s + a.netProfit, 0);
  const totalFees = analyses.reduce((s, a) => s + a.shopeeFee, 0);
  const avgMargin = analyses.length > 0
    ? analyses.reduce((s, a) => s + a.profitMargin, 0) / analyses.length
    : 0;

  const cards = [
    {
      title: 'Faturamento Total',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      accent: 'text-primary',
      bg: 'bg-accent',
    },
    {
      title: 'Lucro Líquido',
      value: formatCurrency(totalProfit),
      icon: TrendingUp,
      accent: totalProfit >= 0 ? 'text-success' : 'text-destructive',
      bg: totalProfit >= 0 ? 'bg-success/10' : 'bg-destructive/10',
    },
    {
      title: 'Taxas Shopee',
      value: formatCurrency(totalFees),
      icon: ShoppingCart,
      accent: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Margem Média',
      value: `${avgMargin.toFixed(1)}%`,
      icon: BarChart3,
      accent: avgMargin >= 20 ? 'text-success' : avgMargin >= 0 ? 'text-warning' : 'text-destructive',
      bg: avgMargin >= 20 ? 'bg-success/10' : avgMargin >= 0 ? 'bg-warning/10' : 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <div
          key={card.title}
          className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.accent}`} />
            </div>
          </div>
          <p className={`text-2xl font-display font-bold ${card.accent}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
