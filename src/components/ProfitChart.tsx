import { Product, calculateProfit, formatCurrency } from '@/lib/shopee';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProfitChartProps {
  products: Product[];
}

export function ProfitChart({ products }: ProfitChartProps) {
  if (products.length === 0) return null;

  const data = products.map(p => {
    const analysis = calculateProfit(p);
    return {
      name: p.name.length > 12 ? p.name.substring(0, 12) + '…' : p.name,
      lucro: Number(analysis.netProfit.toFixed(2)),
      margem: Number(analysis.profitMargin.toFixed(1)),
    };
  });

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="text-lg font-display font-semibold text-foreground mb-4">
        Lucro por Produto
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Bar dataKey="lucro" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.lucro >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
