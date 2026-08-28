import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

const projects = [
  {
    title: 'Okna Jančálek',
    category: 'Katalog, logo',
    description: 'Minimalistický katalog kvalitních oken s důrazem na moderní architekturu',
    image: '/reference/oknajancalek.webp',
    link:'https://oknajancalek.cz/',
    balicek: 'Řešení na míru'
  },
  {
    title: 'ZŠ a MŠ Hladké Životice',
    category: 'Webová stránka',
    description: 'Informační web základní a mateřské školy s důrazem na barvy a přehlednost',
    image: '/reference/zs-ms-hlz.webp',
    link:'https://www.zshlzivotice.cz/',
    balicek: 'Řešení na míru'
  },
  {
    title: 'F.S.C. Bezpečnostní poradenství',
    category: 'Webová stránka',
    description: 'Profesionální firemní prezentace české poradenské společnosti v oblasti bezpečnosti.',
    image: '/reference/fsc.webp',
    link:'https://fsc-ov.cz/',
    balicek: 'Standardní web'
  },
  {
    title: 'BMX Třinec',
    category: 'Webová stránka',
    description: 'Oficiální webová prezentace třineckého bikrosu.',
    image: '/reference/bmxtrinec.webp',
    link:'https://bmxtrinec.cz/',
    balicek: 'Základní web'
  },
  {
    title: 'Internova Nový Jičín',
    category: 'Webová stránka',
    description: 'Firemní web novojičínské společnosti s přehlednou prezentací nabídky a služeb.',
    image: '/reference/internova.webp',
    link:'https://internovanj.webkozar.cz/',
    balicek: 'Řešení na míru'
  },
  {
    title: 'TJ Niva Hladké Životice',
    category: 'Webová stránka',
    description: 'Oficiální stránky sportovního klubu s aktualitami, výsledky a fotogalerií',
    image: '/reference/niva.webp',
    link:'https://tjniva.cz/',
    balicek: 'Základní web'
  },
];
const MoreProjects = [
  {
    title: 'Baspyr Glass',
    category: 'Webová stránka',
    description: 'Vizitka výrobce laboratorního skla s důrazem na moderní design a přehlednost',
    image: '/reference/baspyr.webp',
    link:'https://baspyrglass.cz/',
    balicek: 'Základní web'
  },
  {
    title: 'Hladké Životice',
    category: 'Webová stránka',
    description: 'Obecní web s důrazem na přehlednost a snadnou orientaci pro občany i návštěvníky.',
    image: '/reference/zivotice.webp',
    link:'https://www.hladkezivotice.cz/',
    balicek: 'Řešení na míru'
  },
  {
    title: 'Autodoprava Jančálek',
    category: 'Webová stránka, logo',
    description: 'Moderní firemní web autodopravy s čistým designem, novým logem a přehlednou nabídkou služeb.',
    image: '/reference/jancalek.webp',
    link:'https://jancalek.net/',
    balicek: 'Základní web'
  },
  {
    title: 'HOLF centrum',
    category: 'Webová stránka',
    description: 'Přehledná prezentace dodavatele pracovních oděvů a OOPP s důrazem na sortiment a osobní přístup.',
    image: '/reference/holfcentrum.webp',
    link:'https://holfcentrum.cz/',
    balicek: 'Základní web'
  },
  {
    title: 'Dopravní koridor Poodří',
    category: 'Webová stránka, logo',
    description: 'Web spolku obcí i s novým logem, srozumitelně informující o dopravních stavbách v regionu.',
    image: '/reference/dpk.webp',
    link:'https://dopravnikoridorpoodri.cz/',
    balicek: 'Standardní web'
  },
  {
    title: 'KADOS',
    category: 'Webová stránka',
    description: 'Firemní web dodavatele stavebních materiálů a CNC obrábění s jasně členěnou nabídkou služeb.',
    image: '/reference/kados.webp',
    link:'https://kados.cz/',
    balicek: 'Řešení na míru'
  },
  {
    title: 'Tonysound',
    category: 'Webová stránka',
    description: 'Výrazná prezentace ozvučení a osvětlení akcí, laděná do atmosféry živé hudby.',
    image: '/reference/tonysound.webp',
    link:'https://tonysound.cz/',
    balicek: 'Základní web'
  },
  {
    title: 'Zemspol Studénka',
    category: 'Webová stránka',
    description: 'Moderní web zemědělské společnosti představující rostlinnou i živočišnou výrobu a bioplynové stanice.',
    image: '/reference/zemspol.webp',
    link:'https://zemspol-studenka.cz/',
    balicek: 'Základní web'
  }
];
const showReference = (projekty) =>{
  {return projekty.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(14,195,191,0.15)] hover:shadow-[0_0_60px_rgba(14,195,191,0.35)] transition-all duration-500">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={`Tvorba webových stránek pro ${project.title}`}
                    width="800"
                    height="600"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118] via-[#0a0118]/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute inset-0 border-2 border-[#0EC3BF]/0 group-hover:border-[#0EC3BF]/50 rounded-2xl transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-semibold flex items-center gap-2 shadow-[0_0_40px_rgba(14,195,191,0.8)]">
                      <span style={{ fontFamily: 'Outfit, sans-serif' }}>Zobrazit projekt</span>
                      <ExternalLink aria-hidden="true" className="w-4 h-4" />
                    </div>
                    </a>
                  </div>
                  {project.balicek && (
                    <div className="absolute bottom-3 left-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0EC3BF]" />
                        {project.balicek}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#0EC3BF]/20 border border-[#0EC3BF]/30 text-[#0EC3BF] text-xs font-medium">
                    {project.category}
                  </div>
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-[#0EC3BF] transition-colors"
                    >
                      {project.title}
                      <ExternalLink aria-hidden="true" className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity" />
                    </a>
                  </h3>
                  <p 
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {project.description}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#0EC3BF]/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
}

export function Reference() {
  const [moreProjects, showMoreProjects] = useState(false);
  return (
    <section id="reference" className="relative py-16 md:py-24 px-4 scroll-mt-24">
      <div className="max-w-[95%] md:max-w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Naše{' '}
            <span className="bg-gradient-to-r from-[#0EC3BF] to-purple-500 bg-clip-text text-transparent">
              reference
            </span>
          </h2>
          <p 
            className="text-xl text-gray-400"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Projekty, na které jsme hrdí
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showReference(projects)}
          {moreProjects && showReference(MoreProjects)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button 
            className="px-8 py-4 w-full cursor-pointer md:w-auto rounded-full bg-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-[#0EC3BF]/50 hover:shadow-[0_0_40px_rgba(14,195,191,0.3)] transition-all duration-300"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            onClick={() => showMoreProjects(!moreProjects)}
          >
            {moreProjects ? 'Zobrazit méně' : 'Zobrazit více'}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
