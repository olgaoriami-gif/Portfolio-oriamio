import orderEntries from 'virtual:portfolio-order'
import { normalizeSize } from '@/lib/projectContent'

/**
 * Display order and card sizes on the homepage, read from
 * `public/projects.order` — one "<id> [span]" per line, `#` comments.
 * Line order = card order; span (1–12) overrides frontmatter `size:`.
 * Projects not listed go to the end, keeping portfolioData order.
 */
const rank = new Map(orderEntries.map((entry, index) => [entry.id, index]))
const spans = new Map(
  orderEntries
    .filter((entry) => entry.size)
    .map((entry) => [entry.id, normalizeSize(entry.size!)] as const)
    .filter((pair): pair is readonly [string, number] => pair[1] !== undefined),
)

/** Position of a project in projects.order; unlisted ids sort last */
export function projectRank(id: string): number {
  return rank.get(id) ?? Number.MAX_SAFE_INTEGER
}

/** Card span (1–12) from projects.order, or undefined to use frontmatter */
export function projectSpan(id: string): number | undefined {
  return spans.get(id)
}
