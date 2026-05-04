import { Product, calculateProfit, formatCurrency } from '@/lib/shopee';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ProfitChartProps {
  products: Product[];
}

export function ProfitChart({ products }: ProfitChartProps) {
  if (products.length === 0) return null;

  const barData = products.map(p => {
    const analysis = calculateProfit(p);
    return {
      name: p.name.length > 12 ? p.name.substring(0, 12) + '…' : p.name,
      lucro: Number(analysis.netProfit.toFixed(2)),
      margem: Number(analysis.profitMargin.toFixed(1)),
    };
  });

  // Cost breakdown pie data
  const totals = products.reduce(
    (acc, p) => {
      const a = calculateProfit(p);
      acc.custo += p.costPrice * p.quantity;
      acc.embalagem += p.packagingCost * p.quantity;
      acc.frete += p.shippingCost * p.quantity;
      acc.taxaShopee += a.shopeeFee;
      acc.taxasAdicionais += p.additionalFees;
      return acc;
    },
    { custo: 0, embalagem: 0, frete: 0, taxaShopee: 0, taxasAdicionais: 0 }
  );

  const pieData = [
    { name: 'Custo Produto', value: Number(totals.custo.toFixed(2)), fill: 'hsl(var(--primary))' },
    { name: 'Embalagem', value: Number(totals.embalagem.toFixed(2)), fill: 'hsl(var(--warning))' },
    { name: 'Frete', value: Number(totals.frete.toFixed(2)), fill: 'hsl(16, 70%, 65%)' },
    { name: 'Taxa Shopee', value: Number(totals.taxaShopee.toFixed(2)), fill: 'hsl(var(--destructive))' },
    { name: 'Taxas Adicionais', value: Number(totals.taxasAdicionais.toFixed(2)), fill: 'hsl(var(--muted-foreground))' },
  ].filter(d => d.value > 0);

  // Margin comparison
  const marginData = products.map(p => {
    const a = calculateProfit(p);
    return {
      name: p.name.length > 12 ? p.name.substring(0, 12) + '…' : p.name,
      margem: Number(a.profitMargin.toFixed(1)),
      markup: Number(a.markup.toFixed(1)),
      roi: Number(a.roi.toFixed(1)),
    };
  });

  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-5 shadow-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Tabs defaultValue="lucro">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-semibold text-foreground">
            Análise Visual
          </h3>
          <TabsList className="h-8">
            <TabsTrigger value="lucro" className="text-xs px-3 h-7">Lucro</TabsTrigger>
            <TabsTrigger value="custos" className="text-xs px-3 h-7">Custos</TabsTrigger>
            <TabsTrigger value="metricas" className="text-xs px-3 h-7">Métricas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lucro">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
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
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.lucro >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="custos">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(((percent ?? 0)) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="metricas">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={marginData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                formatter={(value: number) => `${value}%`}
              />
              <Legend />
              <Bar dataKey="margem" name="Margem %" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="markup" name="Markup %" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="roi" name="ROI %" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
