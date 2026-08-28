import { motion } from 'motion/react';
import { Mail, Paperclip, ArrowRight, Check, CornerUpRight } from 'lucide-react';

/**
 * „Konec e-mailového chaosu" – vizuální porovnání komunikace přes e-mail
 * vs. přes portál Webkozar Connect. Čistě grafika, žádné screenshoty.
 */
const SG = { fontFamily: 'Space Grotesk, sans-serif' };
const OF = { fontFamily: 'Outfit, sans-serif' };

const inbox = [
  { subject: 'Re: Re: úprava webu – ceník', time: 'po 9:14', clip: true },
  { subject: 'Fwd: loga (finální) v2', time: 'čt 17:40', clip: true },
  { subject: 'Re: kdy to bude hotové?', time: 'pá 11:02', clip: false },
  { subject: 'Re: Re: Re: fotky na stránku', time: 'út 8:30', clip: true },
];

function ChaosVsConnect() {
  return (
    <section className="relative">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-white text-center mb-3"
        style={SG}
      >
        Konec e-mailového chaosu
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
        style={OF}
      >
        Jedna zakázka, jedno místo. Žádné „ve kterém e-mailu to bylo".
      </motion.p>

      <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-6 items-center">
        {/* PŘED – e-mailová schránka */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-rose-400/15 bg-white/[0.02] p-6 md:p-7 lg:rotate-[-1.5deg] saturate-[0.6]"
        >
          <div className="flex items-center gap-2 mb-5 text-gray-400">
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs uppercase tracking-wider" style={SG}>
              E-mailová schránka
            </span>
          </div>

          <div className="space-y-2">
            {inbox.map((mail, i) => (
              <div
                key={mail.subject}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                style={{ marginLeft: `${i * 6}px` }}
              >
                <CornerUpRight className="w-3.5 h-3.5 shrink-0 text-gray-600" aria-hidden="true" />
                <span className="flex-1 truncate text-sm text-gray-400" style={OF}>
                  {mail.subject}
                </span>
                {mail.clip && (
                  <Paperclip className="w-3.5 h-3.5 shrink-0 text-gray-600" aria-hidden="true" />
                )}
                <span className="shrink-0 text-[11px] text-gray-600" style={OF}>
                  {mail.time}
                </span>
              </div>
            ))}
          </div>

          <p
            className="mt-5 inline-block rounded-lg border border-rose-400/20 bg-rose-400/5 px-3 py-1.5 text-xs text-rose-200/70"
            style={OF}
          >
            „Kde jsme se domluvili na té ceně?"
          </p>
        </motion.div>

        {/* Šipka */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#0EC3BF]/30 bg-[#0EC3BF]/10 text-[#0EC3BF] shadow-[0_0_25px_rgba(14,195,191,0.35)]"
        >
          <ArrowRight className="w-5 h-5 rotate-90 lg:rotate-0" aria-hidden="true" />
        </motion.div>

        {/* PO – karta požadavku v Connectu */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-[#0EC3BF]/25 bg-gradient-to-br from-white/[0.07] to-transparent p-6 md:p-7 shadow-[0_0_50px_rgba(14,195,191,0.15)]"
        >
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs uppercase tracking-wider text-[#0EC3BF]" style={SG}>
              Požadavek · Webkozar Connect
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-400/10 px-2.5 py-1 text-[11px] font-medium text-blue-200"
              style={OF}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              V řešení
            </span>
          </div>

          <h3 className="text-lg font-bold text-white" style={SG}>
            Úprava ceníku 2026
          </h3>
          <p className="mt-1 text-sm text-gray-400" style={OF}>
            Odhad ceny <span className="text-white">1 500 Kč</span> · 2,5 h bez DPH
          </p>

          <div className="mt-5 space-y-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-300" style={OF}>
              Přidejte prosím i variantu s roční platbou.
            </div>
            <div className="ml-6 rounded-xl border border-[#0EC3BF]/20 bg-[#0EC3BF]/[0.06] px-3 py-2 text-sm text-gray-200" style={OF}>
              Doplněno, mrkněte na náhled.
            </div>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-emerald-300/80" style={OF}>
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            Odhad schválen · vše u jednoho požadavku
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default ChaosVsConnect;
