import { useState, useCallback } from 'react';
import { Product, generateId } from '@/lib/shopee';

const STORAGE_KEY = 'shopee-products';

function loadProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts(prev => {
      const next = [...prev, { ...product, id: generateId(), createdAt: new Date().toISOString() }];
      saveProducts(next);
      return next;
    });
  }, []);

  const updateProduct = useCallback((id: string, product: Partial<Product>) => {
    setProducts(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...product } : p));
      saveProducts(next);
      return next;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      saveProducts(next);
      return next;
    });
  }, []);

  const duplicateProduct = useCallback((id: string) => {
    setProducts(prev => {
      const original = prev.find(p => p.id === id);
      if (!original) return prev;
      const copy = { ...original, id: generateId(), name: `${original.name} (cópia)`, createdAt: new Date().toISOString() };
      const next = [...prev, copy];
      saveProducts(next);
      return next;
    });
  }, []);

  return { products, addProduct, updateProduct, deleteProduct, duplicateProduct };
}
