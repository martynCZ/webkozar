import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, MessageSquare, Check, ArrowRight } from 'lucide-react';
import { selectPackageAndScroll, PACKAGES } from '../lib/selectPackage';
import { OPEN_CHAT_EVENT } from '../lib/openChat';

// Sekce, na které smí AI odscrollovat (musí sedět s whitelistem v ai-api.php).
const AKCE_SEKCE = new Set(['cenik', 'kontakt', 'faq', 'reference', 'tvorba', 'technologie', 'connect']);

const PACKAGE_LABEL = Object.fromEntries(PACKAGES.map((p) => [p.value, p.label]));

// **tučný** text → <strong>
const renderRich = (text) =>
  String(text).split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-[#0EC3BF] font-bold">{part}</strong> : part,
  );

// Karta poptávky – návštěvník si překontroluje údaje od AI a sám potvrdí odeslání.
function LeadCard({ lead, onSubmit, onCancel }) {
  const { jmeno, email, telefon, balicek, shrnuti, status } = lead;
  const rows = [
    ['Jméno', jmeno],
    ['E-mail', email],
    telefon && ['Telefon', telefon],
    balicek && ['Balíček', PACKAGE_LABEL[balicek] || balicek],
    shrnuti && ['Poptávka', shrnuti],
  ].filter(Boolean);

  return (
    <div className="flex w-full justify-start">
      <div
        className="max-w-[90%] w-full rounded-2xl rounded-tl-sm bg-white/5 border border-[#0EC3BF]/30 p-4 text-sm text-gray-200"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <p className="font-bold text-white mb-2">Zkontrolujte poptávku</p>
        <dl className="space-y-1 mb-3">
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="text-gray-400 shrink-0 w-16">{k}:</dt>
              <dd className="text-gray-200 break-words min-w-0">{v}</dd>
            </div>
          ))}
        </dl>

        {status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={onSubmit}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-semibold cursor-pointer"
            >
              <Send className="w-4 h-4" /> Odeslat poptávku
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Zrušit
            </button>
          </div>
        )}
        {status === 'sending' && <p className="text-[#0EC3BF]">Odesílám…</p>}
        {status === 'sent' && (
          <p className="flex items-center gap-1.5 text-[#0EC3BF] font-semibold">
            <Check className="w-4 h-4" /> Odesláno. Ozveme se na {email}.
          </p>
        )}
        {status === 'error' && (
          <div className="text-gray-300">
            <p className="mb-2 text-red-400">Odeslání selhalo.</p>
            <button
              onClick={onSubmit}
              className="px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Zkusit znovu
            </button>
          </div>
        )}
        {status === 'cancelled' && <p className="text-gray-500">Zrušeno.</p>}
      </div>
    </div>
  );
}

// Karta odhadu ceny – nahrazuje bývalý wizard v ceníku (doporučený balíček +
// cenový rozsah + krátké zdůvodnění + tlačítko rovnou poptat).
function EstimateCard({ estimate, onSelect }) {
  const { balicek, cena, zduvodneni } = estimate;
  return (
    <div className="flex w-full justify-start">
      <div
        className="max-w-[90%] w-full rounded-2xl rounded-tl-sm bg-gradient-to-br from-[#0EC3BF]/15 to-purple-600/10 border border-[#0EC3BF]/40 p-4 text-sm"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <p className="text-gray-300 mb-1">Doporučený balíček</p>
        <p className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {PACKAGE_LABEL[balicek] || balicek}
        </p>
        {cena && (
          <p className="text-2xl font-bold text-[#0EC3BF] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {cena}
          </p>
        )}
        {zduvodneni && <p className="text-gray-300 mb-3 leading-relaxed">{renderRich(zduvodneni)}</p>}
        <button
          onClick={() => onSelect(balicek)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-semibold cursor-pointer"
        >
          Poptat tento balíček <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Odznak „1" = uvítací zpráva, kterou si návštěvník ještě nepřečetl.
  // Po prvním otevření chatu v dané relaci zmizí (žádný trvalý dark pattern).
  const [hasOpened, setHasOpened] = useState(() => {
    try {
      return sessionStorage.getItem('wk-chat-opened') === '1';
    } catch {
      return false;
    }
  });
  
  // Historie konverzace (výchozí stav obsahuje první zprávu robota)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Vítejte! 👋 Zrovna tu možná nejsme, ale náš AI asistent je připraven vám poradit. S čím vám dnes pomůžeme?',
    }
  ]);

  // Rychlé volby (Bubliny)
  const quickOptions = [
    { label: "Chci web na míru 💻", query: "Zajímá mě web na míru, popiš mi balíček." },
    { label: "Jaké máte ceny? 💰", query: "Jaké máte ceny a balíčky webů?" },
    { label: "Jak probíhá spolupráce? 🤝", query: "Jak přesně probíhá tvorba webu od A do Z?" }
  ];

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fabRef = useRef(null);
  // Stabilní inkrementální ID (Date.now() při renderu je nečisté a může kolidovat)
  const nextIdRef = useRef(2);
  const makeId = () => nextIdRef.current++;

  // Chat je plovoucí panel, ne blokující overlay (zbytek stránky zůstává
  // funkční), takže bez `aria-modal` a scroll-locku. Ale: Esc zavírá, po
  // otevření jde fokus do vstupu, po zavření zpět na plovoucí tlačítko.
  useEffect(() => {
    if (!isOpen) return undefined;

    const fab = fabRef.current;
    const raf = requestAnimationFrame(() => inputRef.current?.focus?.());
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      // Po zavření vrátit fokus na spouštěč.
      fab?.focus?.();
    };
  }, [isOpen]);

  // Automatické scrollování dolů při nové zprávě
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Otevření chatu = uvítací zpráva přečtena → odznak „1" zmizí (i pro příště
  // v rámci relace). Řeší se tady, ne v efektu, ať nevzniká kaskádový render.
  const openChat = () => {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      try {
        sessionStorage.setItem('wk-chat-opened', '1');
      } catch {
        // sessionStorage nedostupné (privátní režim) — nevadí.
      }
    }
  };

  // Otevření zvenčí (CustomEvent z ceníku apod.), volitelně s uvítací zprávou.
  useEffect(() => {
    const onOpen = (e) => {
      setIsOpen(true);
      setHasOpened(true);
      try {
        sessionStorage.setItem('wk-chat-opened', '1');
      } catch { /* prázdné */ }

      const botMessage = e.detail?.botMessage;
      if (botMessage) {
        setMessages((prev) =>
          prev[prev.length - 1]?.text === botMessage
            ? prev
            : [...prev, { id: makeId(), sender: 'bot', text: botMessage }],
        );
      }
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  // Posledních N zpráv jako kontext pro AI (bez uvítací hlášky bota a bez
  // právě odesílané zprávy). Bot si tak pamatuje předchozí repliky.
  const HISTORY_TURNS = 10;
  const buildHistory = () =>
    messages
      .filter((m) => m.id !== 1 && typeof m.text === 'string') // bez uvítací hlášky a bez karet poptávky
      .slice(-HISTORY_TURNS)
      .map((m) => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        content: m.text,
      }));

  // Strop délky konverzace (ochrana nákladů + brání zneužití bota jako free GPT).
  const MAX_USER_MESSAGES = 20;

  // Akce od AI. Scrollovací zavřou panel (jinak by na mobilu scroll zůstal
  // schovaný za chatem). Poptávka se NEODESÍLÁ sama – jen se návštěvníkovi
  // zobrazí karta s údaji k překontrolování a tlačítkem Odeslat.
  const performAkce = (akce) => {
    if (!akce || typeof akce !== 'object') return;

    if (akce.typ === 'predvypln_formular' && akce.balicek) {
      setIsOpen(false);
      setTimeout(() => selectPackageAndScroll(akce.balicek), 250);
      return;
    }
    if (akce.typ === 'prejdi_na' && AKCE_SEKCE.has(akce.sekce)) {
      setIsOpen(false);
      setTimeout(() => {
        document.getElementById(akce.sekce)?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
      return;
    }
    if (akce.typ === 'navrhnout_poptavku' && akce.email && akce.jmeno) {
      setMessages((prev) => [...prev, {
        id: makeId(),
        sender: 'bot',
        lead: {
          jmeno: akce.jmeno,
          email: akce.email,
          telefon: akce.telefon || '',
          balicek: akce.balicek || '',
          shrnuti: akce.shrnuti || '',
          status: 'pending',
        },
      }]);
      return;
    }
    if (akce.typ === 'odhad_ceny' && akce.balicek) {
      setMessages((prev) => [...prev, {
        id: makeId(),
        sender: 'bot',
        estimate: {
          balicek: akce.balicek,
          cena: akce.cena || '',
          zduvodneni: akce.zduvodneni || '',
        },
      }]);
    }
  };

  // Odeslání poptávky – spouští návštěvník tlačítkem na kartě, ne AI.
  const submitLead = async (msgId) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg?.lead || (msg.lead.status !== 'pending' && msg.lead.status !== 'error')) return;
    const { jmeno, email, telefon, balicek, shrnuti } = msg.lead;

    const setStatus = (status) =>
      setMessages((prev) => prev.map((m) =>
        m.id === msgId ? { ...m, lead: { ...m.lead, status } } : m));

    setStatus('sending');
    const parts = [shrnuti];
    if (telefon) parts.push(`Telefon: ${telefon}`);
    parts.push('(Odesláno přes AI chat po potvrzení návštěvníkem.)');
    try {
      const res = await fetch('/send-email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: jmeno, email, balicek, message: parts.join('\n\n') }),
      });
      const data = await res.json().catch(() => null);
      setStatus(res.ok && data?.status === 'success' ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const cancelLead = (msgId) =>
    setMessages((prev) => prev.map((m) =>
      m.id === msgId ? { ...m, lead: { ...m.lead, status: 'cancelled' } } : m));

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userCount = messages.filter((m) => m.sender === 'user').length;
    if (userCount >= MAX_USER_MESSAGES) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          sender: 'bot',
          text: 'Tahle konverzace už je pěkně dlouhá. 🙂 Napište nám prosím přes **formulář níže** nebo na **info@webkozar.cz** a domluvíme se na detailech.',
        },
      ]);
      setInputValue('');
      return;
    }

    const history = buildHistory();
    const newUserMsg = { id: makeId(), sender: 'user', text: text };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/ai-api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, type: 'chat', history })
      });

      // Endpoint i při chybě vrací JSON { error }. Nevyhazovat na !ok –
      // přišli bychom o rozlišení „vyčerpaný limit" (429) od výpadku.
      const aiData = await response.json().catch(() => null);

      let botText;
      if (response.status === 429) {
        botText = aiData?.error
          || 'Vyčerpali jste limit dotazů na AI asistenta. Zkuste to prosím za pár minut, nebo nám napište přes **formulář níže**.';
      } else if (!response.ok || !aiData) {
        botText = 'Omlouváme se, spojení s AI se teď nezdařilo. Zkuste to prosím za chvíli, nebo nám napište na **info@webkozar.cz**.';
      } else if (aiData.error) {
        botText = aiData.error;
      } else {
        botText = aiData.reply; // LiveChat očekává klíč 'reply'
      }

      setMessages(prev => [...prev, { id: makeId(), sender: 'bot', text: botText }]);

      // Případná akce až po vykreslení potvrzovací zprávy.
      if (!aiData?.error && response.ok) performAkce(aiData?.akce);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: makeId(),
        sender: 'bot',
        text: 'Omlouváme se, spojení s AI se nezdařilo. Napište nám prosím raději na **info@webkozar.cz**.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* Vlastní okno chatu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-labelledby="livechat-title"
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[350px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl overflow-hidden bg-[#050117]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(14,195,191,0.15)]"
          >
            {/* Hlavička chatu */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0EC3BF]/20 to-purple-600/20 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#0EC3BF] to-purple-600 shadow-[0_0_15px_rgba(14,195,191,0.4)]">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 id="livechat-title" className="text-white font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    AI Asistent webkozar
                  </h3>
                  <p className="text-xs text-[#0EC3BF] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#0EC3BF] animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Zavřít chat"
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Zprávy (Scrollable Area) */}
            <div
              className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.map((msg) => (
                msg.lead ? (
                  <LeadCard
                    key={msg.id}
                    lead={msg.lead}
                    onSubmit={() => submitLead(msg.id)}
                    onCancel={() => cancelLead(msg.id)}
                  />
                ) : msg.estimate ? (
                  <EstimateCard
                    key={msg.id}
                    estimate={msg.estimate}
                    onSelect={(balicek) => {
                      setIsOpen(false);
                      setTimeout(() => selectPackageAndScroll(balicek), 250);
                    }}
                  />
                ) : (
                  <div
                    key={msg.id}
                    className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-[#0EC3BF] to-purple-600 text-white rounded-tr-sm shadow-[0_5px_15px_rgba(14,195,191,0.2)]'
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                    }`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {renderRich(msg.text)}
                    </div>
                  </div>
                )
              ))}

              {/* Bubliny rychlých voleb (Zobrazí se jen pokud je v chatu pouze 1 zpráva) */}
              {messages.length === 1 && (
                <div className="flex flex-col items-end gap-2 mt-2">
                  {quickOptions.map((option, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleSendMessage(option.query)}
                      className="px-4 py-2 rounded-full text-sm border border-[#0EC3BF]/50 text-gray-300 hover:text-white hover:bg-[#0EC3BF]/20 transition-all cursor-pointer shadow-[0_0_10px_rgba(14,195,191,0.1)]"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Indikátor psaní */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                    <span className="w-2 h-2 bg-[#0EC3BF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#0EC3BF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#0EC3BF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Spodní Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Napište zprávu..."
                  aria-label="Napište zprávu"
                  className="w-full bg-[#050117]/50 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0EC3BF]/50 focus:shadow-[0_0_15px_rgba(14,195,191,0.2)] transition-all"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-2 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-opacity"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-500">Powered by Webkozar AI</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Tlačítko */}
      <motion.button
        ref={fabRef}
        onClick={() => (isOpen ? setIsOpen(false) : openChat())}
        aria-label={isOpen ? 'Zavřít chat' : 'Otevřít chat s AI asistentem'}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-[0_0_30px_rgba(14,195,191,0.4)] transition-colors duration-300 z-50 cursor-pointer ${
          isOpen 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-gradient-to-br from-[#0EC3BF] to-purple-600 border border-transparent'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-8 h-8 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageSquare className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Odznak nepřečtené uvítací zprávy — jen dokud chat poprvé neotevřeš. */}
        {!isOpen && !hasOpened && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] rounded-full border-2 border-[#050117] flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-white text-[10px] font-bold">1</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}

export default LiveChatWidget;