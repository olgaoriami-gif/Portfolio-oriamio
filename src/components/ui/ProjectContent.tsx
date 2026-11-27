import { useEffect, useRef, type CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'
import type { Node, Parent } from 'unist'
import { cn } from '@/lib/utils'
import { typograph } from '@/lib/typograph'

type ProjectContentProps = {
  markdown: string
}

type DirectiveNode = Parent & {
  type: 'containerDirective'
  name: string
  attributes: Record<string, string>
}

/**
 * Parses the alt text of an image as a grid span spec:
 *   ![6](src)            → span 6 (of 12), no caption
 *   ![6/4](src)          → span 6 desktop, span 4 on mobile
 *   ![6@4](src)          → span 6 starting at column line 4
 *   ![4@center](src)     → span 4 centered in the 12-col grid
 *   ![6|Caption](src)    → span 6 with caption
 *   ![Caption](src)      → default span with caption
 * Only 1–12 counts as a span; anything else is treated as a caption.
 */
function parseImageAlt(alt?: string | null): {
  span?: number
  start?: number
  mobile?: number
  caption?: string
} {
  if (!alt) return {}
  const m = alt.match(
    /^([1-9]|1[0-2])(?:\/([1-9]|1[0-2]))?(?:@([1-9]|1[0-3]|center|c))?\s*(?:\|\s*([\s\S]*))?$/,
  )
  if (!m) return { caption: alt }
  const start =
    m[3] == null
      ? undefined
      : m[3] === 'center' || m[3] === 'c'
        ? Math.floor((12 - Number(m[1])) / 2) + 1
        : Number(m[3])
  return {
    span: Number(m[1]),
    mobile: m[2] ? Number(m[2]) : undefined,
    start,
    caption: m[4]?.trim() || undefined,
  }
}

/** grid-column value for an item: explicit start/span or the container default */
function gridColumnFor(span?: number, start?: number): string {
  if (!span) return 'span var(--g-span, 1)'
  return start ? `${start} / span ${span}` : `span ${span}`
}

type MediaCell = { item: HTMLElement; cell: HTMLElement; media: HTMLElement }

/** Finds the media cell inside a grid item (img/video or its [data-media] wrapper) */
function mediaCellOf(item: HTMLElement): MediaCell | null {
  if (item.matches('img,video')) return { item, cell: item, media: item }
  const cell = item.matches('[data-media]')
    ? item
    : item.querySelector<HTMLElement>(':scope > [data-media]')
  if (!cell) return null
  const media = cell.matches('img,video')
    ? cell
    : cell.querySelector<HTMLElement>('img,video')
  return media ? { item, cell, media } : null
}

function naturalHeightAt(media: HTMLElement, width: number): number | undefined {
  if (media instanceof HTMLImageElement && media.naturalWidth) {
    return (width * media.naturalHeight) / media.naturalWidth
  }
  if (media instanceof HTMLVideoElement && media.videoWidth) {
    return (width * media.videoHeight) / media.videoWidth
  }
  return undefined
}

/**
 * Equalizes media item heights inside a 12-col gallery grid, row by row.
 * Row height = rendered height of its widest item (others crop via
 * object-fit). `data-row-h="<cols>"` on the grid sets a fixed row height
 * in column units instead.
 */
function equalizeGrid(grid: HTMLElement) {
  const cells: MediaCell[] = []
  for (const item of Array.from(grid.children) as HTMLElement[]) {
    if (item.classList.contains('gallery-12')) continue // nested row — handled on its own
    const cell = mediaCellOf(item)
    if (cell) cells.push(cell)
  }

  for (const { item, cell, media } of cells) {
    item.style.height = ''
    item.style.display = ''
    item.style.flexDirection = ''
    cell.style.flex = ''
    cell.style.minHeight = ''
    cell.style.display = ''
    cell.style.flexDirection = ''
    media.style.flex = ''
    media.style.minHeight = ''
    media.style.objectFit = ''
  }

  const rows = new Map<number, MediaCell[]>()
  for (const c of cells) {
    const top = Math.round(c.item.offsetTop)
    const row = rows.get(top) ?? []
    row.push(c)
    rows.set(top, row)
  }

  const gap = parseFloat(getComputedStyle(grid).rowGap) || 0
  const colW = (grid.getBoundingClientRect().width - 11 * gap) / 12
  const fixedH = Number(grid.dataset.rowH || 0) * colW

  for (const [, rowCells] of rows) {
    let target = fixedH
    if (!target) {
      let widestW = -1
      for (const { item, media } of rowCells) {
        const w = item.getBoundingClientRect().width
        if (w <= widestW) continue
        const h = naturalHeightAt(media, w)
        if (h == null) continue
        widestW = w
        target = h
      }
    }
    if (!target) continue
    for (const { item, cell, media } of rowCells) {
      if (media === item) {
        item.style.height = `${target}px`
        item.style.objectFit = 'cover'
        item.style.width = '100%'
        continue
      }
      item.style.height = `${target}px`
      item.style.display = 'flex'
      item.style.flexDirection = 'column'
      cell.style.flex = '1 1 0'
      cell.style.minHeight = '0'
      cell.style.display = 'flex'
      cell.style.flexDirection = 'column'
      media.style.flex = '1 1 0'
      media.style.minHeight = '0'
      media.style.objectFit = 'cover'
    }
  }
}

function remarkTypography() {
  return (tree: Node) => {
    visit(tree, 'text', (node: Node & { value?: string }) => {
      if (typeof node.value === 'string') node.value = typograph(node.value)
    })
  }
}

function remarkDirectiveLayout() {
  const paddingValue = (value?: string) => {
    if (!value) return null
    if (/^\d+$/.test(value)) return `${Number(value) * 0.25}rem`
    return value
  }
  const applyPadding = (attributes: Record<string, string>, style: Record<string, string>) => {
    const px = paddingValue(attributes.padding)
    const pt = paddingValue(attributes.pt)
    const pb = paddingValue(attributes.pb)
    if (px) style['--pp-x'] = px
    if (pt) style['--pp-t'] = pt
    if (pb) style['--pp-b'] = pb
    return Boolean(px || pt || pb)
  }
  return (tree: Node) => {
    visit(tree, 'containerDirective', (node: DirectiveNode) => {
      const { name, attributes } = node
      let className = 'my-6'
      const style: Record<string, string> = {}
      let rowH: string | undefined

      if (name === 'wrapper') {
        className = 'project-content-wrapper my-6'
      } else if (name === 'gallery') {
        const cols = Math.min(parseInt(attributes.cols || '2', 10) || 2, 6)
        const hasPad = applyPadding(attributes, style)
        if (attributes.align) style.textAlign = attributes.align
        style['--g-span'] = String(Math.max(1, Math.floor(12 / cols)))
        if (attributes.height) rowH = attributes.height
        className = `gallery-grid gallery-12 my-6 w-full${hasPad ? ' pc-pad' : ''}`
      } else if (name === 'two-columns') {
        if (applyPadding(attributes, style)) className += ' pc-pad'
        if (attributes.align) style.textAlign = attributes.align
        className += ' grid gap-6 md:grid-cols-2'
      } else if (name === 'one-columns') {
        if (applyPadding(attributes, style)) className += ' pc-pad'
        if (attributes.align) style.textAlign = attributes.align
      } else if (name === 'aside') {
        const position = attributes.position === 'right' ? 'md:ml-auto' : 'md:mr-auto'
        className += ` max-w-md rounded-2xl bg-bg-card p-6 ${position}`
      }

      const data = ((node as unknown as { data?: Record<string, unknown> }).data ??= {})
      data.hName = 'div'
      data.hProperties = {
        className,
        ...(rowH ? { 'data-row-h': rowH } : {}),
        style: Object.entries(style)
          .map(([property, value]) => `${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${value}`)
          .join('; '),
      }
    })
  }
}

/**
 * Renders markdown content with styled components.
 *
 * Supported markdown:
 * - # Heading 1, ## Heading 2, ### Heading 3
 * - Regular paragraphs — text blocks sit on the 12-col grid, centered 8-span by default (md+)
 * - **bold**, *italic*
 * - ![alt](image-url) — renders as full-width image
 * - ![N](url) / ![N@start](url) / ![N|caption](url) — image taking N of 12 grid columns, optionally starting at column line N (inside galleries); ![N@center] centers it; ![N/M] uses span M on mobile (default: full width)
 * - Multiple images in a row — auto gallery grid (12-col, equal spans by default)
 * - - bullet lists
 * - > blockquotes
 * - `inline code` and code blocks
 * - --- invisible spacer (15 spacing units = 60px, halves on mobile); --- (N) on its own line — custom size in spacing units; --- (N/M) sets the mobile size; --- (Npx) literal value, no scaling
 * - :::gallery{cols=3 height=4 padding=4 pt=4 pb=8 align="center"}...::: — 12-col image grid; cols sets the default span (12/cols), ![N] overrides per image; height sets fixed row height in column units (default: height of the widest item per row); optional padding/alignment
 * - :::two-columns{padding=4 pt=4 pb=8 align="justify"}...::: — two-column layout with optional side/top/bottom padding and text alignment
 * - :::one-columns{padding=4 pt=4 pb=8 align="center"}...::: — single text column with optional side/top/bottom padding and alignment
 * - :::aside{position="right"}...::: — highlighted aside block
 */
function ProjectContent({ markdown }: ProjectContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Equalize media heights inside gallery grids: run once rendered, again
  // when media finishes loading, and on container resize.
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const grids = Array.from(root.querySelectorAll<HTMLElement>('.gallery-12'))
    if (!grids.length) return
    const run = () => grids.forEach(equalizeGrid)
    run()
    const observer = new ResizeObserver(run)
    grids.forEach((grid) => observer.observe(grid))
    root
      .querySelectorAll<HTMLImageElement>('.gallery-12 img')
      .forEach((img) => {
        if (!img.complete) img.addEventListener('load', run, { once: true })
      })
    root
      .querySelectorAll<HTMLVideoElement>('.gallery-12 video')
      .forEach((video) => {
        if (video.readyState < 1) {
          video.addEventListener('loadedmetadata', run, { once: true })
        }
      })
    return () => observer.disconnect()
  }, [markdown])

  return (
    <div
      ref={containerRef}
      className="project-content gallery-12 grid"
      style={{ '--g-span': '12' } as CSSProperties}
    >
      <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkTypography, remarkDirectiveLayout]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 mt-8 text-2xl font-normal text-fg first:mt-0 md:text-3xl">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 mt-6 text-lg font-normal text-fg first:mt-0 md:text-2xl">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 text-base font-normal text-fg first:mt-0 md:text-lg">
            {children}
          </h3>
        ),
        p: ({ children, node }) => {
          // `--- (N)` / `--- N` / `--- Npx` on its own line parses as a plain
          // paragraph — render it as a custom-height spacer (same <hr> semantics
          // as `---`, so the margin-folding CSS applies). N defaults to px.
          const parts = node?.children ?? []
          const rawText = parts
            .map((c) => (c.type === 'text' ? c.value : ''))
            .join('')
          const spacer =
            !parts.some((c) => c.type === 'element') &&
            rawText.match(
              /^\s*-{3,}\s*(?:\(?\s*(\d+(?:\.\d+)?)\s*([a-z%]*)\s*(?:\/\s*(\d+(?:\.\d+)?)\s*)?\)?\s*)?$/,
            )
          if (spacer) {
            const [, size, unit, mobile] = spacer
            // Unitless N counts spacing-scale units (×0.25rem, halves on
            // mobile; N/M sets mobile explicitly). With a unit → literal.
            const style: CSSProperties = unit
              ? { height: `${size}${unit}` }
              : ({
                  '--sp': size ?? '15',
                  ...(mobile ? { '--sp-m': mobile } : {}),
                } as CSSProperties)
            return <hr className="border-0" style={style} />
          }
          // Check if paragraph contains only images — render as gallery
          const images = node?.children?.filter(
            (child) => child.type === 'element' && child.tagName === 'img',
          )
          if (images && images.length > 1) {
            const span = Math.max(1, Math.floor(12 / images.length))
            return (
              <div
                className="gallery-grid gallery-12 my-6 w-full"
                style={{ '--g-span': span } as CSSProperties}
              >
                {children}
              </div>
            )
          }
          // Single image in paragraph — wrap with spacing; inside a grid it
          // takes its own column span (from ![N] or --g-span)
          if (images && images.length === 1) {
            const alt = (images[0] as { properties?: { alt?: string } })
              .properties?.alt
            const { span, start, mobile } = parseImageAlt(alt)
            return (
              <div
                className="my-6 overflow-hidden rounded-2xl"
                style={{
                  gridColumn: gridColumnFor(span, start),
                  ...(mobile ? { '--gc-m': `span ${mobile}` } : {}),
                } as CSSProperties}
              >
                {children}
              </div>
            )
          }
          return (
            <p className="my-3 text-sm leading-relaxed text-fg-secondary md:text-base">
              {children}
            </p>
          )
        },
        img: ({ src, alt }) => {
          const { span, start, mobile, caption } = parseImageAlt(alt)
          return (
            <div
              className="m-0"
              data-media
              style={{
                gridColumn: gridColumnFor(span, start),
                ...(mobile ? { '--gc-m': `span ${mobile}` } : {}),
              } as CSSProperties}
            >
              <img
                src={src}
                alt={caption || ''}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-2xl"
              />
              {caption ? (
                <span className="mt-2 block text-center text-xs text-fg-muted md:text-sm">
                  {caption}
                </span>
              ) : null}
            </div>
          )
        },
        video: ({ children, className, controls, style, ...props }) => (
          <video
            {...props}
            autoPlay
            muted
            loop
            playsInline
            controls={controls ?? false}
            className={cn('my-6 w-full rounded-2xl', className)}
            data-media
            style={{ gridColumn: 'span var(--g-span, 1)', ...style }}
          >
            {children}
          </video>
        ),
        ul: ({ children }) => (
          <ul className="my-4 list-inside list-disc space-y-1 text-sm text-fg-secondary md:text-base">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="my-4 list-inside list-decimal space-y-1 text-sm text-fg-secondary md:text-base">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li>{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-[length:var(--border-width-accent)] border-[var(--color-border)] pl-4 italic text-fg-muted">
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-')
          if (isBlock) {
            return (
              <pre className="my-4 overflow-x-auto rounded-lg bg-bg-elevated p-4">
                <code className="text-xs text-fg-secondary md:text-sm">{children}</code>
              </pre>
            )
          }
          return (
            <code className="rounded bg-bg-card px-1.5 py-0.5 text-xs text-fg-secondary md:text-sm">
              {children}
            </code>
          )
        },
        hr: () => (
          <hr className="border-0" style={{ '--sp': 15 } as CSSProperties} />
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-fg">{children}</strong>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline hover:text-accent-hover"
          >
            {children}
          </a>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
    </div>
  )
}

export default ProjectContent
