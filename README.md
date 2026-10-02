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

## Uploaded media

The six photos and two uploaded videos live in `public/assets/uploads/`. Only web-ready derivatives are published; the original PNG, JPEG, and MOV uploads are excluded from the site. The "Explore the tray design" clip and its preview images have been removed at the owner's request.

Photos use WebP with 480 px thumbnails, 960 px variants where appropriate, and full-size previews capped at 200 KB. `src/config/media.js` contains their intrinsic dimensions and Arabic/English descriptions. Videos use 720 px wide H.264/AAC MP4 with the MP4 index at the beginning for streaming, plus WebP preview images. `DeferredVideo` attaches each video URL only when clicked, including the existing opening video. Playing a video pauses the others.

`npm test` verifies photo/video size budgets and streamable MP4 structure. Shipping calculations remain unchanged by the media update.

## Cloudflare Pages deployment

Cloudflare Pages should stay connected to the GitHub `main` branch.

Use these production build settings:

```text
Build command: npm run build
Build output directory: dist/client
```

The same output directory is also saved in `wrangler.toml` as `pages_build_output_dir = "./dist/client"` so future deployments keep using the correct built website folder.
