import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'

// Do buildu se přibalí jen README.md. Ostatní .md (CLAUDE.md, AUDIT.md,
// DEPLOY.md) jsou interní – zůstávají v repu a do `dist/` (a tím ani na web)
// se nekopírují. Neběží u SSR buildu (ten jede do .ssr-dist a hned se maže).
function copyReadme() {
  let isSsr = false
  return {
    name: 'copy-readme',
    apply: 'build',
    configResolved(config) {
      isSsr = !!config.build?.ssr
    },
    closeBundle() {
      if (!isSsr) copyFileSync('README.md', 'dist/README.md')
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyReadme()],
})
