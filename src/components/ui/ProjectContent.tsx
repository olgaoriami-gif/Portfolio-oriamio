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
  return (tree: Node) => {
    visit(tree, 'containerDirective', (node: DirectiveNode) => {
      const { name, attributes } = node
      let className = 'my-6'
      const style: Record<string, string> = {}

      if (name === 'wrapper') {
        className = 'project-content-wrapper my-6'
      } else if (name === 'gallery') {
        const cols = Math.min(parseInt(attributes.cols || '2', 10) || 2, 6)
        const px = paddingValue(attributes.padding)
        const pt = paddingValue(attributes.pt)
        const pb = paddingValue(attributes.pb)
        if (px) {
          style.paddingLeft = px
          style.paddingRight = px
        }
        if (pt) style.paddingTop = pt
        if (pb) style.paddingBottom = pb
        if (attributes.align) style.textAlign = attributes.align
        className = `gallery-grid my-6 w-full gallery-cols-${Math.min(cols, 6)}`
      } else if (name === 'two-columns') {
        const px = paddingValue(attributes.padding)
        const pt = paddingValue(attributes.pt)
        const pb = paddingValue(attributes.pb)
        if (px) {
          style.paddingLeft = px
          style.paddingRight = px
        }
        if (pt) style.paddingTop = pt
        if (pb) style.paddingBottom = pb
        if (attributes.align) style.textAlign = attributes.align
        className += ' grid gap-6 md:grid-cols-2'
      } else if (name === 'one-columns') {
        const px = paddingValue(attributes.padding)
        const pt = paddingValue(attributes.pt)
        const pb = paddingValue(attributes.pb)
        if (px) {
          style.paddingLeft = px
          style.paddingRight = px
        }
        if (pt) style.paddingTop = pt
        if (pb) style.paddingBottom = pb
        if (attributes.align) style.textAlign = attributes.align
      } else if (name === 'aside') {
        const position = attributes.position === 'right' ? 'md:ml-auto' : 'md:mr-auto'
        className += ` max-w-md rounded-2xl bg-bg-card p-6 ${position}`
      }

      const data = ((node as unknown as { data?: Record<string, unknown> }).data ??= {})
      data.hName = 'div'
      data.hProperties = {
        className,
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
 * - Regular paragraphs
 * - **bold**, *italic*
 * - ![alt](image-url) — renders as full-width image
 * - Multiple images in a row — auto gallery grid
 * - - bullet lists
 * - > blockquotes
 * - `inline code` and code blocks
 * - --- horizontal rules (section dividers)
 * - :::gallery{cols=3 padding=4 pt=4 pb=8 align="center"}...::: — custom image gallery with optional side/top/bottom padding and caption alignment
 * - :::two-columns{padding=4 pt=4 pb=8 align="justify"}...::: — two-column layout with optional side/top/bottom padding and text alignment
 * - :::one-columns{padding=4 pt=4 pb=8 align="center"}...::: — single text column with optional side/top/bottom padding and alignment
 * - :::aside{position="right"}...::: — highlighted aside block
 */
function ProjectContent({ markdown }: ProjectContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkTypography, remarkDirectiveLayout]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 mt-8 text-3xl font-bold text-fg first:mt-0 md:text-3xl">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 mt-6 text-xl font-semibold text-fg first:mt-0 md:text-2xl">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 text-lg font-medium text-fg first:mt-0">
            {children}
          </h3>
        ),
        p: ({ children, node }) => {
          // Check if paragraph contains only images — render as gallery
          const images = node?.children?.filter(
            (child) => child.type === 'element' && child.tagName === 'img',
          )
          if (images && images.length > 1) {
            return (
              <div className={`gallery-grid my-6 w-full gallery-cols-${Math.min(images.length, 6)}`}>
                {children}
              </div>
            )
          }
          // Single image in paragraph — wrap with spacing
          if (images && images.length === 1) {
            return (
              <div className="my-6 overflow-hidden rounded-2xl">
                {children}
              </div>
            )
          }
          return (
            <p className="my-3 max-w-[900px] text-base leading-relaxed text-fg-secondary">
              {children}
            </p>
          )
        },
        img: ({ src, alt }) => (
          <div className="m-0">
            <img
              src={src}
              alt={alt || ''}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-2xl"
            />
            {alt ? (
              <span className="mt-2 block text-center text-sm text-fg-muted">
                {alt}
              </span>
            ) : null}
          </div>
        ),
        video: ({ children, className, controls, ...props }) => (
          <video
            {...props}
            autoPlay
            muted
            loop
            playsInline
            controls={controls ?? false}
            className={cn('my-6 w-full rounded-2xl', className)}
          >
            {children}
          </video>
        ),
        ul: ({ children }) => (
          <ul className="my-4 list-inside list-disc space-y-1 text-fg-secondary">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="my-4 list-inside list-decimal space-y-1 text-fg-secondary">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-base text-fg-secondary">{children}</li>
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
                <code className="text-sm text-fg-secondary">{children}</code>
              </pre>
            )
          }
          return (
            <code className="rounded bg-bg-card px-1.5 py-0.5 text-sm text-fg-secondary">
              {children}
            </code>
          )
        },
        hr: () => <hr className="my-8 border-[var(--color-border)]" />,
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
  )
}

export default ProjectContent
