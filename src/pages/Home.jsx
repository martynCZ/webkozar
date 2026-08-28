import Hero from '../components/Hero'
import Process from '../components/Process'
import Pricing from '../components/Pricing'
import Technologies from '../components/Technologies'
import WebkozarConnect from '../components/WebkozarConnect'
import { Reference } from '../components/Reference'
import Faq from '../components/Faq'
import Form from '../Form'
import { usePageMeta } from '../lib/usePageMeta'

// Domovská onepage – sekce jdou po sobě v <main>.
function Home() {
  usePageMeta('/')

  return (
    <main id="obsah">
      <Hero />
      <Process />
      <Pricing />
      <Technologies />
      <WebkozarConnect />
      <Reference />
      <Faq />
      <Form />
    </main>
  )
}

export default Home
