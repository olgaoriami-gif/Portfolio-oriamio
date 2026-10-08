import type { Category } from '@/components/ui/CategorySwitcher'
export type PortfolioItem =
  | {
      type: 'project'
      id: string
      title: string
      image: string
      size: 'sm' | 'md' | 'lg'
      category: Category
      href?: string
      borderColor?: string
      bgColor?: string
      /** Path to markdown file in /public/projects/, e.g. "/projects/3d-1.md" */
      contentFile?: string
    }
  | {
      type: 'text'
      id: string
      title?: string
      text: string
      category: Category
      borderColor?: string
      bgColor?: string
    }

export const portfolioItems: PortfolioItem[] = [
  // ── 3D ──────────────────────────────────────────────
  {
    type: 'project',
    id: '3d-1',
    title: 'Abstract Shapes',
    image: '/projects/3d-1/img-cover-1.png',
    size: 'md',
    category: '3d',
    contentFile: '/projects/3d-1/content.md',
  },
  {
    type: 'text',
    id: '3d-text-1',
    title: 'About 3D Work',
    text: 'Работая с 3D я получаю удовольствие от возможности прикоснуться к каждой детали, я знаю объект в полной мере.',
    category: '3d',
    bgColor: 'var(--color-background)',
    borderColor: 'var(--color-border)',
  },
  {
    type: 'project',
    id: '3d-2',
    title: 'Neon Environment',
    image: '/projects/3d-2/img-cover-2.png',
    size: 'sm',
    category: '3d',
    contentFile: '/projects/3d-2/content.md',
  },
  {
    type: 'project',
    id: '3d-3',
    title: 'Success or not success?',
    image:  '/projects/3d-3/img-cover-3.png',
    size: 'lg',
    category: '3d',
    contentFile: '/projects/3d-3/content.md',
  },
  {
    type: 'project',
    id: '3d-4',
    title: 'Обложки полисов страхования',
    image: '/projects/3d-4/img-cover-4.png',
    size: 'lg',
    category: '3d',
    contentFile: '/projects/3d-4/content.md',
  },
  {
    type: 'project',
    id: '3d-5',
    title: 'Dark Story Type',
    image: '/projects/3d-5/img-cover-5.png',
    size: 'sm',
    category: '3d',
    contentFile: '/projects/3d-5/content.md',
  },
  {
    type: 'project',
    id: '3d-6',
    title: 'Офисы на карте',
    image: '/projects/3d-6/img-cover-6.png',
    size: 'md',
    category: '3d',
    contentFile: '/projects/3d-6/content.md',
  },

  // ── Design System ───────────────────────────────────
  {
    type: 'project',
    id: 'ds-1',
    title: 'Component Library',
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=600&q=80',
    size: 'sm',
    category: 'design-system',
    contentFile: '/projects/ds-1/content.md',
  },
  {
    type: 'text',
    id: 'ds-text-1',
    title: 'Design Tokens',
    text: 'Scalable token architecture: color, typography, spacing, elevation — all synced between Figma and code.',
    category: 'design-system',
    bgColor: '(--color-background)',
    borderColor: 'var(--color-border)',
  },
  {
    type: 'project',
    id: 'ds-2',
    title: 'UI Kit',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4eef1d2fa?auto=format&fit=crop&w=600&q=80',
    size: 'lg',
    category: 'design-system',
    contentFile: '/projects/ds-2/content.md',
  },
  {
    type: 'project',
    id: 'ds-3',
    title: 'Style Guide',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    size: 'md',
    category: 'design-system',
    contentFile: '/projects/ds-3/content.md',
  },
  {
    type: 'project',
    id: 'ds-4',
    title: 'Iconography',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=600&q=80',
    size: 'sm',
    category: 'design-system',
    contentFile: '/projects/ds-4/content.md',
  },
  {
    type: 'text',
    id: 'ds-text-2',
    text: 'Documentation-first approach: every component ships with usage guidelines, accessibility notes, and live examples.',
    category: 'design-system',
    bgColor: 'var(--color-background)',
    borderColor: 'var(--color-border)',
  },
  {
    type: 'project',
    id: 'ds-5',
    title: 'Theme Builder',
    image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=600&q=80',
    size: 'md',
    category: 'design-system',
    contentFile: '/projects/ds-5/content.md',
  },
]
