import type { MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { typograph } from '@/lib/typograph'

const aboutContent = {
  heading: 'Меня зовут Оля Баранова, я работаю с графикой и дизайн-системами',
  description:
    'Любовь к глубине и деталям — именно из этого рождаются мои работы. Для меня важны выразительность, система и баланс между формой и функцией',
  avatar: '/about/foto-avatar.png',
}

function About() {
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 180, damping: 20, mass: 0.7 })
  const rotateY = useSpring(tiltY, { stiffness: 180, damping: 20, mass: 0.7 })

  const handleAvatarMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    tiltX.set(y * -16)
    tiltY.set(x * 16)
  }

  const resetAvatarTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <section id="about" className="px-16 py-16">
      <div className="mx-auto grid w-full max-w-[1800px] gap-10 md:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] md:items-center md:gap-16 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-left"
        >
          <h1 className="max-w-4xl text-left text-pretty font-[family-name:var(--font-heading)] text-4xl font-medium leading-[0.95] tracking-tight text-fg sm:text-5xl md:text-7xl lg:text-6xl">
            {typograph(aboutContent.heading)}
          </h1>

          <p className="mt-8 max-w-2xl text-left text-pretty text-base leading-relaxed text-fg-secondary md:text-lg">
            {typograph(aboutContent.description)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[320px] justify-self-center [perspective:900px] md:justify-self-end"
          onMouseMove={handleAvatarMove}
          onMouseLeave={resetAvatarTilt}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.25 }}
          >
            <img
              src={aboutContent.avatar}
              alt="Портрет Оли Барановой"
              className="w-full object-contain drop-shadow-[0_22px_30px_rgba(0,0,0,0.16)] [transform:translateZ(24px)]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
