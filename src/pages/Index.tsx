import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ProductForm } from '@/components/ProductForm';
import { ProductTable } from '@/components/ProductTable';
import { DashboardCards } from '@/components/DashboardCards';
import { ProfitChart } from '@/components/ProfitChart';
import { PriceSimulator } from '@/components/PriceSimulator';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/shopee';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Index = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct, duplicateProduct } = useProducts();
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  const handleAdd = async (product: Omit<Product, 'id'>) => {
    await addProduct(product);
    toast({ title: 'Produto adicionado!', description: product.name });
  };

  const handleUpdate = async (product: Omit<Product, 'id'>) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, product);
      toast({ title: 'Produto atualizado!', description: product.name });
      setEditingProduct(null);
    }
  };

  const handleDelete = async (id: string) => {
    const p = products.find(p => p.id === id);
    await deleteProduct(id);
    toast({ title: 'Produto excluído', description: p?.name, variant: 'destructive' });
  };

  const handleDuplicate = async (id: string) => {
    await duplicateProduct(id);
    toast({ title: 'Produto duplicado!' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header products={[]} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header products={products} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <DashboardCards products={products} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card sticky top-8">
              <Tabs defaultValue="cadastro">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="cadastro" className="flex-1 text-xs">
                    {editingProduct ? 'Editar Produto' : 'Cadastrar'}
                  </TabsTrigger>
                  <TabsTrigger value="simulador" className="flex-1 text-xs">
                    Simulador
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cadastro">
                  <ProductForm
                    key={editingProduct?.id || 'new'}
                    onSubmit={editingProduct ? handleUpdate : handleAdd}
                    initialData={editingProduct || undefined}
                    onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
                  />
                </TabsContent>

                <TabsContent value="simulador">
                  <PriceSimulator />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="rounded-xl border border-border bg-card p-6 shadow-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-display font-semibold text-foreground">
                  Produtos Cadastrados
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({filteredProducts.length})
                  </span>
                </h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produto..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
              <ProductTable
                products={filteredProducts}
                onDelete={handleDelete}
                onEdit={setEditingProduct}
                onDuplicate={handleDuplicate}
              />
            </motion.div>

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
