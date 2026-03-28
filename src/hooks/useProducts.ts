import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/shopee';
import { useAuth } from './useAuth';

// Map DB row to frontend Product
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.nome,
    costPrice: Number(row.custo_atual),
    packagingCost: Number(row.custo_embalagem),
    shippingCost: Number(row.custo_frete),
    sellingPrice: Number(row.preco_venda),
    shopeeCommission: Number(row.comissao_shopee),
    additionalFees: Number(row.taxas_adicionais),
    quantity: row.quantidade,
    category: row.categoria || undefined,
    createdAt: row.created_at,
  };
}

export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data.map(rowToProduct));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    if (!user) return;
    const { error } = await supabase.from('produtos').insert({
      user_id: user.id,
      nome: product.name,
      custo_atual: product.costPrice,
      custo_embalagem: product.packagingCost,
      custo_frete: product.shippingCost,
      preco_venda: product.sellingPrice,
      comissao_shopee: product.shopeeCommission,
      taxas_adicionais: product.additionalFees,
      quantidade: product.quantity,
      categoria: product.category || null,
    });
    if (!error) await fetchProducts();
  }, [user, fetchProducts]);

  const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
    if (!user) return;
    const update: any = {};
    if (product.name !== undefined) update.nome = product.name;
    if (product.costPrice !== undefined) update.custo_atual = product.costPrice;
    if (product.packagingCost !== undefined) update.custo_embalagem = product.packagingCost;
    if (product.shippingCost !== undefined) update.custo_frete = product.shippingCost;
    if (product.sellingPrice !== undefined) update.preco_venda = product.sellingPrice;
    if (product.shopeeCommission !== undefined) update.comissao_shopee = product.shopeeCommission;
    if (product.additionalFees !== undefined) update.taxas_adicionais = product.additionalFees;
    if (product.quantity !== undefined) update.quantidade = product.quantity;
    if (product.category !== undefined) update.categoria = product.category || null;

    const { error } = await supabase.from('produtos').update(update).eq('id', id);
    if (!error) await fetchProducts();
  }, [user, fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('produtos').delete().eq('id', id);
    if (!error) await fetchProducts();
  }, [user, fetchProducts]);

  const duplicateProduct = useCallback(async (id: string) => {
    if (!user) return;
    const original = products.find(p => p.id === id);
    if (!original) return;
    await addProduct({ ...original, name: `${original.name} (cópia)` });
  }, [user, products, addProduct]);

  return { products, loading, addProduct, updateProduct, deleteProduct, duplicateProduct };
}
