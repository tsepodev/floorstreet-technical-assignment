import { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import { useToast, ToastContainer } from "./components/Toast";
import { ProductForm } from "./components/ProductForm";
import { ProductList } from "./components/ProductList";
import { SearchBar } from "./components/SearchBar";
import "./index.css";

export default function App() {
  const {
    products,
    loading,
    error,
    search,
    handleSearch,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { toasts, addToast } = useToast();
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        addToast("Product updated");
        setEditingProduct(null);
      } else {
        await createProduct(data);
        addToast("Product added");
      }
    } catch (err) {
      const msg = err?.errors
        ? "Please fix the errors below"
        : "Something went wrong. Try again.";
      addToast(msg, "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      addToast("Product deleted");
    } catch {
      addToast("Failed to delete product", "error");
    }
  };

  const handleCancel = () => setEditingProduct(null);

  const handleAddClick = () => {
    setEditingProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__logo">FS</span>
            <div>
              <p className="app-header__eyebrow">FloorStreet</p>
              <h1 className="app-header__title">Product Manager</h1>
            </div>
          </div>
          <p className="app-header__count">
            {loading
              ? "—"
              : `${products.length} product${products.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={formLoading}
          />
        </aside>

        <section className="app-content">
          <div className="app-content__toolbar">
            <SearchBar value={search} onChange={handleSearch} />
          </div>
          <ProductList
            products={products}
            loading={loading}
            error={error}
            search={search}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddClick={handleAddClick}
          />
        </section>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
