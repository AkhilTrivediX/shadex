# Shadex

🎨 A plug-and-play shader library for React + Three.js, with a beautiful docs site.

## 📦 `shadex/package`
The NPM package source.

## 🌐 `shadex/web`
The documentation and showcase site (Next.js).

## Monorepo setup
This is a monorepo. Run commands from root:

```bash
pnpm install
pnpm --filter web dev
pnpm --filter package build
```