import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, MessageSquare } from 'lucide-react';

function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
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
  // Stabilní inkrementální ID (Date.now() při renderu je nečisté a může kolidovat)
  const nextIdRef = useRef(2);
  const makeId = () => nextIdRef.current++;

  // Automatické scrollování dolů při nové zprávě
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const newUserMsg = { id: makeId(), sender: 'user', text: text };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/ai-api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // PŘIDÁN PARAMETR type: "chat"
        body: JSON.stringify({ message: text, type: 'chat' }) 
      });

      if (!response.ok) throw new Error('Chyba sítě');
      
      const aiData = await response.json();
      
      let botText = '';
      if (aiData.error) {
        botText = aiData.error;
      } else {
        botText = aiData.reply; // LiveChat očekává klíč 'reply'
      }

      setMessages(prev => [...prev, { id: makeId(), sender: 'bot', text: botText }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: makeId(), 
        sender: 'bot', 
        text: 'Omlouváme se, spojení s AI se nezdařilo. Napište nám prosím raději na e-mail.' 
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
                  <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
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
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Zprávy (Scrollable Area) */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-[#0EC3BF] to-purple-600 text-white rounded-tr-sm shadow-[0_5px_15px_rgba(14,195,191,0.2)]' 
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                  }`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {/* Jednoduché vykreslení tučného textu pro název balíčku */}
                    {msg.text.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="text-[#0EC3BF] font-bold">{part}</strong> : part
                    )}
                  </div>
                </div>
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
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Napište zprávu..."
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
        onClick={() => setIsOpen(!isOpen)}
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
        
        {/* Odznak pro upozornění / Jiskry */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] rounded-full border-2 border-[#050117] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">1</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}

export default LiveChatWidget;