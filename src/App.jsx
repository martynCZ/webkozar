import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
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
import LiveChatWidget from './components/LiveChatWidget'
import Footer from './components/Footer'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative min-h-screen overflow-clip">
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
        <Reference />
        <Faq />
        <Form />
      </main>
      <Footer />
      <LiveChatWidget />
    </div>
  )
}

export default App