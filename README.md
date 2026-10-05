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

The four photos and two uploaded videos live in `public/assets/uploads/`. Only web-ready derivatives are published; the original PNG, JPEG, and MOV uploads are excluded from the site. The "Explore the tray design" clip, the dimensions image, and the tall daylight photo with black bars have been removed along with their preview variants at the owner's request.

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

## Mobile speed improvements

The production build now pre-renders the existing React page into static HTML and hydrates it in the browser. Arabic is the shared initial render; saved English preferences are restored after hydration. The opening content appears without the reveal animation delay. The hero poster uses responsive candidates with high fetch priority. Gallery thumbnails use dedicated 192 px WebP files; the logo uses lossless WebP. Videos remain click-to-load and Meta tracking behavior is unchanged.

Validation: production build and all 66 existing tests pass. Additional isolated DOM checks verified pre-rendered content, image references, hydration in both saved languages, language switching, deferred video sources, and Cairo shipping totals. The private preview was checked visually and benchmarked separately; its hosting and disabled Meta tracking mean its score is not a production guarantee.
