import { db } from '../services/databaseService';

export async function initCatalogo() {
    const catalogContainer = document.querySelector('#main-content');
    if (!catalogContainer) return;

    try {
        const items = await db.getAll('catalog_items');

        // Limpar conteúdo estático de exemplo (mantendo apenas o topo)
        const header = catalogContainer.querySelector('.pt-4.px-2');
        catalogContainer.innerHTML = '';
        if (header) catalogContainer.appendChild(header);

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'polaroid-rose rounded-sm mt-8';
            itemElement.innerHTML = `
                <div class="aspect-[4/5] bg-white rounded-sm mb-4 relative group overflow-hidden">
                    <img src="${item.image_url}"
                        alt="${item.title}"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute bottom-4 right-4 flex flex-col gap-2">
                        <button class="size-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white like-btn" data-id="${item.id}">
                            <span class="material-symbols-outlined text-sm">favorite</span>
                        </button>
                        <button class="size-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                            <span class="material-symbols-outlined text-sm">share</span>
                        </button>
                    </div>
                </div>
                <h3 class="font-handwritten text-2xl text-[#5f5f5f]">${item.title}</h3>
                <p class="text-xs text-[#5f5f5f]/80 leading-relaxed max-w-[90%]">${item.description}</p>
                <p class="text-[8px] font-handwritten font-black uppercase text-[#5f5f5f]/40 mt-4 tracking-widest">
                    Moodboard: ${item.moodboard_reference || 'Geral'}
                </p>
            `;
            catalogContainer.appendChild(itemElement);
        });
    } catch (err) {
        console.error('Erro ao carregar catálogo:', err);
    }
}
