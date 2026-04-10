# Webpack & babel

This note summarizes how Webpack works internally and why it uses different tools for development and production.

---

## 1. Purpose of Webpack

Webpack is a **module bundler** that transforms a project’s source code into a **single (or few) browser-ready bundle files**.

It:

* starts from an **entry file** (e.g. `src/index.js`)
* follows all `import` dependencies recursively
* outputs optimized files to a **build directory**

---

## 2. Environment: `env` and `argv`

Webpack config can be a function:

```js id="w1"
module.exports = (env, argv) => {}
```

* **env** → custom values passed from CLI (`--env KEY=value`)
* **argv** → CLI arguments like `mode` (`development` / `production`)

Example:

```bash id="w2"
webpack --mode=production
```

---

## 3. Development vs Production

You can branch logic based on mode:

* **development**

  * faster builds
  * no minification
  * better debugging

* **production**

  * optimized bundle
  * minification enabled
  * smaller file size

```js id="w3"
argv.mode === 'production'
```

---

## 4. DefinePlugin (global constants)

Webpack allows injecting **compile-time constants**:

```js id="w4"
new webpack.DefinePlugin({
  BACKEND_URL: JSON.stringify(url)
})
```

Used to:

* switch API URLs between dev/prod
* avoid hardcoding values in source code

---

## 5. Source Maps

```js id="w5"
devtool: 'source-map'
```

Purpose:

* maps bundled code back to original source
* improves debugging (correct file + line numbers)

---

## 6. DevServer vs Build

### Development

```bash id="w6"
webpack serve
```

* in-memory bundle
* hot reload
* fast feedback

### Production

```bash id="w7"
webpack --mode=production
```

* physical files in `/build`
* optimized + minified output

---

## 7. Minification

In production mode Webpack automatically:

* removes whitespace/comments
* shortens variable names
* reduces bundle size

This improves:

* load speed
* bandwidth usage

---

## 8. Static preview of build

```bash id="w8"
npx static-server
```

Used to:

* simulate real production hosting locally
* serve `/build` as static site

---

## 9. Polyfills

Some browser features (e.g. Promises, `Array.find`) may not exist in old browsers.

Solution:

* add **polyfills** to implement missing features

Example:

```js id="w9"
if (!window.Promise) {
  window.Promise = require('promise-polyfill')
}
```

---

## Core Idea

Webpack = **build-time transformation system** that:

> takes modular JS → resolves dependencies → applies loaders/plugins → outputs optimized browser bundle