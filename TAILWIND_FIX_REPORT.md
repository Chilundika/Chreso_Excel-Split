# Tailwind Fix Report (Next.js 16 + Turbopack)

## Root cause
- Tailwind v4 was correctly installed, but `app/globals.css` used several `@apply` rules for utilities (e.g., `rounded-md`, `font-sans`).
- With the v4 PostCSS plugin, `@apply` throws when a utility can't be resolved in the current layer/context, which caused errors like “Cannot apply unknown utility class `rounded-md`/`font-sans`”.

## What was fixed
- Kept Tailwind v4 setup, ensured PostCSS uses `@tailwindcss/postcss` via `postcss.config.js`.
- Simplified `app/globals.css` to remove `@apply` blocks entirely. Retained design tokens via `@theme` and a minimal base style for the `body`. Component-level styling is handled directly with utilities in TSX files.
- Verified `app/layout.tsx` imports `./globals.css` (it does).

## Files touched
- `postcss.config.js` (CommonJS):
  ```js
  module.exports = {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  }
  ```
- `tailwind.config.js`:
  ```js
  module.exports = { darkMode: 'class' }
  ```
- `app/globals.css`: removed `@apply` usage and component/custom utilities; left tokens and minimal base.

## Verification
1. Cleared `.next` cache and restarted dev server.
2. Build no longer errors on `font-sans`/`rounded-md`.
3. Pages use Tailwind utilities from components, rendering as expected.

## Notes
- If you prefer Tailwind v3-style setup (content array + `tailwindcss`/`autoprefixer`), we can downgrade Tailwind to v3 and restore `@apply` rules. Current project remains on v4 which is supported by Next 16 + Turbopack.


