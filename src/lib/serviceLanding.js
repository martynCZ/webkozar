// Obsah samostatných landing pages pro nejhledanější fráze ze Search Console
// („… nový jičín"). Data bez JSX – vykresluje je `src/pages/ServiceLanding.jsx`.

export const SERVICE_LANDINGS = {
  tvorba: {
    slug: '/tvorba-webovych-stranek-novy-jicin',
    serviceName: 'Tvorba webových stránek',
    kicker: 'Nový Jičín a okolí',
    h1: 'Tvorba webových stránek Nový Jičín',
    lead: 'Postavíme vám web, který v Novém Jičíně i okolí přivádí zákazníky — rychlý, přehledný a připravený na vyhledávače.',
    intro:
      'webkozar je tvorba webových stránek a webdesign z okresu Nový Jičín. Jsme dva a weby děláme celé sami — od úvodní analýzy přes návrh a texty až po spuštění a následnou správu. Každý web stavíme na míru tomu, co má firma prodávat a komu.',
    blocks: [
      {
        h2: 'Co v ceně webu dostanete',
        p: [
          'Responzivní web, který funguje na mobilu i na velkém monitoru. Základní SEO optimalizaci, aby vás Google i Seznam našly na fráze typu „vaše služba Nový Jičín". Napojení na kontaktní formulář, mapu a firemní profil.',
          'Doménu, hosting i e-mailové schránky vyřešíme za vás. Po spuštění vás nenecháme — drobné úpravy zadáváte přes klientský portál Webkozar Connect.',
        ],
      },
      {
        h2: 'Jak spolupráce probíhá',
        p: [
          'Začneme konzultací a odhadem ceny zdarma. Pak přijde analýza konkurence a návrh struktury, na kterém se domluvíme dřív, než se začne kódovat. Design i texty procházíte a připomínkujete.',
          'Jednoduchý prezentační web zvládneme za 2–3 týdny, firemní web s vlastním designem za 4–6 týdnů. Termín potvrdíme na začátku a průběžně vás informujeme.',
        ],
      },
      {
        h2: 'Na čem weby stavíme',
        p: [
          'Podle rozsahu a rozpočtu volíme mezi webem na míru (moderní stack React, Vite, Tailwind — rychlé načítání, snadné SEO) a řešením na WordPressu s tématem Avada, které si pak zvládnete spravovat i sami. Vždycky poradíme, co se pro váš projekt hodí víc.',
          'Doménu (přes Subreg), hosting (u Světhostingu), e-mailové schránky, SSL certifikát i zálohování vyřešíme za vás a předáme přístupy. Nejste u nás zamčení — web i podklady jsou vaše.',
        ],
      },
      {
        h2: 'Weby pro firmy z Novojičínska',
        p: [
          'Máme za sebou weby pro firmy, obce, školy i spolky z Novojičínska a Ostravska — od výrobců přes služby po sportovní kluby. Konkrétní realizace si projdete v sekci reference na hlavní stránce.',
        ],
      },
    ],
    bullets: [
      'Weby na míru i na WordPressu — podle toho, co dává smysl',
      'Rychlost a Core Web Vitals řešíme od začátku',
      'SEO základ v ceně každého webu',
      'Doména, hosting i e-maily vyřešíme za vás',
      'Po spuštění půl roku správa a drobné úpravy v ceně',
    ],
    faq: [
      {
        q: 'Kolik stojí web v Novém Jičíně?',
        a: 'Základní prezentační web od 10 000 Kč, firemní web s vlastním designem od 15 000 Kč, řešení na míru od 25 000 Kč. Přesnou nabídku připravíme po krátké konzultaci zdarma.',
      },
      {
        q: 'Jak dlouho tvorba webu trvá?',
        a: 'Jednoduchý web 2–3 týdny, firemní web 4–6 týdnů. Termín potvrdíme na začátku a průběžně vás informujeme o průběhu.',
      },
      {
        q: 'Postaráte se o web i po spuštění?',
        a: 'Ano. Po spuštění máte v ceně správu a drobné úpravy (texty, fotky, výměna údajů) — rozsah a délku má každý balíček v ceníku. Větší věci jako nová stránka nebo sekce jsou samostatná zakázka. Dál pokračujeme ročním předplatným nebo jednotlivými úpravami, vše přes portál Webkozar Connect.',
      },
    ],
    related: ['seo', 'webdesign'],
  },

  seo: {
    slug: '/seo-novy-jicin',
    serviceName: 'SEO optimalizace',
    kicker: 'Nový Jičín a okolí',
    h1: 'SEO optimalizace Nový Jičín',
    lead: 'SEO pro firmy z Nového Jičína a okolí, aby vás zákazníci našli. Cílíme na fráze, které vaši zákazníci opravdu hledají, a měříme, co to přineslo.',
    intro:
      'SEO u nás není jednorázová „kúra". Je to práce na webu i mimo něj: technický základ, obsah, který odpovídá na dotazy lidí, a lokální signály, aby vás Google i Seznam ukázaly u výrazů typu „vaše služba Nový Jičín".',
    blocks: [
      {
        h2: 'Technické SEO',
        p: [
          'Rychlost načítání, Core Web Vitals, mobilní verze, strukturovaná data, čisté adresy, sitemapa a indexace. Nejdřív opravíme to, co web brzdí ve vyhledávání.',
        ],
      },
      {
        h2: 'Obsah a klíčová slova',
        p: [
          'Zjistíme, co vaši zákazníci píší do vyhledávače, a podle toho poskládáme stránky a texty. Každá důležitá služba dostane vlastní stránku s vlastním nadpisem — jedna přeplácaná stránka na všechno nefunguje.',
        ],
      },
      {
        h2: 'Local SEO — Nový Jičín i Seznam',
        p: [
          'Vyladíme firemní profil na Googlu i zápis na Firmy.cz, sjednotíme název, adresu a telefon napříč webem a katalogy a pohlídáme recenze. V regionu je Seznam pořád silný, takže neřešíme jen Google.',
        ],
      },
      {
        h2: 'Měření a reporty',
        p: [
          'Na začátku si zmapujeme výchozí stav — pozice na klíčové fráze, návštěvnost z vyhledávačů a počet poptávek. Nastavíme Google Search Console a analytiku tak, aby se daly výsledky poctivě vyhodnotit.',
          'Pak pravidelně reportujeme, co se změnilo a co děláme dál. Žádné grafy pro efekt — zajímá nás návštěvnost z organiky a hlavně poptávky, které z ní přijdou.',
        ],
      },
    ],
    bullets: [
      'Analýza a návrh strategie zdarma',
      'Reporty, kterým rozumíte — pozice, návštěvnost, poptávky',
      'Technické SEO, obsah i lokál pod jednou střechou',
      'Cílíme na Novojičínsko, ne na celou ČR naslepo',
      'Bez dlouhých závazků',
    ],
    faq: [
      {
        q: 'Za jak dlouho SEO zabere?',
        a: 'První technické opravy se projeví během týdnů. U obsahu a pozic na konkurenční fráze počítejte s 3–6 měsíci. Průběžně to měříme a reportujeme.',
      },
      {
        q: 'Řešíte jen Google, nebo i Seznam?',
        a: 'Obojí. V regionu má Seznam pořád velký podíl, takže optimalizujeme i pro něj a pro katalog Firmy.cz.',
      },
      {
        q: 'Musím kvůli SEO měnit celý web?',
        a: 'Ne nutně. Často stačí technické úpravy a doplnění obsahu na stávající web. Když je web zastaralý, řekneme to na rovinu.',
      },
    ],
    related: ['tvorba', 'webdesign'],
  },

  webdesign: {
    slug: '/webdesign-novy-jicin',
    serviceName: 'Webdesign',
    kicker: 'Nový Jičín a okolí',
    h1: 'Webdesign Nový Jičín',
    lead: 'Návrh webu, který vypadá dobře a hlavně funguje — přehledně vede návštěvníka k poptávce nebo nákupu.',
    intro:
      'Webdesign pro firmy z Nového Jičína a okolí. Návrh webu u nás začíná u toho, co má web dělat, ne u dekorací — nejdřív struktura a obsah, pak vizuál, který sedí vaší značce a drží se na všech zařízeních.',
    blocks: [
      {
        h2: 'Design vedený obsahem',
        p: [
          'Rozvrhneme, co má být na které stránce a v jakém pořadí, aby návštěvník rychle našel, co hledá. Teprve pak přidáváme barvy, typografii a fotky.',
        ],
      },
      {
        h2: 'Responzivní a rychlý',
        p: [
          'Návrh testujeme na mobilu, tabletu i velkém monitoru. Lehké obrázky, moderní formáty, žádné zbytečné skripty — design nesmí brzdit načítání.',
        ],
      },
      {
        h2: 'Vaše značka, ne šablona',
        p: [
          'Vycházíme z vašeho loga a barev, případně je doladíme. Výsledek je rozpoznatelný a konzistentní napříč webem i tiskovinami.',
        ],
      },
      {
        h2: 'Od prototypu k hotovému webu',
        p: [
          'Návrh děláme v prototypu, který si můžete proklikat jako hotový web — uvidíte rozložení, texty i chování na mobilu dřív, než se napíše první řádek kódu. Připomínky zapracujeme v této fázi, kdy jsou změny rychlé a levné.',
          'Schválený design pak převedeme do kódu jedna k jedné. Stavíme ze znovupoužitelných komponent, takže web později snadno rozšíříte o další stránky ve stejném stylu.',
        ],
      },
    ],
    bullets: [
      'Návrh podle cílů webu, ne jen „aby to bylo hezké"',
      'Přístupnost a čitelnost bereme vážně',
      'Prototyp a zpětná vazba dřív, než se kóduje',
      'Konzistentní se značkou i s tiskem',
      'Předáme i podklady pro další použití',
    ],
    faq: [
      {
        q: 'Děláte jen design, nebo i hotový web?',
        a: 'Obojí. Můžeme dodat návrh pro vašeho vývojáře, nebo web rovnou postavit a spustit.',
      },
      {
        q: 'Máte i tvorbu loga?',
        a: 'Ano, logo i vizuální styl umíme vytvořit nebo sladit se stávajícím.',
      },
      {
        q: 'Uvidím návrh před spuštěním?',
        a: 'Určitě. Design procházíte a připomínkujete v prototypu ještě před kódováním.',
      },
    ],
    related: ['tvorba', 'seo'],
  },
};

export const SERVICE_LINKS = Object.values(SERVICE_LANDINGS).map((s) => ({
  name: s.serviceName,
  to: s.slug,
}));
