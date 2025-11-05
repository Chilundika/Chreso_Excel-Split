## Tailwind CSS Analysis and Fixes

### ✅ Working configuration
- `app/layout.tsx` imports `app/globals.css`, so global styles are wired at the app root.
- UI components (`components/ui/*.tsx`) correctly use Tailwind utility classes.

### ⚠️ Issues found
- Tailwind v4 was installed (`tailwindcss@4.x`), but there was no PostCSS config. Without `@tailwindcss/postcss`, the `@tailwind` directives in `globals.css` are not processed, so utilities don't render.
- `tailwind.config.js` contained an obsolete `content` array pointing to `./src/**`, which doesn't match the project structure and is unnecessary in Tailwind v4.
- `app/globals.css` defined color variables using custom names (e.g. `--background`) instead of Tailwind v4 tokens. Classes like `bg-background`, `text-muted-foreground`, `border-border`, etc., only work when matching `@theme` tokens (e.g. `--color-background`).
- `app/globals.css` applied a global border to every element: `* { @apply border ... }`, producing visible borders across the app (seen on the login page and dashboard).

### 💡 Implemented fixes
1. Added PostCSS config for Tailwind v4 processing:
   - `postcss.config.mjs`
     ```js
     export default {
       plugins: {
         "@tailwindcss/postcss": {},
       },
     }
     ```
2. Normalized Tailwind config for v4:
   - `tailwind.config.js`: removed obsolete `content` paths; kept `darkMode: 'class'`.
3. Converted globals to use Tailwind v4 tokens and removed the global border rule:
   - Replaced custom `:root` variables with an `@theme` block defining `--color-*` tokens matching utilities like `bg-background`, `text-muted-foreground`, `border-border`, etc.
   - Added a scoped dark theme override via `@theme .dark { ... }`.
   - Adjusted base layer so `* { @apply border-border; }` only sets the border color token and does not add borders everywhere.

### 🧩 File-level recommendations
- Keep design tokens centralized in `app/globals.css` inside the `@theme` block. Add any new semantic colors there using the `--color-*` naming so they are available as utilities.
- For component-specific styles, prefer Tailwind utilities directly in TSX. Use `@layer components` only for re-usable class patterns.
- If you ever move to Tailwind v3, reintroduce `postcss.config.js` with `tailwindcss` and `autoprefixer`, plus a proper `content` array; otherwise, stay on v4 and avoid `content` paths.

### Visual expectations
- With the above changes, Tailwind utilities render correctly on the login page and dashboard. The heavy borders from the previous global rule are gone, matching the intended screenshots.


