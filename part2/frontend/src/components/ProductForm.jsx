import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Price must be a positive number",
    }),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .default(""),
});

export function ProductForm({ product, onSubmit, onCancel, loading }) {
  const isEditing = Boolean(product);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ? String(product.price) : "",
      description: product?.description ?? "",
    },
  });

  // Reset form when switching between add/edit
  useEffect(() => {
    reset({
      name: product?.name ?? "",
      price: product?.price ? String(product.price) : "",
      description: product?.description ?? "",
    });
  }, [product, reset]);

  const onValid = async (data) => {
    await onSubmit({
      ...data,
      price: parseFloat(parseFloat(data.price).toFixed(2)),
    });
    if (!isEditing) reset();
  };

  const busy = isSubmitting || loading;

  return (
    <div className="form-card">
      <h2 className="form-card__title">
        {isEditing ? "Edit product" : "Add a product"}
      </h2>

      <form onSubmit={handleSubmit(onValid)} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className={`field__input ${
              errors.name ? "field__input--error" : ""
            }`}
            type="text"
            placeholder="e.g. Oak Side Table"
            autoComplete="off"
            {...register("name")}
          />
          {errors.name && (
            <p className="field__error" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="price">
            Price (£)
          </label>
          <input
            id="price"
            className={`field__input ${
              errors.price ? "field__input--error" : ""
            }`}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("price")}
          />
          {errors.price && (
            <p className="field__error" role="alert">
              {errors.price.message}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="description">
            Description <span className="field__optional">(optional)</span>
          </label>
          <textarea
            id="description"
            className={`field__input field__input--textarea ${
              errors.description ? "field__input--error" : ""
            }`}
            placeholder="Brief product description..."
            rows={3}
            {...register("description")}
          />
          {errors.description && (
            <p className="field__error" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="form-card__actions">
          {isEditing && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onCancel}
              disabled={busy}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy
              ? isEditing
                ? "Saving…"
                : "Adding…"
              : isEditing
              ? "Save changes"
              : "Add product"}
          </button>
        </div>
      </form>
    </div>
  );
}
