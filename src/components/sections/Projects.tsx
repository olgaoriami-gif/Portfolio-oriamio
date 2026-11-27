import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { type Category } from '@/components/ui/CategorySwitcher'
import ProjectCard from '@/components/ui/ProjectCard'
import ExpandedProject from '@/components/ui/ExpandedProject'
import { portfolioItems, type PortfolioItem } from '@/lib/portfolioData'
import { isDraft } from '@/lib/drafts'
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

function scrollToExpandedProject(id: string) {
  const project = document.getElementById(`expanded-${id}`)
  const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0

  if (project) {
    window.scrollTo({
      top: project.getBoundingClientRect().top + window.scrollY - headerHeight - 16,
      behavior: 'smooth',
    })
  }
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

  const projects = useMemo(
    () =>
      portfolioItems.filter(
        (item): item is Extract<PortfolioItem, { type: 'project' }> =>
          item.type === 'project' &&
          (showDrafts || !isDraft(item.id)) &&
          (active === 'all' ||
            (mdContent[item.id]?.meta.category ?? item.category) === active),
      ),
    [active, mdContent, showDrafts],
  )

  const activeProject = useMemo(
    () => projects.find((project) => project.id === expandedId) ?? null,
    [expandedId, projects],
  )


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
            const span = meta?.span ?? 6
            const isDynamic = Boolean(parsed)
            const isExpanded = isDynamic && activeProject?.id === project.id
            const layoutClassName = isExpanded
              ? 'md:col-span-12'
              : spanClasses[span]

            return (
              <AnimatePresence key={project.id} mode="wait" initial={false}>
                {isExpanded ? (
                  <motion.div
                    key={`${project.id}-expanded`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35 }}
                    onAnimationComplete={() => {
                      if (expandedId === project.id) scrollToExpandedProject(project.id)
                    }}
                    className={layoutClassName}
                  >
                    <ExpandedProject
                      id={`expanded-${project.id}`}
                      projectId={project.id}
                      title={title}
                      image={image}
                      contentFile={projectContentFile(project)}
                      borderColor={project.borderColor}
                      bgColor={project.bgColor}
                      onClose={() => setExpandedId(null)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={project.id}
                    id={`card-${project.id}`}
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    onClick={isDynamic ? () => setExpandedId(project.id) : undefined}
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
                    className={`${layoutClassName ?? ''} relative ${
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
                )}
              </AnimatePresence>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
