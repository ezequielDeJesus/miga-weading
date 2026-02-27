export function renderHeader(title = "Miga") {
  const isChat = title.toLowerCase().includes('chat');
  const isMiga = title === 'Miga';

  return `
    <header class="flex items-center justify-between p-4 pt-6 bg-[#fdfbf7]/80 backdrop-blur-md sticky top-0 z-40">
      <button class="size-10 flex items-center justify-center bg-white/50 rounded-full border border-[#225373]/5 hover:bg-white transition-colors">
        <span class="material-symbols-outlined text-[#5f5f5f]">${isMiga ? 'menu' : 'arrow_back'}</span>
      </button>
      
      <div class="flex flex-col items-center">
        <div class="flex items-center gap-1">
           <h1 class="text-[#225373] text-2xl font-black uppercase tracking-tighter">${title}</h1>
        </div>
        ${isMiga ? '<p class="text-[8px] font-black tracking-[0.2em] uppercase text-[#5f5f5f] -mt-1 opacity-60">Bestie Bridal Guide</p>' : ''}
      </div>

      <button class="size-10 flex items-center justify-center bg-white/50 rounded-full border border-[#225373]/5 relative hover:bg-white transition-colors">
        <span class="material-symbols-outlined text-[#5f5f5f]">${isChat ? 'more_vert' : 'notifications'}</span>
        ${isMiga ? '<span class="absolute top-2.5 right-2.5 size-2.5 bg-[#225373] rounded-full border-2 border-white shadow-sm"></span>' : ''}
      </button>
    </header>
  `;
}
