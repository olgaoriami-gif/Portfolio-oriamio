import { useEffect, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Mail, Send, X } from 'lucide-react'
import { typograph } from '@/lib/typograph'
import { closeAbout, useAboutState } from '@/lib/aboutStore'

const aboutContent = {
  heading: 'Оля Баранова',
  description:
    'Я работаю с графикой и дизайн-системами. Любовь к глубине и деталям — именно из этого рождаются мои работы. Для меня важны выразительность, система и баланс между формой и функцией',
  avatar: '/about/foto-avatar.png',
}

// TODO: подставь реальные контакты
const contacts = [
  { label: 'Email', value: 'hello@oriamio.work', href: 'mailto:hello@oriamio.work', icon: Mail },
  { label: 'Telegram', value: '@oriamio', href: 'https://t.me/oriamio', icon: Send },
]

function AboutModal() {
  const { open } = useAboutState()

  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 180, damping: 20, mass: 0.7 })
  const rotateY = useSpring(tiltY, { stiffness: 180, damping: 20, mass: 0.7 })

  const handleAvatarMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    tiltX.set(y * -16)
    tiltY.set(x * 16)
  }

  const resetAvatarTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAbout()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeAbout}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Обо мне"
            className="absolute inset-4 flex flex-col overflow-hidden rounded-[24px] border-[2px] border-[var(--color-border)] bg-bg"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeAbout}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
              aria-label="Закрыть"
            >
              <X size={20} className="text-[var(--color-static-white)]" />
            </button>

            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center gap-8 px-6 py-12 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full max-w-[180px] [perspective:900px]"
                  onMouseMove={handleAvatarMove}
                  onMouseLeave={resetAvatarTilt}
                >
                  <motion.div
                    style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.25 }}
                  >
                    <img
                      src={aboutContent.avatar}
                      alt="Портрет Оли Барановой"
                      className="w-full object-contain [transform:translateZ(24px)]"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="grid justify-items-center"
                >
                  <h1 className="max-w-2xl text-pretty font-[family-name:var(--font-heading)] text-xl font-medium leading-tight tracking-tight text-fg sm:text-2xl md:text-3xl">
                    {typograph(aboutContent.heading)}
                  </h1>
                  <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-fg-secondary sm:text-base md:text-lg">
                    {typograph(aboutContent.description)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex flex-wrap items-center justify-center gap-3"
                >
                  {contacts.map(({ label, value, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border-[2px] border-[var(--color-border)] px-4 py-2 text-sm font-medium text-fg-secondary transition-colors hover:border-[var(--color-border-hover)] hover:text-fg"
                    >
                      <Icon size={16} />
                      {value}
                    </a>
                  ))}
                </motion.div>

                <motion.button
                  type="button"
                  onClick={closeAbout}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group mt-2 inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  Перейти к просмотру
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AboutModal
