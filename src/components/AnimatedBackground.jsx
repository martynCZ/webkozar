// Pozadí webu. Dřív to byly 4 velké elementy s `filter: blur(100–150px)`
// a nekonečným `animate-pulse` (opacity) – blur i opacity se překreslují
// každý snímek, což na mobilu trvale vytěžovalo GPU.
//
// Nově: barevné „nasvícení" jsou statické radiální gradienty (žádný blur
// filtr, žádná animace) – prohlížeč složí jednu vykreslenou vrstvu.
// Na `md+` a jen když uživatel nevypnul animace přibývá jedna vrstva,
// která se sune pomalým `transform` (GPU, bez překreslení).
// Na mobilu žádná animace není.

const BASE_LAYERS = [
  'radial-gradient(50rem 42rem at 10% 4%, rgba(14,195,191,0.20), transparent 62%)',
  'radial-gradient(58rem 58rem at 96% 18%, rgba(147,51,234,0.17), transparent 60%)',
  'radial-gradient(46rem 46rem at 26% 108%, rgba(147,51,234,0.16), transparent 60%)',
  'radial-gradient(38rem 38rem at 82% 86%, rgba(217,70,239,0.13), transparent 60%)',
  'linear-gradient(135deg, #0a0118 0%, #0d0221 45%, #050010 100%)',
].join(', ');

const DRIFT_LAYERS = [
  'radial-gradient(34rem 34rem at 22% 28%, rgba(14,195,191,0.12), transparent 60%)',
  'radial-gradient(34rem 34rem at 78% 72%, rgba(147,51,234,0.12), transparent 60%)',
].join(', ');

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050117]">
      <div className="absolute inset-0" style={{ backgroundImage: BASE_LAYERS }} />

      <div
        className="hidden md:block motion-reduce:hidden absolute inset-[-20%] wk-bg-drift"
        style={{ backgroundImage: DRIFT_LAYERS }}
      />

      {/* Jemná zrnitost proti banding efektu gradientů (statická, ~1 kB). */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
    </div>
  );
}

export default AnimatedBackground;
