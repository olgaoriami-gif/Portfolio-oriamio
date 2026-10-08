import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/useTheme'
import CategorySwitcher, { type Category } from '@/components/ui/CategorySwitcher'

const navLinks = [
  { label: 'Главная', to: '/' },
  { label: 'Проекты', to: '#projects' },
  { label: 'Обо мне', to: '#about' },
  { label: 'Контакты', to: '#contact' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const raw = searchParams.get('category')
  const active: Category =
    raw === '3d' || raw === 'design-system' || raw === 'story-point'
      ? (raw as Category)
      : '3d'

  const isHome = location.pathname === '/'

  const handleCategoryChange = (cat: Category) => {
    setSearchParams({ category: cat })
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b-[length:var(--border-width-none)] border-[var(--color-border)] bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-20 w-full items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-fg">
          <span>ORIAMIO ✕</span>{' '}
          <span className="font-[family-name:var(--font-heading)] font-[800] text-fg">Work</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="text-sm text-fg-secondary transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {isHome && (
            <div className="hidden md:flex">
              <CategorySwitcher active={active} onChange={handleCategoryChange} />
            </div>
          )}

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg border-[length:var(--border-width)] border-[var(--color-border)] text-fg-secondary transition-colors hover:border-[var(--color-border-hover)] hover:text-fg"
            aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {/* Mobile menu button */}
          <button
            type="button"
            className="rounded-md p-2 text-fg-secondary transition-colors hover:bg-bg-elevated hover:text-fg md:hidden"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t-[length:var(--border-width)] border-[var(--color-border)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="text-sm text-fg-secondary hover:text-fg"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          {isHome && (
            <div className="mt-4 flex justify-center">
              <CategorySwitcher active={active} onChange={handleCategoryChange} />
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
