# 🤖 AI Development Rules - Miga

This document outlines the technical standards and architectural decisions for the Miga application to ensure consistency and performance.

## 🛠️ Tech Stack

- **Vite**: High-performance build tool and development server.
- **Tailwind CSS v4**: Utility-first CSS framework for all styling and design system implementation.
- **Vanilla JavaScript (ES Modules)**: Core logic and component injection system.
- **HTML5 Canvas API**: Primary engine for client-side image composition and "Nano Banana AI" simulations.
- **Google Gemini API**: Advanced AI image generation for realistic try-ons and decorations.
- **Local Storage**: Client-side persistence for user history, favorites, and session data.
- **Material Symbols**: Standardized icon library for UI elements.
- **Google Fonts**: Typography system using *Plus Jakarta Sans* (UI), *Dancing Script* (Editorial), and *Caveat* (Sketch).

## 📏 Development Rules

### 1. Styling & Design
- **Tailwind Only**: All styling must be done via Tailwind CSS classes. Avoid custom CSS files unless defining theme variables in `src/styles/main.css`.
- **Responsive First**: Every component and page must be fully responsive, optimized for mobile-first viewing (max-width: 448px/max-w-md).
- **Editorial Aesthetic**: Maintain the "Boutique Editorial" look using the defined color palette (`primary`, `dusty-rose`, `fendi`).

### 2. Component Architecture
- **Modular JS**: UI components (like `BottomNav.js` or `AppHeader.js`) should be exported as functions that return HTML strings.
- **Injection Pattern**: Use the `DOMContentLoaded` event in `src/main.js` to inject common components into placeholders (e.g., `#nav-placeholder`).
- **File Separation**: Keep logic in `src/utils/`, components in `src/components/`, and styles in `src/styles/`.

### 3. AI & Image Processing
- **Nano Banana AI**: Always use the `NanoBananaAI` utility for image tasks.
- **Canvas Fallbacks**: Every AI feature must have a functional HTML5 Canvas fallback in case API keys are missing or limits are reached.
- **Performance**: Optimize images before processing and use `localStorage` carefully to avoid `QuotaExceededError`.

### 4. State & Data
- **Persistence**: Use `localStorage` for "My Decorations", "Try-on History", and "Favorites".
- **Clean Code**: Avoid global variables; encapsulate state within modules or specific page scripts.

### 5. Icons & Assets
- **Icons**: Use `<span class="material-symbols-outlined">icon_name</span>` for all iconography.
- **Images**: Use high-quality Unsplash placeholders or Gemini-generated assets for a premium feel.