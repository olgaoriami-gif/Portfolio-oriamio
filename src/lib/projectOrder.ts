import orderIds from 'virtual:portfolio-order'

/**
 * Display order of projects on the homepage, read from
 * `public/projects.order` — one project id per line, `#` comments allowed.
 * Projects not listed there go to the end, keeping portfolioData order.
 */
const rank = new Map(orderIds.map((id, index) => [id, index]))

/** Position of a project in projects.order; unlisted ids sort last */
export function projectRank(id: string): number {
  return rank.get(id) ?? Number.MAX_SAFE_INTEGER
}
