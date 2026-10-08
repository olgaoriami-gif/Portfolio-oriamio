import { motion } from 'framer-motion'

function Hero() {
  return (
    <section
      id="hero"
      className="relative flex max-h-[35vh] min-h-[25vh] items-center justify-center overflow-hidden px-4 py-10"
    >

      <div className="container mx-auto text-left">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl text-left"
        >
          Portfolio
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-3 max-w-xl text-base text-fg-muted md:text-lg text-left"
        >
          3D, Illustrations & Design Systems
        </motion.p>
      </div>
    </section>
  )
}

export default Hero
