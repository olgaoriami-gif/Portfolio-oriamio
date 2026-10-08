import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'

import ProjectContent from '@/components/ui/ProjectContent'
import { portfolioItems } from '@/lib/portfolioData'

type ProjectNavigationProps = {
  category: string
}

function ProjectNavigation({ category }: ProjectNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm text-fg-muted">
      <Link to="/" className="transition-colors hover:text-fg">
        ← Все проекты
      </Link>
      <span>{category}</span>
    </div>
  )
}

function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = portfolioItems.find(
    (item) => item.type === 'project' && item.id === projectId,
  )
  const [markdown, setMarkdown] = useState<string | null>(null)

  useEffect(() => {
    if (!project || project.type !== 'project' || !project.contentFile) return

    fetch(project.contentFile, { cache: 'no-store' })
      .then((response) => (response.ok ? response.text() : ''))
      .then(setMarkdown)
      .catch(() => setMarkdown(null))
  }, [project])

  if (!project || project.type !== 'project') return <Navigate to="/" replace />

  const content = markdown?.replace(/!\[.*?\]\([^)]*\)/, (match) => {
    const src = match.match(/\(([^)]+)\)/)?.[1] || ''
    return src === project.image ? '' : match
  })

  return (
    <>
      <Helmet>
        <title>{project.title} — Портфолио</title>
        <meta name="description" content={`Проект ${project.title}`} />
      </Helmet>

      <article className="mx-auto w-full px-6 py-8 md:py-12">
        <div className="mb-6">
          <ProjectNavigation category={project.category} />
        </div>

        <div
          className="overflow-hidden rounded-2xl"
          style={{ backgroundColor: project.bgColor || 'var(--color-bg-card)' }}
        >
          <img src={project.image} alt={project.title} className="h-auto w-full" />
          <div className="py-6 md:py-10">
            {content ? (
              <ProjectContent markdown={content} />
            ) : (
              <p className="px-6 text-fg-muted md:px-10">Загрузка...</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <ProjectNavigation category={project.category} />
        </div>
      </article>
    </>
  )
}

export default ProjectPage
