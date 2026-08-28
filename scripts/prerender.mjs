// Prerender: po `vite build` + SSR buildu vygeneruje statické HTML pro každou
// routu z `src/lib/seo.js`. Přímé načtení / reload (i pro Seznambota, který JS
// renderuje špatně) tak dostane hotový obsah včetně správné hlavičky.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(pathToFileURL(join(root, '.ssr-dist/entry-server.js')).href)
const { PRERENDER_ROUTES, PAGE_META, DEFAULT_META, OG_IMAGE, SITE_URL, canonicalFor } = await import(
  pathToFileURL(join(root, 'src/lib/seo.js')).href
)

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const template = readFileSync(join(root, 'dist/index.html'), 'utf8')

const swapAttr = (html, selectorAttr, value) =>
  html.replace(
    new RegExp(`(<[^>]*${selectorAttr}[^>]*content=")[^"]*(")`, 'i'),
    `$1${esc(value)}$2`
  )

for (const route of PRERENDER_ROUTES) {
  const meta = PAGE_META[route] || DEFAULT_META
  const canonical = canonicalFor(route)
  const appHtml = render(route)

  let html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(meta.title)}</title>`)

  html = swapAttr(html, 'name="description"', meta.description)
  html = swapAttr(html, 'property="og:title"', meta.title)
  html = swapAttr(html, 'property="og:description"', meta.description)
  html = swapAttr(html, 'property="og:url"', canonical)
  html = swapAttr(html, 'property="og:image"', OG_IMAGE)
  html = swapAttr(html, 'name="twitter:title"', meta.title)
  html = swapAttr(html, 'name="twitter:description"', meta.description)
  html = swapAttr(html, 'name="twitter:image"', OG_IMAGE)
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/i,
    `$1${canonical}$2`
  )

  const outFile = route === '/' ? 'dist/index.html' : `dist${route}/index.html`
  mkdirSync(dirname(join(root, outFile)), { recursive: true })
  writeFileSync(join(root, outFile), html)
  console.log(`prerendered ${route}  ->  ${outFile}`)
}

rmSync(join(root, '.ssr-dist'), { recursive: true, force: true })
console.log(`\n${PRERENDER_ROUTES.length} routes prerendered, ${SITE_URL} SSR dir cleaned.`)
