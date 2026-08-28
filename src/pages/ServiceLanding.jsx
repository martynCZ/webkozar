import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import CtaButton from '../components/CtaButton';
import { usePageMeta } from '../lib/usePageMeta';
import { SITE_URL, canonicalFor } from '../lib/seo';
import { SERVICE_LANDINGS } from '../lib/serviceLanding';

const SG = { fontFamily: 'Space Grotesk, sans-serif' };
const OF = { fontFamily: 'Outfit, sans-serif' };

function buildJsonLd(data, pathname) {
  const url = canonicalFor(pathname);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${data.serviceName} Nový Jičín`,
      serviceType: data.serviceName,
      provider: { '@type': 'ProfessionalService', name: 'webkozar', url: `${SITE_URL}/` },
      areaServed: [
        { '@type': 'City', name: 'Nový Jičín' },
        { '@type': 'AdministrativeArea', name: 'Moravskoslezský kraj' },
      ],
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Úvod', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: data.h1, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];
}

function ServiceLanding({ variant }) {
  const data = SERVICE_LANDINGS[variant];
  const { pathname } = useLocation();
  usePageMeta(pathname);

  const jsonLd = buildJsonLd(data, pathname);

  return (
    <main className="relative z-10 px-4 pt-32 md:pt-40 pb-16 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[95%] md:max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block mb-4 px-3 py-1 rounded-full bg-[#0EC3BF]/15 border border-[#0EC3BF]/30 text-[#0EC3BF] text-xs font-medium uppercase tracking-wider"
            style={SG}
          >
            {data.kicker}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl" style={SG}>
            {data.h1}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-4 max-w-3xl" style={OF}>
            {data.lead}
          </p>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-3xl" style={OF}>
            {data.intro}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <CtaButton href="/#kontakt">Nezávazná poptávka</CtaButton>
            <a
              href="/#reference"
              className="group inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors font-medium"
              style={OF}
            >
              Naše reference
              <ArrowRight
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </motion.div>

        {/* Obsahové bloky */}
        <div className="mt-16 md:mt-20 space-y-12">
          {data.blocks.map((block) => (
            <motion.section
              key={block.h2}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={SG}>
                {block.h2}
              </h2>
              {block.p.map((para) => (
                <p key={para} className="text-gray-400 leading-relaxed mb-3 max-w-3xl" style={OF}>
                  {para}
                </p>
              ))}
            </motion.section>
          ))}
        </div>

        {/* Proč webkozar */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10 backdrop-blur-xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6" style={SG}>
            Proč webkozar
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {data.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#0EC3BF]/20 border border-[#0EC3BF]/40">
                  <Check className="w-3 h-3 text-[#0EC3BF]" aria-hidden="true" />
                </span>
                <span className="text-gray-300" style={OF}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6" style={SG}>
            Časté dotazy
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.faq.map((f) => (
              <div key={f.q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-white mb-2" style={SG}>
                  {f.q}
                </h3>
                <p className="text-gray-400 leading-relaxed" style={OF}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Prolinkování */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4" style={SG}>
            Další, co pro vás uděláme
          </h2>
          <ul className="flex flex-wrap gap-3" style={OF}>
            {data.related.map((key) => (
              <li key={key}>
                <Link
                  to={SERVICE_LANDINGS[key].slug}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#0EC3BF]/40 px-4 py-2 text-sm font-medium text-[#0EC3BF] hover:bg-[#0EC3BF]/10 transition-colors"
                >
                  {SERVICE_LANDINGS[key].serviceName} Nový Jičín
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Zpět na hlavní stránku
              </Link>
            </li>
          </ul>
        </motion.section>

        {/* Závěrečné CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_60px_rgba(14,195,191,0.15)] p-8 md:p-12 text-center"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-[#0EC3BF]/12 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={SG}>
              {data.serviceName} v Novém Jičíně? Napište nám.
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto" style={OF}>
              Ozvěte se a domluvíme si nezávaznou konzultaci s odhadem ceny zdarma.
            </p>
            <CtaButton href="/#kontakt">Nezávazná poptávka</CtaButton>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default ServiceLanding;
