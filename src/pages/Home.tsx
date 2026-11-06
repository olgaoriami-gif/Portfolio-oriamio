import { Helmet } from 'react-helmet-async'
import Projects from '@/components/sections/Projects'

function Home() {
  return (
    <>
      <Helmet>
        <title>Portfolio</title>
      </Helmet>
      <Projects />
    </>
  )
}

export default Home
