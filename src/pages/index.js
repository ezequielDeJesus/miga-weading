import { db } from '../services/databaseService';

export async function initIndex() {
    const greetingName = document.querySelector('h2.font-handwritten');
    const journeySteps = document.querySelectorAll('.journey-step');

    if (!greetingName || journeySteps.length === 0) return;

    try {
        // Simulação de busca de perfil (usando o primeiro perfil encontrado para demonstração)
        const profiles = await db.getAll('user_profiles');
        const profile = profiles[0] || { full_name: 'Beatriz', current_step: 3 };

        // 1. Atualizar Saudação
        greetingName.textContent = `Oi, ${profile.full_name.split(' ')[0]}`;

        // 2. Atualizar Journey Tracker
        const currentStep = profile.current_step;

        journeySteps.forEach((step, index) => {
            const stepNum = index + 1;
            const dot = step.querySelector('.journey-dot');
            const label = step.querySelector('.journey-label');

            if (stepNum < currentStep) {
                // Concluído
                step.classList.remove('active');
                if (dot) {
                    dot.className = 'journey-dot !bg-primary scale-110 !opacity-100 flex items-center justify-center';
                    dot.innerHTML = '<span class="material-symbols-outlined text-[6px] text-white fill-1">check</span>';
                }
                if (label) label.classList.add('opacity-80');
            } else if (stepNum === currentStep) {
                // Ativo
                step.classList.add('active');
                if (dot) {
                    dot.className = 'journey-dot';
                    dot.innerHTML = '';
                }
                if (label) label.classList.remove('opacity-30', 'opacity-80');
            } else {
                // Bloqueado
                step.classList.remove('active');
                if (dot) {
                    dot.className = 'journey-dot opacity-30';
                    dot.innerHTML = '';
                }
                if (label) label.classList.add('opacity-30');
            }
        });

        // Atualizar contador textual
        const stepTracker = document.querySelector('span.text-primary.px-3.py-1');
        if (stepTracker) {
            stepTracker.textContent = `${currentStep} de 6 etapas`;
        }

    } catch (err) {
        console.error('Erro ao inicializar Index:', err);
    }
}
