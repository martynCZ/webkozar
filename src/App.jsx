import { useState, lazy, Suspense } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import './index.css'
import Header from './components/Header'
import AnimatedBackground from './components/AnimatedBackground'
import Hero from './components/Hero'
import Process from './components/Process'
import Pricing from './components/Pricing'
import { LoadingScreen } from './components/LoadingScreen'
import Technologies from './components/Technologies'
import { Reference } from './components/Reference'
import Faq from './components/Faq'
import Form from './Form'
import Footer from './components/Footer'

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
  if (introAlreadySeen()) return false
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return false
  return true
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
        <AnimatePresence>
          {isLoading && (
            <LoadingScreen onComplete={finishLoading} />
          )}
        </AnimatePresence>
        <AnimatedBackground />
        <Header />
        <main>
          <Hero />
          <Process />
          <Pricing />
          <Technologies />
          <Reference />
          <Faq />
          <Form />
        </main>
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