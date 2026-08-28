import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.jsx'

// Vstupní bod pro prerender (viz scripts/prerender.mjs). Renderuje App
// pod StaticRouter do HTML řetězce; efekty (a tedy i live nastavování
// hlavičky přes usePageMeta) se přitom nespouští – meta doplní prerender skript.
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  )
}
