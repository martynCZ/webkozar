import { ChevronDown } from 'lucide-react';
import { PACKAGES } from '../lib/selectPackage';

// Nativní <select> stylovaný do vzhledu webu. Dřív to byl vlastní dropdown,
// který nešel ovládat klávesnicí ani čtečkou (viz AUDIT.md sekce 4). Nativní
// prvek řeší přístupnost, mobilní UI i klávesnici zadarmo; stylujeme jen
// zavřený stav (`appearance-none` + vlastní šipka), rozbalené menu vykresluje
// prohlížeč / OS.
function CustomSelect({ value, onSelect, labelId }) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        aria-labelledby={labelId}
        className="w-full appearance-none px-4 py-3 pr-11 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#0EC3BF]/50 outline-none transition-all cursor-pointer [&>option]:bg-[#0a0620] [&>option]:text-gray-200"
      >
        <option value="" disabled>
          Vyberte balíček
        </option>
        {PACKAGES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0EC3BF]"
      />
    </div>
  );
}

export default CustomSelect;
