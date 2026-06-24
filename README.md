# astryn-site

Marketing + legal site for **Astryn**, a product of Eluma Labs Ltd.

Static site (no build step). Deployed via Cloudflare Pages to `astryn-app.site`.

## Structure
- `index.html` — landing page
- `privacy.html` / `terms.html` — legal pages (generated)
- `style.css` — design system (dark cosmic theme)
- `app.js` — starfield canvas, scroll reveals, mobile nav
- `astryn-logo.png` — app icon
- `generate.py` — regenerates the HTML pages from the canonical legal copy

## Editing legal copy
Edit the `TERMS` / `PRIVACY` lists in `generate.py`, then:

```
python3 generate.py
```

Keep these in sync with the in-app source of truth at
`Astryn/Models/LegalContent.swift`.

## Deploy
Cloudflare Pages (Direct Upload or Git integration). The whole repo root is the
publish directory.
