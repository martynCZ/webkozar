import { Link } from 'react-router-dom';

/**
 * Primární CTA webu: gradient tyrkys → fialová. Bez zvětšování (scale).
 * Hover efekt = „odlesk": jemný světelný šik jednou přejede zleva doprava
 * přes tlačítko a zmizí. Navíc se zesílí tyrkysová záře.
 *
 * Renderuje `<Link>` (má-li `to` – navigace v rámci routeru), `<a>` (má-li
 * `href` – kotva nebo externí odkaz), jinak `<button>`. Ikony/obsah dej jako
 * children; jsou nad vrstvou odlesku. Skupina se jmenuje `group/cta`, takže
 * vnitřní prvky můžou reagovat přes `group-hover/cta:*` (např. posun šipky).
 *
 * `compact` = menší varianta do hlavičky. Přes `className` se dá jen přidávat
 * (w-full, mt-auto, text-lg…), ne přepisovat padding/font – na to je `compact`.
 */
function CtaButton({ href, to, children, className = '', compact = false, ...props }) {
  const size = compact ? 'px-4 py-2' : 'px-8 py-4 font-semibold';

  const cls =
    'group/cta relative isolate overflow-hidden inline-flex items-center justify-center gap-2 ' +
    `${size} rounded-full text-white text-center cursor-pointer ` +
    'bg-gradient-to-r from-[#0EC3BF] to-purple-600 ' +
    'shadow-[0_0_40px_rgba(14,195,191,0.6)] hover:shadow-[0_0_60px_rgba(14,195,191,0.8)] ' +
    'transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed ' +
    className;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[900ms] ease-out group-hover/cta:translate-x-[220%] motion-reduce:hidden"
      />
      <span
        className="relative z-10 inline-flex items-center gap-2"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {inner}
      </Link>
    );
  }

  return href ? (
    <a href={href} className={cls} {...props}>
      {inner}
    </a>
  ) : (
    <button className={cls} {...props}>
      {inner}
    </button>
  );
}

export default CtaButton;
