import './styles/main.css';
import { renderBottomNav } from './components/BottomNav';
import { renderHeader } from './components/AppHeader';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.querySelector('#app-shell');
    if (appContainer) {
        // Inject common components if the container exists
        const headerPlaceholder = document.querySelector('#header-placeholder');
        const navPlaceholder = document.querySelector('#nav-placeholder');

        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = renderHeader(headerPlaceholder.dataset.title);
        }

        if (navPlaceholder) {
            navPlaceholder.innerHTML = renderBottomNav();
        }

        // Page specific initializers
        if (window.location.pathname.includes('catalogo.html')) {
            import('./pages/catalogo').then(m => m.initCatalogo());
        }

        if (window.location.pathname.includes('tendencias.html')) {
            import('./pages/tendencias').then(m => m.initTendencias());
        }

        if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            import('./pages/index').then(m => m.initIndex());
        }

        if (window.location.pathname.includes('chat.html')) {
            import('./pages/chat').then(m => m.initChat());
        }
    }
});
