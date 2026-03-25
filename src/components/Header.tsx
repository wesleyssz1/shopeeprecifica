import { ShoppingBag } from 'lucide-react';

export function Header() {
  return (
    <header className="gradient-shopee px-6 py-5">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
          <ShoppingBag className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-primary-foreground tracking-tight">
            Shopee Precifica
          </h1>
          <p className="text-sm text-primary-foreground/80">
            Precificação e Rentabilidade para Microempreendedores
          </p>
        </div>
      </div>
    </header>
  );
}
