import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { sectionVariants } from '@/lib/animations'

type MotionSectionProps = {
  children: React.ReactNode
  className?: string
  id?: string
}

function MotionSection({ children, className, id }: MotionSectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={sectionVariants}
      className={cn('py-20 md:py-28', className)}
    >
      {children}
    </motion.section>
  )
}

export { MotionSection }
