import Header from './components/Header'
import AnimatedBackground from './components/AnimatedBackground'
import Hero from './components/Hero'
import Process from './components/Process/Process'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main>
        <Hero />
        <Process />
      </main>
    </div>
  )
}

export default App
