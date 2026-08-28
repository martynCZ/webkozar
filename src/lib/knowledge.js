// Jediný zdroj pravdy o firmě, ceníku a FAQ.
//
// Fyzicky je to `public/ai-knowledge.json` – ten samý soubor čte i PHP backend
// (`public/ai-api.php`) za běhu z webrootu. Sem se importuje do bundle, takže
// web i AI asistent jedou z jednoho obsahu (žádný drift ceny/FAQ ↔ JSON-LD).
//
// Když měníš ceník nebo FAQ, uprav `public/ai-knowledge.json` – promítne se to
// do ceníkové sekce, FAQ sekce, strukturovaných dat i do AI asistenta zároveň.
import knowledge from '../../public/ai-knowledge.json';

export default knowledge;

/** Balíčky ceníku tak, jak je čeká `CustomSelect` a `selectPackageAndScroll`. */
export const PACKAGES = knowledge.packages.map((p) => ({
  value: p.id,
  label: p.label,
}));

/** FAQ páry pro sekci i pro FAQPage JSON-LD. */
export const FAQ = knowledge.faq.map((f) => ({
  question: f.q,
  answer: f.a,
}));
