import { motion, useReducedMotion } from 'motion/react';

/**
 * Cesta požadavku portálem Webkozar Connect – vodorovná časová osa pěti stavů
 * s barevným gradientovým vláknem. Sdílené mezi teaserem na homepage
 * a stránkou `/connect`. Bez screenshotů – čistě grafika.
 */
const STATES = [
  { label: 'Nový', color: '#f59e0b', desc: 'Odeslali jste požadavek.' },
  { label: 'V řešení', color: '#3b82f6', desc: 'Pracujeme na něm.' },
  { label: 'K otestování', color: '#a855f7', desc: 'Kontrolujeme kvalitu.' },
  { label: 'Čeká na schválení', color: '#f43f5e', desc: 'Prohlédnete si výsledek.' },
  { label: 'Hotovo', color: '#22c55e', desc: 'Schváleno a nasazeno na web.' },
];

const LINE_GRADIENT = 'linear-gradient(90deg, #f59e0b, #3b82f6, #a855f7, #f43f5e, #22c55e)';
const SG = { fontFamily: 'Space Grotesk, sans-serif' };
const OF = { fontFamily: 'Outfit, sans-serif' };

function RequestLifecycle({
  heading = 'Cesta požadavku',
  subheading = 'Kde se úprava zrovna nachází, poznáte na první pohled',
  className = '',
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 shadow-[0_0_60px_rgba(14,195,191,0.1)] ${className}`}
    >
      <div className="pointer-events-none absolute -top-24 left-1/4 h-48 w-1/2 rounded-full bg-[#0EC3BF]/10 blur-[120px]" />

      <div className="relative">
        <h3
          className="text-xl md:text-2xl font-bold text-white text-center"
          style={SG}
        >
          {heading}
        </h3>
        <p className="mt-2 text-center text-gray-400" style={OF}>
          {subheading}
        </p>

        {/* Desktop – vodorovná osa */}
        <div className="relative mt-16 hidden lg:block">
          <div className="absolute left-[10%] right-[10%] top-2.5 h-px bg-white/10" />
          <motion.div
            className="absolute left-[10%] right-[10%] top-2.5 h-px origin-left"
            style={{ background: LINE_GRADIENT }}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          />
          {!reduce && (
            <motion.div
              className="absolute top-2.5 h-px w-20 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent"
              animate={{ left: ['8%', '82%'] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
            />
          )}

          <div className="relative flex">
            {STATES.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-1 flex-col items-center px-2 text-center"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.12 }}
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span
                    className="absolute h-full w-full rounded-full opacity-25"
                    style={{ background: s.color }}
                  />
                  <span
                    className="relative h-3 w-3 rounded-full ring-4 ring-[#0a0a18]"
                    style={{ background: s.color, boxShadow: `0 0 14px ${s.color}` }}
                  />
                </span>
                <span className="mt-4 text-sm font-semibold text-white" style={SG}>
                  {s.label}
                </span>
                <span className="mt-1 max-w-[11rem] text-xs text-gray-400" style={OF}>
                  {s.desc}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobil / tablet – svislý seznam */}
        <div className="mt-10 space-y-3 lg:hidden">
          {STATES.map((s) => (
            <div
              key={s.label}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <span
                className="mt-1 h-3 w-3 shrink-0 rounded-full"
                style={{ background: s.color, boxShadow: `0 0 12px ${s.color}` }}
              />
              <div>
                <p className="text-sm font-semibold text-white" style={SG}>
                  {s.label}
                </p>
                <p className="text-xs text-gray-400" style={OF}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RequestLifecycle;
