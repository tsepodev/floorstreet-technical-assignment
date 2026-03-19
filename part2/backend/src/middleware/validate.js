const { z } = require("zod");

const productSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can have at most 2 decimal places"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .default(""),
});

/**
 * Validating req.body against the product schema.
 * Passes field-level errors to the client so the
 * frontend can display them inline per field.
 */
function validateProduct(req, res, next) {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    const errors = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0];
      if (field) errors[field] = err.message;
    });
    return res.status(400).json({ errors });
  }

  req.validatedData = result.data;
  next();
}

module.exports = { validateProduct };
