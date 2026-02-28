import Header from './components/Header'
import AnimatedBackground from './components/AnimatedBackground'
import Hero from './components/Hero'
import Process from './components/Process'
import Pricing from './components/Pricing'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main>
        <Hero />
        <Process />
        <Pricing />
      </main>
    </div>
  )
}

export default App
