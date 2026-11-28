import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'

import { type Category } from '@/components/ui/CategorySwitcher'
import ProjectCard from '@/components/ui/ProjectCard'
import ExpandedProject from '@/components/ui/ExpandedProject'
import { portfolioItems, type PortfolioItem } from '@/lib/portfolioData'
import { isDraft } from '@/lib/drafts'
import { projectRank, projectSpan } from '@/lib/projectOrder'
import {
  fetchProjectContent,
  projectContentFile,
  type ParsedProject,
} from '@/lib/projectContent'

const spanClasses: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
}



function Projects() {
  const [searchParams] = useSearchParams()
  const raw = searchParams.get('category')
  const active: Category =
    raw === 'all' || raw === '3d' || raw === '2d' || raw === 'design-system'
      ? raw
      : 'all'
  const showDrafts = searchParams.has('drafts')

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [mdContent, setMdContent] = useState<Record<string, ParsedProject>>({})

  useEffect(() => {
    const projects = portfolioItems.filter(
      (item): item is Extract<PortfolioItem, { type: 'project' }> =>
        item.type === 'project',
    )

    projects.forEach((project) => {
      fetchProjectContent(projectContentFile(project)).then((parsed) => {
        if (parsed) {
          setMdContent((previous) =>
            previous[project.id]
              ? previous
              : { ...previous, [project.id]: parsed },
          )
        }
      })
    })
  }, [])

  useEffect(() => {
    setExpandedId(null)
  }, [active])

  // Locks page scroll and handles Escape while the overlay is open.
  useEffect(() => {
    if (!expandedId) return
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.documentElement.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [expandedId])

  const projects = useMemo(
    () =>
      portfolioItems
        .filter(
          (item): item is Extract<PortfolioItem, { type: 'project' }> =>
            item.type === 'project' &&
            (showDrafts || !isDraft(item.id)) &&
            (active === 'all' ||
              (mdContent[item.id]?.meta.category ?? item.category) === active),
        )
        // projects.order wins; unlisted ids keep portfolioData order at the end
        .sort((a, b) => projectRank(a.id) - projectRank(b.id)),
    [active, mdContent, showDrafts],
  )

  const activeProject = useMemo(
    () => projects.find((project) => project.id === expandedId) ?? null,
    [expandedId, projects],
  )


  const expandedMeta = activeProject ? mdContent[activeProject.id]?.meta : undefined

  return (
    <section id="projects" className="py-8">
      <div className="mx-auto w-full px-6">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-1 gap-10 md:grid-cols-12"
        >
          {projects.map((project, index) => {
            const parsed = mdContent[project.id]
            const meta = parsed?.meta
            const title = meta?.title ?? project.title ?? project.id
            const image = meta?.cover ?? project.image ?? ''
            const year = meta?.year ?? project.year?.toString()
            const span = projectSpan(project.id) ?? meta?.span ?? 6
            const isDynamic = Boolean(parsed)

            return (
              <motion.div
                key={project.id}
                id={`card-${project.id}`}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                onClick={
                  isDynamic ? () => setExpandedId(project.id) : undefined
                }
                onKeyDown={
                  isDynamic
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setExpandedId(project.id)
                        }
                      }
                    : undefined
                }
                role={isDynamic ? 'button' : undefined}
                tabIndex={isDynamic ? 0 : undefined}
                className={`${spanClasses[span]} relative ${
                  isDynamic
                    ? 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-4 focus-visible:ring-offset-bg'
                    : ''
                }`}
              >
                {showDrafts && isDraft(project.id) && (
                  <span className="absolute left-3 top-3 z-10 rounded-md bg-black/60 px-2 py-1 text-xs font-medium uppercase tracking-wide text-white">
                    draft
                  </span>
                )}
                <ProjectCard
                  title={title}
                  image={image}
                  year={year}
                  span={span}
                  borderColor={project.borderColor}
                  bgColor={project.bgColor}
                  interactive={isDynamic}
                  hasContent={isDynamic}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Expanded project — full-screen modal; the grid never reflows */}
      <AnimatePresence>
        {activeProject ? (
          <motion.div
            key="project-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-bg"
          >
            {/* Bleeds past the viewport so page content doesn't show
                through floating browser chrome (URL bar, toolbars) */}
            <div
              aria-hidden="true"
              className="fixed -inset-y-[20vh] inset-x-0 -z-10 bg-bg"
            />
            {/* Pinned controls — stay top-right while scrolling */}
            <div
              data-preview-bar
              className="fixed right-4 top-[calc(1rem+env(safe-area-inset-top))] z-10 flex items-center gap-2"
            >
              <a
                href={`${import.meta.env.BASE_URL}projects/${activeProject.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 items-center gap-1.5 rounded-full bg-black/30 px-3 text-xs text-[var(--color-static-white)] backdrop-blur-sm transition-colors hover:bg-black/50"
              >
                <ExternalLink size={14} />
                Открыть отдельно
              </a>
              <button
                type="button"
                onClick={() => setExpandedId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
                aria-label="Закрыть"
              >
                <X size={18} className="text-[var(--color-static-white)]" />
              </button>
            </div>

            <motion.div
              id={`expanded-${activeProject.id}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto w-full px-6 py-8"
            >
              <div className="mb-6 flex items-center justify-between gap-4 text-sm text-fg-muted">
                <button
                  type="button"
                  onClick={() => setExpandedId(null)}
                  className="transition-colors hover:text-fg"
                >
                  ← Все проекты
                </button>
              </div>
              <ExpandedProject
                title={
                  expandedMeta?.title ?? activeProject.title ?? activeProject.id
                }
                image={expandedMeta?.cover ?? activeProject.image ?? ''}
                contentFile={projectContentFile(activeProject)}
                borderColor={activeProject.borderColor}
                bgColor={activeProject.bgColor}
                onClose={() => setExpandedId(null)}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

export default Projects
