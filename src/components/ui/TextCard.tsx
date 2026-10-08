import { cn } from '@/lib/utils'
import { typograph } from '@/lib/typograph'

export type TextCardProps = {
  title?: string
  text: string
  /** Custom border color via inline style */
  borderColor?: string
  /** Custom background color via inline style */
  bgColor?: string
  /** Additional className */
  className?: string
}

function TextCard({
  title,
  text,
  borderColor,
  bgColor,
  className,
}: TextCardProps) {
  const cardStyle: React.CSSProperties = {
    ...(borderColor ? { borderColor } : {}),
    ...(bgColor ? { backgroundColor: bgColor } : {}),
  }

  return (
    <div
      className={cn(
        'flex flex-col justify-center rounded-3xl border-[length:var(--border-width)] border-[var(--color-border)] p-6',
        !bgColor && 'bg-bg-elevated',
        className,
      )}
      style={cardStyle}
    >
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">{typograph(title)}</h3>
      )}
      <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{typograph(text)}</p>
    </div>
  )
}

export default TextCard
