# Vite Internals & esbuild

This note summarizes how **Vite works internally** and why it uses different tools for development and production.

---

## 🚀 Development Mode (npm run dev)

* Vite does **NOT bundle code** during development
* Uses native **ES Modules (ESM)** in the browser
* Each file is served **on demand**

### Key points:

* Fast startup (no bundling step)
* Instant updates (HMR — Hot Module Replacement)
* Uses **esbuild** for:

  * Fast TypeScript transpilation
  * Dependency pre-bundling

---

## ⚡ esbuild Role

* Extremely fast (written in Go)
* Used in Vite for:

  * Transforming code (TS → JS)
  * Pre-bundling dependencies

> Not used for production bundling due to limited optimization features

---

## 📦 Production Build (npm run build)

* Vite uses **Rollup** for bundling
* Generates optimized output in `/dist`

### Optimizations:

* **Minification** → smaller files
* **Tree-shaking** → removes unused code
* **Code splitting** → multiple chunks for better loading

---

## 🔀 Why not esbuild for production?

Limitations of esbuild:

* Less advanced **code splitting**
* Weaker **chunk optimization**
* Smaller plugin ecosystem

👉 Rollup produces more optimized and predictable builds for real-world apps

---

### 🧠 Mental Model

```txt
DEV:
Browser ←→ Vite (ESM, no bundle, esbuild)

BUILD:
Vite → Rollup → optimized /dist
```
---

### ⚠️ Note

Vite may switch to esbuild for production in the future once its capabilities improve.