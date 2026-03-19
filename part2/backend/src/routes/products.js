const express = require("express");
const db = require("../db");
const { validateProduct } = require("../middleware/validate");

const router = express.Router();

// GET /api/products
// ?search= query param for server-side filtering
router.get("/", (req, res) => {
  const { search } = req.query;

  let products;
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    products = db
      .prepare(
        `
        SELECT * FROM products
        WHERE name LIKE ? OR description LIKE ?
        ORDER BY created_at DESC
      `
      )
      .all(term, term);
  } else {
    products = db
      .prepare("SELECT * FROM products ORDER BY created_at DESC")
      .all();
  }

  res.json(products);
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const product = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(req.params.id);

  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// POST /api/products
router.post("/", validateProduct, (req, res) => {
  const { name, price, description } = req.validatedData;

  const result = db
    .prepare(
      `
      INSERT INTO products (name, price, description)
      VALUES (?, ?, ?)
    `
    )
    .run(name, price, description);

  const created = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(created);
});

// PUT /api/products/:id
router.put("/:id", validateProduct, (req, res) => {
  const { name, price, description } = req.validatedData;

  const existing = db
    .prepare("SELECT id FROM products WHERE id = ?")
    .get(req.params.id);

  if (!existing) return res.status(404).json({ error: "Product not found" });

  db.prepare(
    `
    UPDATE products
    SET name = ?, price = ?, description = ?, updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(name, price, description, req.params.id);

  const updated = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(req.params.id);

  res.json(updated);
});

// DELETE /api/products/:id
router.delete("/:id", (req, res) => {
  const existing = db
    .prepare("SELECT id FROM products WHERE id = ?")
    .get(req.params.id);

  if (!existing) return res.status(404).json({ error: "Product not found" });

  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);

  // 204 No Content — delete succeeded
  res.status(204).send();
});

module.exports = router;
