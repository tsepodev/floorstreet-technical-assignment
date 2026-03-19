import { useState } from "react";

export function ProductCard({ product, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = () => setConfirming(true);
  const handleCancel = () => setConfirming(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onDelete(product.id);
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(product.price);

  return (
    <article className="product-card">
      <div className="product-card__body">
        <div className="product-card__meta">
          <h3 className="product-card__name">{product.name}</h3>
          <span className="product-card__price">{formattedPrice}</span>
        </div>

        {product.description && (
          <p className="product-card__desc">{product.description}</p>
        )}
      </div>

      <footer className="product-card__footer">
        {confirming ? (
          <div
            className="product-card__confirm"
            role="group"
            aria-label="Confirm deletion"
          >
            <span className="product-card__confirm-msg">
              Delete this product?
            </span>
            <div className="product-card__confirm-actions">
              <button
                className="btn btn--danger btn--sm"
                onClick={handleConfirm}
                disabled={deleting}
                aria-label={`Confirm delete ${product.name}`}
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                className="btn btn--ghost btn--sm"
                onClick={handleCancel}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="product-card__actions">
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => onEdit(product)}
              aria-label={`Edit ${product.name}`}
            >
              Edit
            </button>
            <button
              className="btn btn--danger-ghost btn--sm"
              onClick={handleDeleteClick}
              aria-label={`Delete ${product.name}`}
            >
              Delete
            </button>
          </div>
        )}
      </footer>
    </article>
  );
}
