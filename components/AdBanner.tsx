export function AdEditorial() {
  return (
    <div className="my-6">
      <p className="text-center text-[8px] tracking-[2px] uppercase text-white/20 mb-2 font-lora">
        · Sponsored ·
      </p>
      <div className="border border-[#C8A96E]/20 p-4 flex items-center gap-4">
        <div className="w-14 h-14 bg-[#1e1c15] flex-shrink-0 flex items-center justify-center text-[8px] text-[#5a5040] font-sans uppercase">
          LOGO
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[8px] tracking-[2px] uppercase text-[#C8A96E]/60 font-lora mb-1">
            Sponsored · TechWeekly
          </p>
          <p className="font-playfair font-bold text-sm text-[#F5F0E8] mb-1">
            The AI Regulation Handbook 2025
          </p>
          <p className="text-[10px] text-[#F5F0E8]/40 font-lora">
            Everything you need to understand the EU AI Act.
          </p>
        </div>
        <button className="flex-shrink-0 text-[8px] tracking-[1px] uppercase border border-[#C8A96E]/50 text-[#C8A96E] px-3 py-2 font-lora whitespace-nowrap">
          Learn more
        </button>
      </div>
    </div>
  );
}

export function AdBold() {
  return (
    <div className="my-6">
      <p className="text-center text-[8px] tracking-[2px] uppercase text-white/20 mb-2 font-lora">
        · Sponsored ·
      </p>
      <div className="bg-[#1a1710] border-l-2 border-[#C8A96E] p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#C8A96E] flex items-center justify-center flex-shrink-0 text-[#111109] font-bold text-lg">
          N
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[8px] tracking-[2px] uppercase text-[#C8A96E] font-lora mb-1">
            Sponsored · Notion AI
          </p>
          <p className="font-playfair font-bold text-sm text-[#F5F0E8] mb-1">
            Think clearer. Work faster.
          </p>
          <p className="text-[10px] text-[#F5F0E8]/40 font-lora">
            Your AI-powered workspace — now with smarter docs.
          </p>
        </div>
        <button className="flex-shrink-0 text-[8px] tracking-[1px] uppercase bg-[#C8A96E] text-[#111109] px-3 py-2 font-bold whitespace-nowrap font-sans">
          Try free
        </button>
      </div>
    </div>
  );
}