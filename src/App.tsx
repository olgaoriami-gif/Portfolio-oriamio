import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import ProjectPage from '@/pages/ProjectPage'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <>
      <Helmet>
        <title>Портфолио</title>
        <meta name="description" content="Портфолио дизайнера" />
      </Helmet>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects/:projectId" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
