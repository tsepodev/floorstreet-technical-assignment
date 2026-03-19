export function EmptyState({ search }) {
  if (search) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">No products match "{search}"</p>
        <p className="empty-state__sub">Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <p className="empty-state__title">No products yet</p>
      <p className="empty-state__sub">Add your first product to get started.</p>
    </div>
  );
}
