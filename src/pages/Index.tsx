import { Header } from '@/components/Header';
import { ProductForm } from '@/components/ProductForm';
import { ProductTable } from '@/components/ProductTable';
import { DashboardCards } from '@/components/DashboardCards';
import { ProfitChart } from '@/components/ProfitChart';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { products, addProduct, deleteProduct } = useProducts();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Dashboard Cards */}
        <DashboardCards products={products} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card sticky top-8">
              <h2 className="text-lg font-display font-semibold text-foreground mb-5">
                Cadastrar Produto
              </h2>
              <ProductForm onSubmit={addProduct} />
            </div>
          </div>

          {/* Table + Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-display font-semibold text-foreground mb-4">
                Produtos Cadastrados
              </h2>
              <ProductTable products={products} onDelete={deleteProduct} />
            </div>

            <ProfitChart products={products} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <p className="text-center text-sm text-muted-foreground">
          Shopee Precifica © {new Date().getFullYear()} — Sistema de Precificação e Rentabilidade
        </p>
      </footer>
    </div>
  );
};

export default Index;
