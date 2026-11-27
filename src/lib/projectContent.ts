import { useEffect, useState } from 'react'
import type { Category } from '@/components/ui/CategorySwitcher'

/**
 * Project metadata parsed from content.md frontmatter.
 *
 * Frontmatter format (top of content.md):
 * ---
 * title: Название проекта   # optional, falls back to first "# " heading
 * year: 2024                # optional, shown as a badge and used for sorting
 * category: 3d              # optional, filter category: 2d | 3d | design-system
 * cover: img-cover.png      # optional, falls back to first image in the body
 * size: 6                   # optional, card width in grid columns 1–12
 *                           # (words work too: full=12, half=6, third=4, quarter=3)
 * draft: true               # optional, hides the project from the UI and
 *                           # excludes its folder from the build entirely
 * ---
 */
export type ProjectMeta = {
  title?: string
  year?: string
  category?: Category
  cover?: string
  /** Card width in grid columns, 1–12 */
  span?: number
}

export type ParsedProject = {
  meta: ProjectMeta
  /** Markdown body with the frontmatter block removed */
  body: string
}

type HasContentFile = { id: string; contentFile?: string }

/** Path to a project's markdown file. Defaults to /projects/<id>/content.md */
export function projectContentFile(item: HasContentFile) {
  return item.contentFile ?? `/projects/${item.id}/content.md`
}

function parseFrontmatter(raw: string): {
  attrs: Record<string, string>
  body: string
} {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/)
  if (!match) return { attrs: {}, body: raw }

  const attrs: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const colon = trimmed.indexOf(':')
    if (colon === -1) continue
    const key = trimmed.slice(0, colon).trim().toLowerCase()
    let value = trimmed.slice(colon + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key) attrs[key] = value
  }
  return { attrs, body: raw.slice(match[0].length) }
}

function firstImageSrc(body: string): string | undefined {
  const m = body.match(/!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^)\s]+))/)
  return m?.[1] ?? m?.[2]
}

function firstHeading(body: string): string | undefined {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim()
}

/** Resolves an asset path relative to the content.md directory */
function resolveAssetPath(src: string, contentFile: string): string {
  if (src.startsWith('/') || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(src)) return src
  const dir = contentFile.slice(0, contentFile.lastIndexOf('/'))
  return `${dir}/${src}`
}

/**
 * Rewrites image srcs in the body to paths relative to the site root,
 * resolving plain filenames like ![](photo.png) or ![](<my photo.png>)
 * against the content.md directory — any file name works.
 */
function resolveBodyImages(body: string, contentFile: string): string {
  return body.replace(/!\[([^\]]*)\]\(<?([^)>]+?)>?\)/g, (match, alt, dest) => {
    const src = String(dest).trim()
    if (!src || /["']/.test(src)) return match
    const resolved = resolveAssetPath(src, contentFile)
    return `![${alt}](${/\s/.test(resolved) ? `<${resolved}>` : resolved})`
  })
}

/** Normalizes a frontmatter category value: "2D", "ds", "design system" → '2d' | '3d' | 'design-system' */
function normalizeCategory(value: string): Category | undefined {
  const v = value.trim().toLowerCase().replace(/[\s_]+/g, '-')
  if (v === '2d' || v === '3d' || v === 'design-system') return v
  if (v === 'ds' || v === 'designsystem') return 'design-system'
  return undefined
}

/** Normalizes a frontmatter size value into a 1–12 column span.
 *  Accepts a plain span ("6"), words ("half") or fractions ("1/2", "50%"). */
const sizeWords: Record<string, number> = {
  full: 12, '1/1': 12, '100': 12, '100%': 12,
  half: 6, '1/2': 6, '50': 6, '50%': 6,
  third: 4, '1/3': 4, '33': 4, '33%': 4,
  quarter: 3, '1/4': 3, '25': 3, '25%': 3,
}

function normalizeSize(value: string): number | undefined {
  const v = value.trim().toLowerCase()
  if (v in sizeWords) return sizeWords[v]
  const n = Number.parseInt(v, 10)
  if (Number.isFinite(n) && n >= 1 && n <= 12) return n
  return undefined
}

const cache = new Map<string, Promise<ParsedProject | null>>()

/**
 * Fetches and parses a project's content.md. Results are cached in-memory,
 * so card list and expanded/page views share a single request per file.
 * Returns null when the file is missing (e.g. dev-server SPA fallback).
 */
export function fetchProjectContent(
  contentFile: string,
): Promise<ParsedProject | null> {
  let promise = cache.get(contentFile)
  if (!promise) {
    promise = fetch(contentFile, { cache: 'no-store' })
      .then((res) => {
        const contentType = res.headers.get('content-type') ?? ''
        if (!res.ok || contentType.includes('text/html')) return null
        return res.text()
      })
      .then((raw) => {
        if (raw == null) return null
        const { attrs, body: rawBody } = parseFrontmatter(raw)
        const body = resolveBodyImages(rawBody, contentFile)
        const cover =
          attrs.cover || firstImageSrc(body)
        return {
          meta: {
            title: attrs.title || firstHeading(body),
            year: attrs.year || undefined,
            category: attrs.category
              ? normalizeCategory(attrs.category)
              : undefined,
            cover: cover ? resolveAssetPath(cover, contentFile) : undefined,
            span: attrs.size ? normalizeSize(attrs.size) : undefined,
          },
          body,
        }
      })
      .catch(() => null)
    cache.set(contentFile, promise)
  }
  return promise
}

/**
 * Loads parsed content (meta + body) for a single project file.
 * Returns undefined while loading, null when there is no file.
 */
export function useProjectContent(contentFile?: string) {
  const [parsed, setParsed] = useState<ParsedProject | null | undefined>(
    contentFile ? undefined : null,
  )

  useEffect(() => {
    if (!contentFile) {
      setParsed(null)
      return
    }
    let cancelled = false
    setParsed(undefined)
    fetchProjectContent(contentFile).then((result) => {
      if (!cancelled) setParsed(result)
    })
    return () => {
      cancelled = true
    }
  }, [contentFile])

  return parsed
}
