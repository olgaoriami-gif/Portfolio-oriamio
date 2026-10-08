import { Helmet } from 'react-helmet-async'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'

function Home() {
  return (
    <>
      <Helmet>
        <title>Portfolio</title>
      </Helmet>
      <About />
      <Projects />
    </>
  )
}

export default Home
