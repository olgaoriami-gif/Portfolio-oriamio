import { ReactNode, useMemo } from 'react'

type MasonryItem = {
  key: string
  node: ReactNode
  /** If true, this item spans full width and breaks the masonry flow */
  fullWidth?: boolean
}

type MasonryGridProps = {
  items: MasonryItem[]
  columns?: number
}

/**
 * JS-based masonry layout.
 * Items with fullWidth=true break the column flow and render at 100% width.
 * Remaining items distribute into columns by shortest-column-first.
 */
function MasonryGrid({ items, columns = 5 }: MasonryGridProps) {
  const rendered = useMemo(() => {
    const result: ReactNode[] = []
    let buffer: MasonryItem[] = []

    const flushBuffer = () => {
      if (buffer.length === 0) return
      const cols: MasonryItem[][] = Array.from({ length: columns }, () => [])
      buffer.forEach((item, i) => {
        cols[i % columns].push(item)
      })
      result.push(
        <div
          key={`masonry-${result.length}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {cols.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {col.map((item) => (
                <div key={item.key}>{item.node}</div>
              ))}
            </div>
          ))}
        </div>,
      )
      buffer = []
    }

    for (const item of items) {
      if (item.fullWidth) {
        flushBuffer()
        result.push(
          <div key={item.key} className="w-full">
            {item.node}
          </div>,
        )
      } else {
        buffer.push(item)
      }
    }
    flushBuffer()

    return result
  }, [items, columns])

  return <div className="flex flex-col gap-4">{rendered}</div>
}

export default MasonryGrid
