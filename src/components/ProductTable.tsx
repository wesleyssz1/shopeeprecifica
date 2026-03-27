import { Product, calculateProfit, formatCurrency } from '@/lib/shopee';
import { Trash2, TrendingUp, TrendingDown, Minus, Edit2, Copy, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onDuplicate: (id: string) => void;
}

export function ProductTable({ products, onDelete, onEdit, onDuplicate }: ProductTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <PackageIcon className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Nenhum produto cadastrado</p>
        <p className="text-sm">Adicione seu primeiro produto para começar a análise</p>
      </div>
    );
  }

  const detailAnalysis = detailProduct ? calculateProfit(detailProduct) : null;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-semibold text-foreground">Produto</th>
              <th className="text-right py-3 px-2 font-semibold text-foreground hidden sm:table-cell">Custo Unit.</th>
              <th className="text-right py-3 px-2 font-semibold text-foreground">Preço Venda</th>
              <th className="text-right py-3 px-2 font-semibold text-foreground hidden md:table-cell">Taxa Shopee</th>
              <th className="text-right py-3 px-2 font-semibold text-foreground">Lucro Líq.</th>
              <th className="text-right py-3 px-2 font-semibold text-foreground hidden sm:table-cell">Margem</th>
              <th className="text-center py-3 px-2 font-semibold text-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {products.map(product => {
                const analysis = calculateProfit(product);
                const isProfit = analysis.netProfit > 0;
                const isLoss = analysis.netProfit < 0;

                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div>
                        <span className="font-medium text-foreground">{product.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">Qtd: {product.quantity}</span>
                          {product.category && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-2 text-muted-foreground hidden sm:table-cell">
                      {formatCurrency(analysis.costPerUnit)}
                    </td>
                    <td className="text-right py-3 px-2 font-medium text-foreground">
                      {formatCurrency(product.sellingPrice)}
                    </td>
                    <td className="text-right py-3 px-2 text-muted-foreground hidden md:table-cell">
                      {formatCurrency(analysis.shopeeFee)}
                    </td>
                    <td className="text-right py-3 px-2">
                      <span className={`inline-flex items-center gap-1 font-semibold ${isProfit ? 'text-success' : isLoss ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {isProfit ? <TrendingUp className="h-3 w-3" /> : isLoss ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                        {formatCurrency(analysis.netProfit)}
                      </span>
                    </td>
                    <td className="text-right py-3 px-2 hidden sm:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        isProfit ? 'bg-success/10 text-success' : isLoss ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                      }`}>
                        {analysis.profitMargin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setDetailProduct(product)} className="h-7 w-7 text-muted-foreground hover:text-primary" title="Detalhes">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(product)} className="h-7 w-7 text-muted-foreground hover:text-primary" title="Editar">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDuplicate(product.id)} className="h-7 w-7 text-muted-foreground hover:text-primary" title="Duplicar">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(product.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive" title="Excluir">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product detail modal */}
      <Dialog open={!!detailProduct} onOpenChange={() => setDetailProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{detailProduct?.name}</DialogTitle>
          </DialogHeader>
          {detailProduct && detailAnalysis && (
            <div className="space-y-4">
              {detailProduct.category && (
                <Badge variant="secondary">{detailProduct.category}</Badge>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <DetailRow label="Custo unitário" value={formatCurrency(detailAnalysis.costPerUnit)} />
                <DetailRow label="Preço de venda" value={formatCurrency(detailProduct.sellingPrice)} />
                <DetailRow label="Quantidade" value={String(detailProduct.quantity)} />
                <DetailRow label="Faturamento" value={formatCurrency(detailAnalysis.revenue)} />
                <DetailRow label="Taxa Shopee" value={formatCurrency(detailAnalysis.shopeeFee)} />
                <DetailRow label="Custo total" value={formatCurrency(detailAnalysis.totalCost)} />
                <DetailRow label="Lucro líquido" value={formatCurrency(detailAnalysis.netProfit)} highlight={detailAnalysis.netProfit >= 0 ? 'success' : 'destructive'} />
                <DetailRow label="Lucro/unidade" value={formatCurrency(detailAnalysis.profitPerUnit)} highlight={detailAnalysis.profitPerUnit >= 0 ? 'success' : 'destructive'} />
                <DetailRow label="Margem" value={`${detailAnalysis.profitMargin.toFixed(1)}%`} />
                <DetailRow label="Markup" value={`${detailAnalysis.markup.toFixed(1)}%`} />
                <DetailRow label="ROI" value={`${detailAnalysis.roi.toFixed(1)}%`} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: 'success' | 'destructive' }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className={`font-semibold ${highlight === 'success' ? 'text-success' : highlight === 'destructive' ? 'text-destructive' : 'text-foreground'}`}>
        {value}
      </span>
    </div>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  );
}
