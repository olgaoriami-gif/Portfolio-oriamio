import { MotionSection } from '@/components/ui/MotionSection'
import { itemVariants } from '@/lib/animations'
import { typograph } from '@/lib/typograph'
import { motion } from 'framer-motion'
import {
  Code2,
  Palette,
  Smartphone,
  Zap,
  Globe,
  GitBranch,
  Database,
  Lock,
} from 'lucide-react'

const skills = [
  { icon: Code2, title: 'Frontend', desc: 'React, TypeScript, Vite' },
  { icon: Palette, title: 'UI/UX', desc: 'Tailwind, Figma, анимации' },
  { icon: Smartphone, title: 'Responsive', desc: 'Mobile-first, адаптивность' },
  { icon: Zap, title: 'Performance', desc: 'Оптимизация, lazy loading' },
  { icon: Globe, title: 'Web Standards', desc: 'HTML5, CSS3, доступность' },
  { icon: GitBranch, title: 'Workflow', desc: 'Git, ESLint, Prettier' },
  { icon: Database, title: 'Data', desc: 'REST API, работа с API' },
  { icon: Lock, title: 'Best Practices', desc: 'TypeScript, безопасность' },
]

function Skills() {
  return (
    <MotionSection id="skills" className="bg-neutral-900/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold md:text-4xl">Навыки</h2>
        <p className="mt-4 max-w-2xl text-neutral-300">
          {typograph('Основные компетенции и инструменты, которые использую в работе.')}
        </p>
        <motion.div
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {skills.map((skill) => {
            const Icon = skill.icon
            return (
              <motion.div
                key={skill.title}
                variants={itemVariants}
                className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:border-primary-500/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{skill.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{typograph(skill.desc)}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </MotionSection>
  )
}

export default Skills
