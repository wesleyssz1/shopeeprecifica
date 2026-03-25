import { Product, calculateProfit, formatCurrency } from '@/lib/shopee';
import { Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Package className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Nenhum produto cadastrado</p>
        <p className="text-sm">Adicione seu primeiro produto para começar a análise</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-semibold text-foreground">Produto</th>
            <th className="text-right py-3 px-2 font-semibold text-foreground">Custo Unit.</th>
            <th className="text-right py-3 px-2 font-semibold text-foreground">Preço Venda</th>
            <th className="text-right py-3 px-2 font-semibold text-foreground">Taxa Shopee</th>
            <th className="text-right py-3 px-2 font-semibold text-foreground">Lucro Líq.</th>
            <th className="text-right py-3 px-2 font-semibold text-foreground">Margem</th>
            <th className="text-center py-3 px-2 font-semibold text-foreground">Ação</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const analysis = calculateProfit(product);
            const isProfit = analysis.netProfit > 0;
            const isLoss = analysis.netProfit < 0;

            return (
              <tr key={product.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-3 px-2">
                  <div>
                    <span className="font-medium text-foreground">{product.name}</span>
                    <span className="block text-xs text-muted-foreground">Qtd: {product.quantity}</span>
                  </div>
                </td>
                <td className="text-right py-3 px-2 text-muted-foreground">
                  {formatCurrency(product.costPrice + product.packagingCost + product.shippingCost)}
                </td>
                <td className="text-right py-3 px-2 font-medium text-foreground">
                  {formatCurrency(product.sellingPrice)}
                </td>
                <td className="text-right py-3 px-2 text-muted-foreground">
                  {formatCurrency(analysis.shopeeFee)}
                </td>
                <td className="text-right py-3 px-2">
                  <span className={`inline-flex items-center gap-1 font-semibold ${isProfit ? 'text-success' : isLoss ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {isProfit ? <TrendingUp className="h-3 w-3" /> : isLoss ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    {formatCurrency(analysis.netProfit)}
                  </span>
                </td>
                <td className="text-right py-3 px-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isProfit ? 'bg-success/10 text-success' : isLoss ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                  }`}>
                    {analysis.profitMargin.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(product.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  );
}
