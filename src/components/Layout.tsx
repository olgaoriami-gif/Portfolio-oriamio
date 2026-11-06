import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AboutModal from './AboutModal'
import { openAbout, useAboutState } from '@/lib/aboutStore'

function Layout() {
  const location = useLocation()
  const { seen } = useAboutState()

  // Intro modal shows once per session on the home page
  useEffect(() => {
    if (location.pathname === '/' && !seen) openAbout()
  }, [location.pathname, seen])

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col min-[1921px]:w-[80%]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AboutModal />
    </div>
  )
}

export default Layout
