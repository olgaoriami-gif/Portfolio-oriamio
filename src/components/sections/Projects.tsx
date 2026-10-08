import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { type Category } from '@/components/ui/CategorySwitcher'
import ProjectCard from '@/components/ui/ProjectCard'
import ExpandedProject from '@/components/ui/ExpandedProject'
import { portfolioItems, type PortfolioItem } from '@/lib/portfolioData'

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
    raw === '3d' || raw === 'design-system' || raw === 'story-point'
      ? (raw as Category)
      : '3d'

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [mdTitles, setMdTitles] = useState<Record<string, string>>({})

  useEffect(() => {
    const projects = portfolioItems.filter(
      (item): item is Extract<PortfolioItem, { type: 'project' }> =>
        item.type === 'project' && !!item.contentFile,
    )

    projects.forEach((project) => {
      fetch(project.contentFile!)
        .then((res) => (res.ok ? res.text() : ''))
        .then((text) => {
          const match = text.match(/^#\s+(.+)$/m)
          if (match) {
            setMdTitles((previous) => ({ ...previous, [project.id]: match[1] }))
          }
        })
        .catch(() => {})
    })
  }, [])

  useEffect(() => {
    setExpandedId(null)
  }, [active])

  const projects = useMemo(
    () =>
      portfolioItems.filter(
        (item): item is Extract<PortfolioItem, { type: 'project' }> =>
          item.category === active && item.type === 'project',
      ),
    [active],
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
            const title = mdTitles[project.id] || project.title
            const isDynamic = Boolean(project.contentFile)
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
                      image={project.image}
                      contentFile={project.contentFile}
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
                      image={project.image}
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
