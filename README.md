# Juzur Website

Full editable Vite/React project for the Juzur SofaTray website.

## Project Structure

- `package.json` - project scripts and dependencies
- `vite.config.js` - Vite configuration
- `index.html` - Vite app entry
- `src/` - React source code
- `src/components/` - website sections/components
- `src/hooks/` - website behavior and form logic
- `src/styles/` - main and latest styles
- `public/` - public files copied directly into the website
- `public/assets/` - product photos and brand images
- `google-apps-script-order-email.gs` - Google Apps Script helper for order emails
- `legacy-static-index.html` - backup of the original static HTML version

## Commands

```bash
npm install
npm run dev
npm run build
```

Manual check URL while the dev server is running:

```text
http://127.0.0.1:5173/
```

## Cloudflare Pages

Cloudflare Pages should stay connected to the GitHub `main` branch.

Use these production build settings:

```text
Build command: npm run build
Build output directory: dist/client
```

The same output directory is also saved in `wrangler.toml` as `pages_build_output_dir = "./dist/client"` so future deployments keep using the correct built website folder.
