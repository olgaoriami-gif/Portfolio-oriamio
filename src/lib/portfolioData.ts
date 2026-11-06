import type { Category } from '@/components/ui/CategorySwitcher'

export type PortfolioItem = {
  type: 'project'
  id: string
  /** Fallback title — content.md frontmatter/H1 wins when present */
  title?: string
  /** Fallback cover — content.md frontmatter/first image wins when present */
  image?: string
  /** Fallback year — content.md frontmatter wins when present */
  year?: string | number
  /** Fallback filter category — content.md frontmatter "category:" wins when present */
  category?: Category
  borderColor?: string
  bgColor?: string
  /** Path to markdown file. Defaults to "/projects/<id>/content.md" */
  contentFile?: string
}

export const portfolioItems: PortfolioItem[] = [
  // ── 3D ──────────────────────────────────────────────
  { type: 'project', id: '3d-1', category: '3d' },
  { type: 'project', id: '3d-2', category: '3d' },
  { type: 'project', id: '3d-3', category: '3d' },
  { type: 'project', id: '3d-4', category: '3d' },
  { type: 'project', id: '3d-5', category: '3d' },
  { type: 'project', id: '3d-6', category: '3d' },

  // ── 2D ──────────────────────────────────────────────
  { type: 'project', id: '2d-1', category: '2d' },
  { type: 'project', id: '2d-2', category: '2d' },
  { type: 'project', id: '2d-3', category: '2d' },

  // ── Design System ───────────────────────────────────
  { type: 'project', id: 'ds-1', category: 'design-system' },
  { type: 'project', id: 'ds-2', category: 'design-system' },
  { type: 'project', id: 'ds-3', category: 'design-system' },
  { type: 'project', id: 'ds-4', category: 'design-system' },
  { type: 'project', id: 'ds-5', category: 'design-system' },
]
