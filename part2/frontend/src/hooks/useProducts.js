import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../api/products';

export function useProducts() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState('');

  const fetchProducts = useCallback(async (term = search) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll(term);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (data) => {
    const created = await productsApi.create(data);
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct = async (id, data) => {
    const updated = await productsApi.update(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  // Optimistic delete — remove immediately, restore on failure
  const deleteProduct = async (id) => {
    const snapshot = products;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await productsApi.delete(id);
    } catch (err) {
      setProducts(snapshot);
      throw err;
    }
  };

  const handleSearch = (term) => {
    setSearch(term);
    fetchProducts(term);
  };

  return {
    products,
    loading,
    error,
    search,
    handleSearch,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}