import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { type Category } from '@/components/ui/CategorySwitcher'
import ProjectCard from '@/components/ui/ProjectCard'
import ExpandedProject from '@/components/ui/ExpandedProject'
import { portfolioItems, type PortfolioItem } from '@/lib/portfolioData'
import {
  fetchProjectContent,
  projectContentFile,
  type ParsedProject,
} from '@/lib/projectContent'

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
      : '3d'

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
          (active === 'all' ||
            (mdContent[item.id]?.meta.category ?? item.category) === active),
      ),
    [active, mdContent],
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
          className="grid grid-cols-1 gap-10 md:grid-cols-2"
        >
          {projects.map((project, index) => {
            const parsed = mdContent[project.id]
            const meta = parsed?.meta
            const title = meta?.title ?? project.title ?? project.id
            const image = meta?.cover ?? project.image ?? ''
            const year = meta?.year ?? project.year?.toString()
            const isDynamic = Boolean(parsed)
            const isExpanded = isDynamic && activeProject?.id === project.id
            const isFeature = index % 3 === 0
            const layoutClassName = isExpanded || isFeature ? 'md:col-span-2' : undefined

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
                    className={`${layoutClassName ?? ''} ${
                      isDynamic
                        ? 'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-4 focus-visible:ring-offset-bg'
                        : ''
                    }`}
                  >
                    <ProjectCard
                      title={title}
                      image={image}
                      year={year}
                      borderColor={project.borderColor}
                      bgColor={project.bgColor}
                      fullScreen
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
