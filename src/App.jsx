import { useState, lazy, Suspense, useEffect } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import AnimatedBackground from './components/AnimatedBackground'
import { LoadingScreen } from './components/LoadingScreen'
import Footer from './components/Footer'
import Home from './pages/Home'
import ConnectPage from './pages/ConnectPage'
import ServiceLanding from './pages/ServiceLanding'

// Nekritické pro první vykreslení – načtou se v samostatných chunkech.
const LiveChatWidget = lazy(() => import('./components/LiveChatWidget'))
const CookieConsent = lazy(() => import('./components/CookieConsent'))

const INTRO_SEEN_KEY = 'wk-intro-seen'

function introAlreadySeen() {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

// Loader vynecháme, když se stránka načte na pozadí (nová záložka apod.).
// V neaktivní záložce prohlížeč pozastaví animace, takže by se exit animace
// loaderu nikdy nedohrála a návštěvník by po přepnutí viděl zaseknutý loader.
function shouldShowIntro() {
  if (typeof window === 'undefined') return false // prerender – loader do HTML nepatří
  if (introAlreadySeen()) return false
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return false
  return true
}

// Řízení scrollu při navigaci (react-router ho sám neřeší):
// - je-li v URL kotva (#sekce), odscrolluje na ni (i po dorenderování obsahu),
// - jinak po změně routy skočí nahoru.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView()
        return
      }
      const t = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView()
      }, 300)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function App() {
  const [isLoading, setIsLoading] = useState(shouldShowIntro)

  const finishLoading = () => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      // privátní režim / zakázané úložiště – loader se příště zobrazí znovu
    }
    setIsLoading(false)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-clip">
        <a
          href="#obsah"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-[#0EC3BF] focus:px-5 focus:py-2 focus:font-medium focus:text-[#050117] focus:shadow-[0_0_20px_rgba(14,195,191,0.5)]"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Přeskočit na obsah
        </a>
        <AnimatePresence>
          {isLoading && (
            <LoadingScreen onComplete={finishLoading} />
          )}
        </AnimatePresence>
        <AnimatedBackground />
        <ScrollManager />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route
            path="/tvorba-webovych-stranek-novy-jicin"
            element={<ServiceLanding variant="tvorba" />}
          />
          <Route path="/seo-novy-jicin" element={<ServiceLanding variant="seo" />} />
          <Route path="/webdesign-novy-jicin" element={<ServiceLanding variant="webdesign" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        <Suspense fallback={null}>
          <LiveChatWidget />
          <CookieConsent />
        </Suspense>
      </div>
    </MotionConfig>
  )
}

export default App
