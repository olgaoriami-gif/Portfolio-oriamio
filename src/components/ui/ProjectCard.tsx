import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { typograph } from '@/lib/typograph'

export type ProjectCardProps = {
  title: string
  image: string
  /** Custom border color, e.g. 'border-red-500' or any CSS color via style */
  borderColor?: string
  /** Custom background color */
  bgColor?: string
  /** Render as a large viewport-height feature card */
  fullScreen?: boolean
  /** Whether the card opens project content */
  interactive?: boolean
  /** Whether the card has a content page and gets the stack hover effect */
  hasContent?: boolean
  /** Additional className */
  className?: string
}

function ProjectCard({
  title,
  image,
  borderColor,
  bgColor,
  fullScreen = false,
  interactive = false,
  hasContent = false,
  className,
}: ProjectCardProps) {
  const seed = [...title].reduce((sum, character) => sum + character.charCodeAt(0), 0)
  const direction = seed % 2 === 0 ? 1 : -1
  const stackLayers = [
    { rotate: direction * (1 + (seed % 15) / 10), x: direction * (8 + (seed % 7)), y: 8 },
    { rotate: direction * -(1 + (seed % 12) / 10), x: direction * -(12 + (seed % 6)), y: 6 },
  ]

  const cardStyle: React.CSSProperties = {
    ...(borderColor ? { borderColor } : {}),
    ...(bgColor ? { backgroundColor: bgColor } : {}),
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={cn('group', className)}
    >
      <div className="relative">
        {hasContent &&
          stackLayers.map((layer, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[24px] border-[2px] border-[var(--color-border)] bg-bg-card opacity-0 shadow-none transition-all duration-300 ease-out group-hover:opacity-100"
              style={{
                transform: `translate(${layer.x}px, ${layer.y}px) rotate(${layer.rotate}deg)`,
              }}
            />
          ))}
        <div
          className={cn(
            'relative overflow-hidden rounded-[24px] bg-bg-card',
            fullScreen && 'h-[70vh] min-h-0 aspect-auto min-[1921px]:h-[60vh]',
          )}
          style={cardStyle}
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className={cn(
              'h-full w-full object-cover transition-transform duration-700 group-hover:scale-105',
              fullScreen && 'absolute inset-0',
            )}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-[6px] p-4 md:p-8 lg:p-8">
            <h2 className="max-w-full rounded-full border-[2px] border-white/70 bg-bg/50 px-5 py-2.5 font-[family-name:var(--font-heading)] text-lg font-medium leading-tight text-white [text-shadow:0_0.5px_1px_rgba(0,0,0,0.45)] backdrop-blur-md md:text-lg lg:text-lg">
              {typograph(title)}
            </h2>
            {interactive && (
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 translate-y-2 items-center justify-center rounded-full border-2 border-white/70 bg-bg/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <ArrowDown
                  size={20}
                  strokeWidth={2}
                  className="group-hover:animate-bounce"
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
