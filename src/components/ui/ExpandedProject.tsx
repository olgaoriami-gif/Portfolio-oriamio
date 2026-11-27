import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ProjectContent from './ProjectContent'
import { useProjectContent } from '@/lib/projectContent'

type ExpandedProjectProps = {
  id?: string
  title: string
  image: string
  contentFile?: string
  borderColor?: string
  bgColor?: string
  onClose: () => void
}

function ExpandedProject({
  id,
  title,
  image,
  contentFile,
  borderColor,
  bgColor,
  onClose,
}: ExpandedProjectProps) {
  const parsed = useProjectContent(contentFile)
  const containerRef = useRef<HTMLDivElement>(null)

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
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-auto w-full"
          />
        ) : (
          <div className="h-16 w-full" />
        )}
      </div>

      {/* Content */}
      <div className="py-6 md:py-10">
        {parsed === undefined ? (
          <p className="mt-4 text-fg-muted">Загрузка...</p>
        ) : parsed?.body ? (
          <ProjectContent markdown={parsed.body.replace(/!\[.*?\]\([^)]*\)/, (match) => {
            const src = match.match(/\(<?([^)>]+?)>?\)/)?.[1] || ''
            return src === image ? '' : match
          })} />
        ) : (
          <>
            <h1 className="text-xl font-bold text-fg md:text-3xl">{title}</h1>
            <p className="mt-4 text-fg-muted">Контент ещё не добавлен</p>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default ExpandedProject
