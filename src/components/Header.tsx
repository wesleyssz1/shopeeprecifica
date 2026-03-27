import { ShoppingBag, Moon, Sun, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { exportProductsToCSV, Product } from '@/lib/shopee';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  products?: Product[];
}

export function Header({ products = [] }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleExport = () => {
    if (products.length === 0) {
      toast({ title: 'Nenhum produto para exportar', variant: 'destructive' });
      return;
    }
    const csv = exportProductsToCSV(products);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopee-precifica-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'CSV exportado com sucesso!' });
  };

  return (
    <header className="gradient-shopee px-6 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
            <ShoppingBag className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-primary-foreground tracking-tight">
              Shopee Precifica
            </h1>
            <p className="text-sm text-primary-foreground/80 hidden sm:block">
              Precificação e Rentabilidade para Microempreendedores
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExport}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            title="Exportar CSV"
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            title="Alternar tema"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
