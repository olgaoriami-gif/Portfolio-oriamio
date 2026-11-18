import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/useTheme'
import { openAbout, useAboutState } from '@/lib/aboutStore'
import CategorySwitcher, { type Category } from '@/components/ui/CategorySwitcher'

function Header() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const raw = searchParams.get('category')
  const active: Category =
    raw === 'all' || raw === '3d' || raw === '2d' || raw === 'design-system'
      ? raw
      : '3d'

  const isHome = location.pathname === '/'
  const navigate = useNavigate()
  const { seen } = useAboutState()

  const menuItemClass = 'text-left text-sm text-fg-secondary hover:text-fg'

  const goProjects = () => {
    setOpen(false)
    const scroll = () =>
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    if (isHome) {
      scroll()
    } else {
      navigate('/')
      setTimeout(scroll, 100)
    }
  }

  const goAbout = () => {
    openAbout()
    setOpen(false)
  }

  const handleCategoryChange = (cat: Category) => {
    setSearchParams({ category: cat })
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b-[length:var(--border-width-none)] border-[var(--color-border)] bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-20 w-full items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-bold tracking-tight text-fg md:text-xl">
            <span>ORIAMIO</span>
          </Link>
          {seen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="group relative"
            >
              <button
                type="button"
                onClick={openAbout}
                aria-label="Обо мне — написать мне"
                className="block h-11 w-11 overflow-hidden rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 md:h-12 md:w-12"
              >
                <img
                  src="/about/foto-avatar.png"
                  alt="Оля Баранова"
                  className="h-full w-full object-cover"
                />
              </button>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-full mt-2 translate-y-1 whitespace-nowrap rounded-full border-[length:var(--border-width)] border-[var(--color-border)] bg-bg-elevated px-3 py-1.5 text-xs font-medium text-fg opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
              >
                Напиши мне!
              </span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-4">
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
            <Link to="/" className={menuItemClass} onClick={() => setOpen(false)}>
              Главная
            </Link>
            <button type="button" className={menuItemClass} onClick={goProjects}>
              Проекты
            </button>
            <button type="button" className={menuItemClass} onClick={goAbout}>
              Обо мне
            </button>
            <button type="button" className={menuItemClass} onClick={goAbout}>
              Контакты
            </button>
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
