import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PACKAGES } from '../lib/selectPackage';

function CustomSelect({ value, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = PACKAGES.find((opt) => opt.value === value) || null;

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-[#938D9C] flex justify-between items-center hover:bg-white/10 transition-all"
      >
        {selected ? selected.label : "Vyberte balíček"}
        {<ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''} w-5 h-5 text-[#0EC3BF]`} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0620] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
          {PACKAGES.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-[#0EC3BF]/20 cursor-pointer text-gray-200 hover:text-white transition-colors"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
