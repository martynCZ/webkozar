// Jediný zdroj položek navigace (používá Header i Footer).
// `hash` = sekce na domovské stránce (na `/` scrolluje, jinde vede na `/<hash>`).
// `to`   = samostatná routa (react-router).
// `vyrazny` = vlastní produkt (Restricto) — v Headeru za oddělovačem, barvou akcentu.
export const NAV_LINKS = [
  { name: 'O nás', hash: '#o-nas' },
  { name: 'Tvorba', hash: '#tvorba' },
  { name: 'Ceník', hash: '#cenik' },
  { name: 'Technologie', hash: '#technologie' },
  { name: 'Reference', hash: '#reference' },
  { name: 'FAQ', hash: '#faq' },
  { name: 'Connect', to: '/connect' },
  { name: 'Restricto', hash: '#restricto', vyrazny: true },
];
