import { NanoBananaAI } from '../utils/nanoBanana';

export async function initTendencias() {
    const carousel = document.getElementById('carousel-container');
    const foodContainer = document.getElementById('food-container');
    const decoContainer = document.getElementById('deco-container');
    const loading = document.getElementById('loading-trends');
    const refreshBtn = document.getElementById('btn-refresh');
    const sectionTrends = document.getElementById('section-trends');
    const sectionDicas = document.getElementById('section-dicas');

    if (!carousel || !foodContainer || !decoContainer) return;

    const renderItems = (items) => {
        carousel.innerHTML = '';
        foodContainer.innerHTML = '';
        decoContainer.innerHTML = '';

        items.forEach((item) => {
            const imgUrl = item.image || `https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800`;
            const type = item.categoria?.toLowerCase().includes('tendência') ? 'trend' :
                item.categoria?.toLowerCase().includes('comida') ? 'food' : 'deco';

            if (type === 'trend') {
                const card = document.createElement('div');
                card.className = 'trend-card animate-in fade-in slide-in-from-right-4 duration-700';
                card.innerHTML = `
                    <div class="bg-[#eeada7] p-4 rounded-[2rem] shadow-lg relative h-full">
                        <div class="bg-[#fdfbf7] p-2 rounded-2xl mb-4 shadow-sm h-64 overflow-hidden relative">
                            <img src="${imgUrl}" alt="${item.titulo}" class="w-full h-full object-cover rounded-xl transition-opacity duration-500 opacity-0" onload="this.classList.remove('opacity-0')">
                        </div>
                        <h2 class="font-playfair text-white text-2xl font-bold mb-2">${item.titulo}</h2>
                        <p class="text-white/90 text-[13px] leading-relaxed font-medium">
                            ${item.descricao}
                        </p>
                    </div>
                `;
                carousel.appendChild(card);
            } else {
                const card = document.createElement('div');
                card.className = 'animate-in fade-in slide-in-from-bottom-4 duration-500';
                card.innerHTML = `
                    <div class="bg-white border border-[#eeada7]/10 p-4 rounded-[2rem] shadow-sm flex gap-4 items-center">
                        <div class="size-20 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-gray-50">
                            <img src="${imgUrl}" alt="${item.titulo}" class="w-full h-full object-cover transition-opacity duration-500 opacity-0" onload="this.classList.remove('opacity-0')">
                        </div>
                        <div class="flex-1">
                            <h4 class="font-bold text-[#eeada7] text-sm mb-1">${item.titulo}</h4>
                            <p class="text-[11px] opacity-70 leading-relaxed">${item.descricao}</p>
                        </div>
                    </div>
                `;
                if (type === 'food') foodContainer.appendChild(card);
                else decoContainer.appendChild(card);
            }
        });

        loading.classList.add('hidden');
        sectionTrends.classList.remove('hidden');
        sectionDicas.classList.remove('hidden');
    };

    const loadTrends = async () => {
        if (refreshBtn) refreshBtn.classList.add('pointer-events-none', 'opacity-20');
        loading.classList.remove('hidden');
        sectionTrends.classList.add('hidden');
        sectionDicas.classList.add('hidden');

        try {
            const trends = await NanoBananaAI.getWeeklyTrends();
            renderItems(trends);
        } catch (err) {
            console.error("Falha ao carregar tendências:", err);
            loading.innerHTML = `<p class="text-center text-sm opacity-50 p-10">Miga, deu um probleminha. <br> Tente novamente!</p>`;
        } finally {
            if (refreshBtn) refreshBtn.classList.remove('pointer-events-none', 'opacity-20');
        }
    };

    if (refreshBtn) refreshBtn.onclick = loadTrends;

    // Navigation Logic
    const nextBtn = document.getElementById('next-trend');
    const prevBtn = document.getElementById('prev-trend');

    if (nextBtn) nextBtn.onclick = () => {
        const cardWidth = carousel.querySelector('.trend-card')?.offsetWidth + 24 || 300;
        carousel.scrollLeft += cardWidth;
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10) carousel.scrollLeft = 0;
    };

    if (prevBtn) prevBtn.onclick = () => {
        const cardWidth = carousel.querySelector('.trend-card')?.offsetWidth + 24 || 300;
        if (carousel.scrollLeft <= 0) carousel.scrollLeft = carousel.scrollWidth;
        else carousel.scrollLeft -= cardWidth;
    };

    loadTrends();
}
