# Space Invaders: Cosmic Defense

Classic arcade shooter reimagined for Web3. A mini app for **Base.app** and **Farcaster**.

## Features

- Classic Space Invaders gameplay with neon cyberpunk aesthetic
- Mobile-first: swipe to move, tap to shoot
- Desktop: arrow keys + Space
- Wave progression with increasing difficulty
- Destructible shields
- Score sharing
- Farcaster & Base mini app ready

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **State:** Zustand
- **Platform:** Base.app, Farcaster

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) locally, or [https://space-invaders-brown.vercel.app](https://space-invaders-brown.vercel.app) in production.

## Deployment (Vercel)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set `NEXT_PUBLIC_URL` to `https://space-invaders-brown.vercel.app` (or leave unset on Vercel)
4. After deploy, add `accountAssociation` in [Base Build](https://www.base.dev/preview?tab=account):
   - Paste your domain → Submit → Verify → Copy credentials
5. Update `farcaster.config.ts` with `accountAssociation`
6. Redeploy

## Validation

- **Embed:** [Farcaster Embed Tool](https://farcaster.xyz/~/developers/mini-apps/embed?url=https://space-invaders-brown.vercel.app/)
- **Preview:** [Base Preview](https://base.dev/preview?url=https://space-invaders-brown.vercel.app/)

## Controls

| Platform | Move | Shoot | Pause |
|----------|------|-------|-------|
| Mobile   | Swipe left/right | Tap | — |
| Desktop  | ← → | Space | P / Esc |
