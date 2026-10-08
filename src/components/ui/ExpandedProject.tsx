import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import ProjectContent from './ProjectContent'

type ExpandedProjectProps = {
  id?: string
  projectId?: string
  title: string
  image: string
  contentFile?: string
  borderColor?: string
  bgColor?: string
  onClose: () => void
}

function ExpandedProject({
  id,
  projectId,
  title,
  image,
  contentFile,
  borderColor,
  bgColor,
  onClose,
}: ExpandedProjectProps) {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentFile) return
    fetch(contentFile)
      .then((res) => (res.ok ? res.text() : ''))
      .then(setMarkdown)
      .catch(() => setMarkdown(null))
  }, [contentFile])

  // Close when clicking outside the expanded card.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-preview-bar]')
      ) {
        onCloseRef.current()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const style: React.CSSProperties = {
    ...(borderColor ? { borderColor } : {}),
    ...(bgColor ? { backgroundColor: bgColor } : {}),
  }

  return (
    <motion.div
      ref={containerRef}
      id={id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="overflow-hidden rounded-2xl"
      style={{ ...style, backgroundColor: bgColor || 'var(--color-bg-card)', minHeight: 'calc(100vh - 64px)' }}
    >
      {/* Cover image */}
      <div className="relative w-full overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={title}
          className="h-auto w-full"
        />
        {/* Close button */}
        <div className="absolute right-2 top-2 flex items-center gap-2">
          {projectId ? (
            <a
              href={`/projects/${projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 items-center gap-1.5 rounded-full bg-black/30 px-3 text-xs text-[var(--color-static-white)] backdrop-blur-sm transition-colors hover:bg-black/50"
            >
              <ExternalLink size={14} />
              Открыть отдельно
            </a>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
            aria-label="Закрыть"
          >
            <X size={18} className="text-[var(--color-static-white)]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="py-6 md:py-10">
        {markdown ? (
          <ProjectContent markdown={markdown.replace(/!\[.*?\]\([^)]*\)/, (match) => {
            const src = match.match(/\(([^)]+)\)/)?.[1] || ''
            return src === image ? '' : match
          })} />
        ) : !contentFile ? (
          <>
            <h1 className="text-2xl font-bold text-fg md:text-3xl">{title}</h1>
            <p className="mt-4 text-fg-muted">Контент ещё не добавлен</p>
          </>
        ) : (
          <p className="mt-4 text-fg-muted">Загрузка...</p>
        )}
      </div>
    </motion.div>
  )
}

export default ExpandedProject
