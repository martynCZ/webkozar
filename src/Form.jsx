import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Mail, Phone, MapPin, Clock } from 'lucide-react';
import CustomSelect from './components/CustomSelect';

function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    balicek: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const handlePrefill = (e) => {
      setFormData(prev => ({ ...prev, balicek: e.detail }));
    };

    window.addEventListener('prefillPackage', handlePrefill);
    return () => window.removeEventListener('prefillPackage', handlePrefill);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://new.webkozar.cz/send-email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', balicek: '', message: '' });
        setTimeout(() => {
          setStatus('idle');
        }, 3000);

      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="relative md:py-24 px-4 scroll-mt-8 min-h-screen mb-12" id="kontakt">
      <div className="max-w-[95%] md:max-w-[80%] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Pojďme vytvořit něco{' '}
            <motion.span className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent" animate={{ backgroundPosition: ["0% center", "-200% center"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              úžasného
            </motion.span>
          </h2>
          <p className="text-xl text-gray-400">Kontaktujte nás a my vám pomůžeme s vaším projektem</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col h-full shadow-[0_0_40px_rgba(14,195,191,0.05)]">
            <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Napište nám</h3>

            {status === 'success' ? (
              <div className="text-center py-20 text-[#0EC3BF] flex flex-col items-center h-full justify-center">
                <Check className="w-16 h-16 mb-4 p-3 rounded-full bg-[#0EC3BF]/20 border border-[#0EC3BF]/50" />
                <p className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Zpráva byla úspěšně odeslána!</p>
                <p className="text-gray-400 mt-2">Brzy se vám ozveme zpět.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col flex-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <label className='text-sm text-gray-300 font-medium'>Jméno a příjmení</label>
                <input required type="text" autoComplete='name' value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Vaše jméno" className="mt-2 w-full mb-4 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#0EC3BF]/50 outline-none transition-all" />

                <label className='text-sm text-gray-300 font-medium'>E-mail</label>
                <input required type="email" autoComplete='email' value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Váš e-mail" className="mt-2 w-full mb-4 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#0EC3BF]/50 outline-none transition-all" />

                <label className='text-sm text-gray-300 font-medium mb-2 block'>Balíček</label>
                <CustomSelect value={formData.balicek} onSelect={(val) => setFormData({ ...formData, balicek: val })} />

                <label className='text-sm text-gray-300 mt-4 block font-medium'>Zpráva</label>
                <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Popište svůj projekt..." className="mt-2 w-full mb-6 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#0EC3BF]/50 outline-none h-32 resize-none flex-1" />

                {status === 'error' && (
                  <p role="alert" className="mb-4 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám napište přímo na{' '}
                    <a href="mailto:info@webkozar.cz" className="underline hover:text-red-200">info@webkozar.cz</a>.
                  </p>
                )}

                <button type="submit" disabled={status === 'sending'} className="mt-auto w-full px-8 py-4 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-bold shadow-[0_0_30px_rgba(14,195,191,0.4)] hover:shadow-[0_0_50px_rgba(14,195,191,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {status === 'sending' ? 'Odesílám...' : 'Odeslat zprávu'}
                </button>
              </form>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col h-full"
          >
            <div className="relative flex-1 p-8 rounded-3xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_40px_rgba(14,195,191,0.15)] group flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none transition-all duration-700 group-hover:bg-[#0EC3BF]/20" />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Kontaktní údaje
                </h3>

                <div className="space-y-8">
                  <div className="flex items-start gap-5 group/item">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[#0EC3BF] group-hover/item:scale-110 group-hover/item:bg-[#0EC3BF]/10 transition-all duration-300 shadow-[0_0_15px_rgba(14,195,191,0.1)]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>E-mail</p>
                      <a href="mailto:info@webkozar.cz" className="text-xl font-bold text-white hover:text-[#0EC3BF] transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        info@webkozar.cz
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group/item">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[#0EC3BF] group-hover/item:scale-110 group-hover/item:bg-[#0EC3BF]/10 transition-all duration-300 shadow-[0_0_15px_rgba(14,195,191,0.1)]">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Telefon</p>
                      <a href="tel:+420736262009" className="text-xl font-bold text-white hover:text-[#0EC3BF] transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        +420 736 262 009
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group/item">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[#0EC3BF] group-hover/item:scale-110 group-hover/item:bg-[#0EC3BF]/10 transition-all duration-300 shadow-[0_0_15px_rgba(14,195,191,0.1)]">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Lokace</p>
                      <p className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Nový Jičín / Ostrava
                      </p>
                      <p className="text-gray-400 mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Moravskoslezský kraj</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group/item">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[#0EC3BF] group-hover/item:scale-110 group-hover/item:bg-[#0EC3BF]/10 transition-all duration-300 shadow-[0_0_15px_rgba(14,195,191,0.1)]">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Pracovní doba</p>
                      <p className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Po - Pá: 9:00 - 17:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 p-6 rounded-2xl bg-[#050117]/50 border border-white/10 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#0EC3BF] to-purple-600" />
                <div className="relative z-10 pl-2">
                  <h4 className="text-white font-bold mb-2 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Fakturační údaje
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-sm mt-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <div>
                      <p className="text-gray-500 mb-0.5">IČO</p>
                      <p className="text-gray-300 font-medium">72996293</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-0.5">DIČ</p>
                      <p className="text-gray-300 font-medium">CZ7802015298</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-0.5">Adresa</p>
                      <p className="text-gray-300 font-medium">Malá Strana 298, 742 47 Hladké Životice</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-0.5">Osoba</p>
                      <p className="text-gray-300 font-medium">Petr Kozar</p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Fyzická osoba zapsaná v Živnostenském rejstříku od 2.4.2001
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Form;