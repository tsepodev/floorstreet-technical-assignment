# Part 1 — Custom Product Showcase

A fully merchant-customisable Shopify product showcase section built to Online Store 2.0 standards.

---

## Installation

1. In your Shopify admin go to **Online Store → Themes → your theme → Edit code**
2. Under `Sections/` click **Add a new section** and name it `custom-product-showcase`
3. Paste the contents of `custom-product-showcase.liquid` and save
4. Go to **Customize** in the theme editor
5. On any page, click **Add section** — the section will appear as **Product Showcase**
6. Add product blocks if needed and configure settings from the sidebar

---

## What's built

A responsive product showcase section with:

- 3–4 product cards rendered via a Liquid block loop
- Each card shows product image, secondary hover image, title, short description, price, discounted price, and a dynamic percentage-off badge
- An Add to Cart button that triggers a native `<dialog>` popup with a View Cart CTA
- A reviews carousel at the bottom with touch/swipe support, dot navigation, and auto-advance
- Full merchant configurability via the Shopify theme editor — no code changes needed

---

## Structure

Everything lives in a single `.liquid` file as specified, organised into four clearly commented sections:

```
custom-product-showcase.liquid
├── Liquid logic      — block filtering, fallback data, variable assignment
├── HTML markup       — semantic section, product grid, dialog, reviews carousel
├── <style>           — scoped CSS with custom properties, BEM naming
└── <script>          — vanilla JS for dialog and carousel, no dependencies
└── {% schema %}      — full OS 2.0 schema with settings, blocks, and presets
```

---

## Decisions & Trade-offs

**Blocks over a hardcoded loop** — Products and reviews are both configured as blocks in the schema. This means a merchant can reorder, add, or remove cards directly from the theme editor without touching code. The `presets` entry makes the section one-click-addable from Customize.

**Graceful demo fallback** — If no product blocks have a product assigned, the section renders four hardcoded demo cards automatically. A reviewer or merchant sees a fully populated section immediately rather than a blank page. The fallback checks `block.settings.product != blank` rather than just `product_blocks.size > 0`, so adding an empty block doesn't break the fallback.

**Native `<dialog>` instead of `alert()`** — The Add to Cart interaction uses the HTML `<dialog>` element with a CSS slide-up animation, backdrop blur, a View Cart CTA, and an auto-close timer. This is accessible by default and keyboard-dismissable.

**`@media (hover: hover)` guards** — All hover states are wrapped in this media query so they only fire on devices that genuinely support hover. On touch devices there are no sticky or accidental hover states.

**BEM-style `psc__` prefix** — All CSS classes are namespaced with `psc__` (Product Showcase Component) to avoid conflicts with theme globals. CSS custom properties are scoped to `#section-{{ section.id }}` so multiple instances of the section on the same page don't interfere with each other.

**Discount badge from Liquid math** — The percentage-off badge is calculated dynamically using `compare_at_price` and `price`. Shopify stores prices in cents so `plus: 0.0` is used to force float division and avoid integer rounding errors. The badge only renders when a genuine discount exists.

**Secondary image hover** — Each card supports a crossfade to a second product image on hover, using `p.images[1]` for real products and a second demo URL for fallback cards. Pure CSS, no JS.

**Mobile snap carousel** — On viewports below 580px the product grid converts from a CSS Grid layout to a horizontal scroll-snap carousel. Cards are `65vw` wide so the next card peeks in, signalling to the user that more products are available. No additional JS.

**Vanilla JS, no dependencies** — The dialog and reviews carousel are built in plain JavaScript. No jQuery, no libraries. Keeps the section lightweight and avoids version conflicts with whatever JS is already running in the theme.

---
