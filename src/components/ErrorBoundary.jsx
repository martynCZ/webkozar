import { Component } from 'react';

// Poslední záchrana: když kterákoli komponenta při renderu spadne, nezůstane
// prázdná bílá stránka, ale krátká hláška s možností obnovit. Musí to být
// class komponenta – hooky `componentDidCatch` / `getDerivedStateFromError`
// nemají. Nepoužívá `window` na úrovni modulu, takže projde i SSR/prerenderem.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Bez externího monitoringu – aspoň do konzole, ať se dá dohledat.
    console.error('Neošetřená chyba v renderu:', error, info);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 bg-[#050117] px-6 text-center"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Něco se pokazilo
        </h1>
        <p className="max-w-md text-gray-400">
          Omlouváme se, stránku se nepodařilo zobrazit. Zkuste ji prosím načíst
          znovu, nebo nás kontaktujte na{' '}
          <a href="mailto:info@webkozar.cz" className="text-[#0EC3BF] hover:underline">
            info@webkozar.cz
          </a>
          .
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          className="rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 px-6 py-3 font-medium text-white shadow-[0_0_25px_rgba(14,195,191,0.45)] transition-shadow hover:shadow-[0_0_40px_rgba(14,195,191,0.65)]"
        >
          Načíst znovu
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
