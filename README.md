# LOVE.exe 💌

A little surprise from Aman for his best friend Aariya.

> “A Little Surprise From Your Best Friend!”

## Phase 1 — what is built

- Full-screen landing: badge, “Hey Aariya! ❤️”, subtitle, warning line, animated envelope, **OPEN YOUR SURPRISE 💌** button.
- Envelope opens with a floating-heart animation and shows the letter, with **CHALO SHURU KARTE HAIN 😂**.
- Loading screen: “Setting up Aariya's special experience...” with animated hearts and a progress bar.
- Placeholder screen: “Something interesting is coming, Aariya! 👀” — ready for Phase 2.
- Progress indicator (Surprise → Letter → Coming soon) + Restart on every screen.
- Footer: “Designed with ❤️ by Aman — Specially made for Aariya — Best Friends Forever! 😂”

## Design

Soft blush pink, lavender, cream white, rose pink, light peach. Glassmorphism cards, soft moving gradient, floating hearts / bubbles / stars, subtle desktop cursor sparkles. No neon, no ZINX / VYBEX / Instagram copy.

## Run locally

Open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy (GitHub Pages)

Push this folder to a public GitHub repo, then enable **Settings → Pages → Deploy from a branch → main / (root)**.

## Files

- `index.html` — screens + content
- `style.css` — design system (keep this for future phases)
- `script.js` — screen flow, envelope, loading, floating effects
