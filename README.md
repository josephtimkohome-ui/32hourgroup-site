# 32 Hour Group — Website

Official website for [32hourgroup.com](https://32hourgroup.com)

Built with plain HTML/CSS — no frameworks, no build tools, no dependencies.

---

## File Structure

```
32hourgroup-site/
│
├── index.html          → Homepage (StoryBrand framework)
├── manifesto.html      → The full Doctrine
├── principles.html     → The Five Domains deep dive
├── commandments.html   → The 10 Commandments
├── team.html           → Father Joe, High Stewardess, roles
├── faq.html            → FAQ with accordion
├── initiation.html     → Primary conversion / join page
├── store.html          → Resources and merch
│
├── _shared.css         → Shared styles across all pages
└── README.md           → This file
```

---

## Deployment

This site is hosted via **GitHub Pages**.

- Branch: `main`
- Source: `/ (root)`
- Custom domain: `32hourgroup.com`

### DNS Records (GoDaddy)

```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   YOUR-GITHUB-USERNAME.github.io
```

---

## Making Updates

Every page shares `_shared.css` for nav, footer, animations, and base styles.

Page-specific styles live in a `<style>` block inside each HTML file.

To update copy, colors, or content:
1. Edit the relevant `.html` file directly in GitHub
2. Commit — GitHub Pages redeploys automatically within ~60 seconds

---

## Key Links to Update

Before going live, update these placeholders:

| File | Element | Replace With |
|------|---------|--------------|
| `initiation.html` | Join the Community button `href="#"` | Your Discord invite link |
| `store.html` | Download buttons `href="#"` | PDF download links |
| `team.html` | High Stewardess name/bio | Actual name and bio |

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0a` |
| Dark | `#111111` |
| Card | `#161616` |
| Border | `#2a2a2a` |
| Gold | `#c9a84c` |
| Gold Dim | `#8a6f30` |
| White | `#f0ece4` |
| Grey | `#888880` |
| Light | `#d4d0c8` |

**Fonts** (Google Fonts — loaded in each page)
- Display: `Bebas Neue`
- Body: `Cormorant Garamond`
- Mono/UI: `DM Mono`

---

## The Doctrine

*A day is 32 hours. Live accordingly.*