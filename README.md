# Mint & Paw

Front end for [mintandpaw.com](https://mintandpaw.com), a pet-supplies brand site. It is in the brand-showcase stage: pages and interactions are live, while cart, checkout and accounts are not built yet.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4. Static export to plain HTML/CSS/JS, deployed on Cloudflare Pages.

## Highlights

- **Claw-machine product section:** a hand-written `requestAnimationFrame` loop drives the claw, the grab and the drop (`src/components/ClawMachine.tsx`); no animation library.
- **Playful hero:** squishable brand lettering and draggable stickers.
- **Shop by mood:** category pages generated from one content file (`src/content/moods.ts`) by pet "mood" (zoomies, snooze, snacks, sniffs).
- **Scroll reveals** with a small `IntersectionObserver` component.
- Content (products, images, brand info, policy text) lives in `src/content/`, separate from components.

## Pages

| Path | Content |
|---|---|
| `/` | Hero, claw-machine product section, toy of the month, pet wall, newsletter signup |
| `/shop/` | Shop overview |
| `/shop/<mood>/` | Category pages by mood |
| `/about/`, `/contact/` | About and contact |
| `/policies/<slug>/` | Shipping, returns, privacy, terms (draft outlines) |

## Run Locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
npm run lint
```

## Status

- Product and pet images are placeholders linked from third-party hosts; they belong to their owners and will be replaced with the brand's own photos.
- The newsletter form does not store emails yet.
- Policy pages are outlines pending final copy.
