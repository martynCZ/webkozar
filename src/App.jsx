import { useState } from 'react'
import { AnimatePresence } from 'motion/react'

import Header from './components/Header'
import AnimatedBackground from './components/AnimatedBackground'
import Hero from './components/Hero'
import Process from './components/Process'
import Pricing from './components/Pricing'
import { LoadingScreen } from './components/LoadingScreen'
import Technologies from './components/Technologies'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      <AnimatedBackground />
      <Header />
      <main>
        <Hero />
        <Process />
        <Pricing />
        <Technologies />
      </main>
    </div>
  )
}

export default App