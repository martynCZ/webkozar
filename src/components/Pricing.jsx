import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import CtaButton from './CtaButton';
import { selectPackageAndScroll } from '../lib/selectPackage';
import { openChat } from '../lib/openChat';
import knowledge from '../lib/knowledge';

// Balíčky i ceny táhneme z jediného zdroje (public/ai-knowledge.json) – stejný
// obsah čte AI asistent i JSON-LD níž, takže cena v ceníku ≠ drift.
const PACKAGES = knowledge.packages;

// Který balíček je zvýrazněný ("nejoblíbenější"). Čistě vizuální volba.
const FEATURED_ID = 'standard';

// 10000 -> "10 000" (deterministicky, bez závislosti na ICU v SSR).
const czk = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const SITE_URL = 'https://webkozar.cz';

// JSON-LD ceníku – generuje se z PACKAGES a přes @id se váže na business node
// v index.html (ten má jen odkaz "hasOfferCatalog": { "@id": ... }).
const offerCatalogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  '@id': `${SITE_URL}/#offercatalog`,
  name: 'Tvorba webových stránek',
  itemListElement: PACKAGES.map((p) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: p.label,
      description: `${p.podtitulek}.`,
    },
    price: String(p.cena_od),
    priceCurrency: 'CZK',
    priceSpecification: {
      '@type': 'PriceSpecification',
      price: String(p.cena_od),
      priceCurrency: 'CZK',
      valueAddedTaxIncluded: false,
    },
  })),
};

function PackageCard({ pkg, featured }) {
  const cardClass = featured
    ? 'relative md:-translate-y-4 hover:-translate-y-2 md:hover:-translate-y-6 p-8 rounded-3xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-[#0EC3BF]/70 shadow-[0_0_80px_rgba(14,195,191,0.4)] hover:shadow-[0_0_100px_rgba(14,195,191,0.5)] transition-all duration-500 group'
    : 'relative p-8 rounded-3xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_40px_rgba(14,195,191,0.15)] hover:shadow-[0_0_100px_rgba(14,195,191,0.5)] hover:-translate-y-2 transition-all duration-500 group';

  const checkClass = featured
    ? 'w-6 h-6 shrink-0 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 justify-center p-1 border border-[#0EC3BF]/60'
    : 'w-6 h-6 shrink-0 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className={cardClass}>
        <h3 className="text-2xl font-bold text-white mb-4">{pkg.label}</h3>
        <p className="text-gray-400 leading-relaxed">{pkg.podtitulek}</p>
        <p
          className="mt-3 mb-4 text-4xl md:text-5xl font-bold text-white leading-relaxed"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <span className="text-gray-400 mr-1 leading-relaxed text-lg font-normal">od </span>
          {featured ? (
            <motion.span
              className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% center', '-200% center'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              {czk(pkg.cena_od)}
            </motion.span>
          ) : (
            czk(pkg.cena_od)
          )}
          <span className="text-gray-400 ml-1 leading-relaxed text-lg font-normal"> Kč</span>
        </p>
        <ul className="space-y-4 mb-8 text-gray-300">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check
                className={checkClass}
                style={featured ? undefined : { backgroundColor: 'rgba(14, 195, 191, 0.2)' }}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {featured ? (
          <CtaButton onClick={() => selectPackageAndScroll(pkg.id)} className="w-full">
            Vybrat balíček
          </CtaButton>
        ) : (
          <button
            onClick={() => selectPackageAndScroll(pkg.id)}
            className="px-8 py-4 w-full cursor-pointer rounded-full bg-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-[#0EC3BF]/50 transition-all duration-300"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Vybrat balíček
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Pricing() {
  const openPruvodce = () =>
    openChat('Rád poradím s výběrem balíčku. Popište mi krátce projekt – co to bude za web, kolik stránek a jestli potřebujete něco navíc (e-shop, rezervace, vícejazyčnost…).');

  return (
    <section className="relative py-16 md:py-24 px-4 scroll-mt-24" id="cenik">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogJsonLd) }}
      />
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
            Ceník vytvoření{' '}
            <motion.span
              className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% center', '-200% center'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              webových stránek
            </motion.span>
          </h2>
          <p className="text-xl text-gray-400">
            Vyberte si balíček, který nejlépe vyhovuje vašim potřebám
          </p>
        </motion.div>
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} featured={pkg.id === FEATURED_ID} />
            ))}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mt-20"
      >
        <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Nevíte si rady s výběrem?
        </h3>
        <p className="text-gray-400 mb-4">
          Využijte našeho AI chatbota, který vám pomůže najít ten pravý balíček pro vaše potřeby!
        </p>
        <div className="">
          <CtaButton onClick={openPruvodce}>Zeptat se AI asistenta</CtaButton>
        </div>
      </motion.div>
    </section>
  );
}

export default Pricing;
