import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

/**
 * Sdílené prvky pro prezentaci portálu Webkozar Connect (teaser na homepage
 * i stránka `/connect`).
 *
 * Screenshoty leží v `public/connect/` (16:9 výřezy: `prehled`, `sablony`,
 * `detail`, `fakturace`, `seznam`, `kanban`). `SCREENSHOTS_AVAILABLE` je
 * společný přepínač pro celý web — na `false` `Shot` vykreslí placeholder.
 */
export const SCREENSHOTS_AVAILABLE = true;

export function BrowserFrame({ children, className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/15 bg-[#0b0a1a]/90 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.7)] ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div
          className="ml-3 flex-1 max-w-[16rem] truncate rounded-md bg-white/5 border border-white/10 px-3 py-1 text-xs text-gray-400"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          connect.webkozar.cz
        </div>
      </div>
      {children}
    </div>
  );
}

export function Shot({ src, alt, label }) {
  const [failed, setFailed] = useState(false);
  const show = SCREENSHOTS_AVAILABLE && src && !failed;

  return (
    <div className="relative aspect-[16/9] bg-gradient-to-br from-white/[0.06] to-transparent">
      {show ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-3 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 px-6 text-center">
          <ImageIcon className="w-8 h-8 text-[#0EC3BF]/70" aria-hidden="true" />
          <p className="text-sm text-gray-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {label}
          </p>
        </div>
      )}
    </div>
  );
}
