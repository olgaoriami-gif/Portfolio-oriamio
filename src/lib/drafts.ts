import draftIds from 'virtual:portfolio-drafts'

/**
 * Ids of projects marked with `draft: true` in their content.md frontmatter.
 * Drafts are hidden from the UI (unless ?drafts=1 is set) and are excluded
 * from the build output entirely.
 */
export const drafts: ReadonlySet<string> = new Set(draftIds)

export function isDraft(id: string): boolean {
  return drafts.has(id)
}
