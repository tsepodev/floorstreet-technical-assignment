import { ProductCard } from "./ProductCard";
import { EmptyState } from "./EmptyState";

function SkeletonCard() {
  return (
    <div className="product-card product-card--skeleton" aria-hidden="true">
      <div className="product-card__body">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line skeleton--line-short" />
      </div>
    </div>
  );
}

export function ProductList({
  products,
  loading,
  error,
  search,
  onEdit,
  onDelete,
  onAddClick,
}) {
  if (error) {
    return (
      <div className="list-error" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="product-grid" aria-label="Loading products">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState search={search} onAddClick={onAddClick} />;
  }

  return (
    <div className="product-grid" role="list" aria-label="Products">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
