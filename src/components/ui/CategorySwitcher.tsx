import { motion, LayoutGroup } from 'framer-motion'
import { cn } from '@/lib/utils'

export type Category = 'all' | '3d' | 'design-system' | '2d'

type CategorySwitcherProps = {
  active: Category
  onChange: (category: Category) => void
}

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: '3d', label: '3D' },
  { key: '2d', label: '2D' },
  { key: 'design-system', label: 'Design System' },
]

function CategorySwitcher({ active, onChange }: CategorySwitcherProps) {
  return (
    <LayoutGroup id="category-switcher">
      <div className="flex items-center justify-center gap-0 rounded-full border-[length:var(--border-width-none)] border-[var(--color-border)] bg-bg-elevated/60 p-1 backdrop-blur">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onChange(cat.key)}
            className={cn(
              'relative rounded-full px-3 py-1 text-sm font-medium transition-colors',
              active === cat.key
                ? 'text-fg'
                : 'text-fg-muted hover:text-fg-secondary',
            )}
          >
            {active === cat.key && (
              <motion.span
                layoutId="category-pill"
                layout="position"
                className="absolute inset-0 rounded-full bg-[var(--color-pill)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  )
}

export default CategorySwitcher
