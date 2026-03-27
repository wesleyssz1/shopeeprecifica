import { Product, calculateProfit, formatCurrency } from '@/lib/shopee';
import { TrendingUp, DollarSign, BarChart3, ShoppingCart, Package, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const totalProducts = products.length;
  const totalItems = products.reduce((s, p) => s + p.quantity, 0);

  const cards = [
    {
      title: 'Faturamento Total',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      accent: 'text-primary',
      bg: 'bg-accent',
      sub: `${totalProducts} produto(s)`,
    },
    {
      title: 'Lucro Líquido',
      value: formatCurrency(totalProfit),
      icon: TrendingUp,
      accent: totalProfit >= 0 ? 'text-success' : 'text-destructive',
      bg: totalProfit >= 0 ? 'bg-success/10' : 'bg-destructive/10',
      sub: `${totalItems} unidade(s)`,
    },
    {
      title: 'Taxas Shopee',
      value: formatCurrency(totalFees),
      icon: ShoppingCart,
      accent: 'text-warning',
      bg: 'bg-warning/10',
      sub: totalRevenue > 0 ? `${((totalFees / totalRevenue) * 100).toFixed(1)}% do faturamento` : '—',
    },
    {
      title: 'Margem Média',
      value: `${avgMargin.toFixed(1)}%`,
      icon: BarChart3,
      accent: avgMargin >= 20 ? 'text-success' : avgMargin >= 0 ? 'text-warning' : 'text-destructive',
      bg: avgMargin >= 20 ? 'bg-success/10' : avgMargin >= 0 ? 'bg-warning/10' : 'bg-destructive/10',
      sub: avgMargin >= 20 ? 'Saudável' : avgMargin >= 0 ? 'Atenção' : 'Crítico',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
            <div className={`p-2 rounded-lg ${card.bg} group-hover:scale-110 transition-transform`}>
              <card.icon className={`h-4 w-4 ${card.accent}`} />
            </div>
          </div>
          <p className={`text-2xl font-display font-bold ${card.accent}`}>{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
