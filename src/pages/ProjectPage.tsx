import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'

import ProjectContent from '@/components/ui/ProjectContent'
import { portfolioItems } from '@/lib/portfolioData'
import { isDraft } from '@/lib/drafts'
import { projectContentFile, useProjectContent } from '@/lib/projectContent'

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
  const [searchParams] = useSearchParams()
  const project = portfolioItems.find(
    (item) => item.type === 'project' && item.id === projectId,
  )
  const parsed = useProjectContent(
    project && project.type === 'project'
      ? projectContentFile(project)
      : undefined,
  )

  if (
    !project ||
    project.type !== 'project' ||
    (isDraft(project.id) && !searchParams.has('drafts'))
  )
    return <Navigate to="/" replace />

  const title = parsed?.meta.title ?? project.title ?? project.id
  const cover = parsed?.meta.cover ?? project.image
  const category = parsed?.meta.category ?? project.category ?? ''

  const content = parsed?.body?.replace(/!\[.*?\]\([^)]*\)/, (match) => {
    const src = match.match(/\(<?([^)>]+?)>?\)/)?.[1] || ''
    return src === cover ? '' : match
  })

  return (
    <>
      <Helmet>
        <title>{title} — Портфолио</title>
        <meta name="description" content={`Проект ${title}`} />
      </Helmet>

      <article className="mx-auto w-full px-6 py-8 md:py-12">
        <div className="mb-6">
          <ProjectNavigation category={category} />
        </div>

        <div
          className="overflow-hidden rounded-2xl"
          style={{ backgroundColor: project.bgColor || 'var(--color-bg-card)' }}
        >
          {cover ? (
            <img src={cover} alt={title} className="h-auto w-full" />
          ) : null}
          <div className="py-6 md:py-10">
            {content ? (
              <ProjectContent markdown={content} />
            ) : (
              <p className="px-6 text-fg-muted md:px-10">Загрузка...</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <ProjectNavigation category={category} />
        </div>
      </article>
    </>
  )
}

export default ProjectPage
