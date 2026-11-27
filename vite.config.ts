import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'

const DRAFTS_ID = 'virtual:portfolio-drafts'
const RESOLVED_DRAFTS_ID = '\0' + DRAFTS_ID
const ORDER_ID = 'virtual:portfolio-order'
const RESOLVED_ORDER_ID = '\0' + ORDER_ID

/** True when content.md frontmatter contains `draft: true` (yes/1/on work too) */
function isDraftMarkdown(raw: string): boolean {
  const frontmatter = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)
  return frontmatter
    ? /^draft\s*:\s*(?:true|yes|1|on)\s*$/im.test(frontmatter[1])
    : false
}

/** Ids of projects in public/projects whose content.md is marked as a draft */
function collectDraftIds(root: string): string[] {
  const projectsDir = path.resolve(root, 'public/projects')
  const drafts: string[] = []
  for (const entry of fs.readdirSync(projectsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    try {
      const raw = fs.readFileSync(
        path.join(projectsDir, entry.name, 'content.md'),
        'utf8',
      )
      if (isDraftMarkdown(raw)) drafts.push(entry.name)
    } catch {
      // no content.md — nothing to exclude
    }
  }
  return drafts.sort()
}

/** Project ids listed in public/projects.order — one per line, # comments */
function readProjectOrder(root: string): string[] {
  try {
    return fs
      .readFileSync(path.resolve(root, 'public/projects.order'), 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
  } catch {
    return []
  }
}

/**
 * Exposes the draft list as `import draftIds from 'virtual:portfolio-drafts'`
 * and strips draft folders from the build output, so drafts never deploy.
 */
function portfolioDrafts(): Plugin {
  let root = ''
  let outDir = 'dist'
  let isBuild = false

  return {
    name: 'portfolio-drafts',
    configResolved(config) {
      root = config.root
      outDir = config.build.outDir
      isBuild = config.command === 'build'
    },
    resolveId(id) {
      if (id === DRAFTS_ID) return RESOLVED_DRAFTS_ID
      if (id === ORDER_ID) return RESOLVED_ORDER_ID
    },
    load(id) {
      if (id === RESOLVED_DRAFTS_ID) {
        return `export default ${JSON.stringify(collectDraftIds(root))}`
      }
      if (id === RESOLVED_ORDER_ID) {
        return `export default ${JSON.stringify(readProjectOrder(root))}`
      }
    },
    handleHotUpdate({ file, server }) {
      if (/[/\\]projects[/\\][^/\\]+[/\\]content\.md$/.test(file)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_DRAFTS_ID)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
          return [mod]
        }
      }
      if (/[/\\]projects\.order$/.test(file)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ORDER_ID)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
          return [mod]
        }
      }
    },
    closeBundle() {
      if (!isBuild) return
      for (const id of collectDraftIds(root)) {
        fs.rmSync(path.resolve(root, outDir, 'projects', id), {
          recursive: true,
          force: true,
        })
      }
    },
  }
}

const OPTIMIZED_EXT = /\.(png|jpe?g|gif)$/i

/**
 * Removes source raster files from dist/projects when a .webp twin exists —
 * the app always references the optimized .webp versions, so shipping the
 * originals would just bloat the deploy artifact (~225MB).
 */
function stripOptimizedOriginals(): Plugin {
  let root = ''
  let outDir = 'dist'
  let isBuild = false

  return {
    name: 'strip-optimized-originals',
    configResolved(config) {
      root = config.root
      outDir = config.build.outDir
      isBuild = config.command === 'build'
    },
    closeBundle() {
      if (!isBuild) return
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) walk(full)
          else if (
            OPTIMIZED_EXT.test(entry.name) &&
            fs.existsSync(full.replace(OPTIMIZED_EXT, '.webp'))
          ) {
            fs.rmSync(full)
          }
        }
      }
      try {
        walk(path.resolve(root, outDir, 'projects'))
      } catch {
        // no projects dir — nothing to strip
      }
    },
  }
}

export default defineConfig({
  // GitHub Pages project site: https://olgaoriami-gif.github.io/Portfolio-oriamio/
  // When a custom domain is connected, change base to '/'.
  base: '/Portfolio-oriamio/',
  plugins: [react(), portfolioDrafts(), stripOptimizedOriginals()],
  server: {
    watch: {
      ignored: ['**/*.mp4'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
