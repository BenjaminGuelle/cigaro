# Cigaro - Design System & Brand Guidelines

## 🎨 Palette Couleur

### Couleurs Primaires
```css
/* Base neutre - accessibilité WCAG AA */
--bg-primary: #FAFAF9;           /* Off-white, warmth subtile */
--bg-secondary: #F5F4F2;         /* Cards, sections */
--text-primary: #1A1A1A;         /* Noir doux, meilleur que #000 */
--text-secondary: #6B6B6B;       /* Texte secondaire, labels */

/* Accents terroir - inspiration cigare */
--tobacco-light: #D4A574;        /* Cedar, bois clair */
--tobacco-medium: #A67C52;       /* Tobacco leaf, accent principal */
--tobacco-dark: #8B5A3C;         /* Wrapper foncé, hover states */

/* Premium touches */
--gold-subtle: #E6C068;          /* Or doux, pas flashy */
--gold-accent: #D4AF37;          /* Actions premium, badges rang */

/* Status & Feedback */
--success: #059669;              /* Vert naturel */
--warning: #D97706;              /* Orange tobacco */
--error: #DC2626;                /* Rouge discret */
--info: #0891B2;                 /* Bleu cyan */
```

### Couleurs Contextuelles
```css
/* Navigation */
--tab-active: var(--tobacco-medium);
--tab-inactive: var(--text-secondary);

/* Évaluations */
--rating-star: var(--gold-accent);
--rating-empty: #E5E7EB;

/* Premium Features */
--premium-badge: var(--gold-subtle);
--premium-border: var(--gold-accent);
```

## ✍️ Typography

### Font Stack
**Primaire :** Inter Variable (moderne, lisible, web-optimized)
**Alternative :** SF Pro (iOS) / Roboto (Android) system fallback

### Hiérarchie
```css
/* Headers */
--h1: 32px/1.2, 700;            /* Page titles */
--h2: 24px/1.3, 600;            /* Section headers */
--h3: 20px/1.4, 600;            /* Card titles */
--h4: 18px/1.4, 500;            /* Subsections */

/* Body */
--body-large: 16px/1.5, 400;    /* Principal content */
--body: 14px/1.5, 400;          /* Standard text */
--body-small: 12px/1.4, 400;    /* Captions, metadata */

/* UI Elements */
--button: 16px/1.2, 500;        /* Buttons, CTAs */
--label: 14px/1.3, 500;         /* Form labels */
--caption: 11px/1.3, 400;       /* Timestamps, subtle info */
```

## 🌊 Style "Liquid" - Design Tokens

### Border Radius
```css
--radius-small: 8px;            /* Chips, badges */
--radius-medium: 12px;          /* Cards, inputs */
--radius-large: 20px;           /* Modals, major components */
--radius-organic: 16px 20px 18px 14px; /* Liquid effect subtil */
```

### Shadows & Elevation
```css
--shadow-subtle: 0 1px 3px rgba(0,0,0,0.08);
--shadow-medium: 0 4px 12px rgba(0,0,0,0.12);
--shadow-strong: 0 8px 24px rgba(0,0,0,0.16);

/* Tobacco-tinted shadows pour warmth */
--shadow-warm: 0 4px 12px rgba(139,90,60,0.1);
```

### Gradients (Liquid Style)
```css
--gradient-premium: linear-gradient(135deg, var(--gold-subtle) 0%, var(--tobacco-light) 100%);
--gradient-card: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
--gradient-evaluation: linear-gradient(135deg, var(--tobacco-light) 0%, var(--tobacco-medium) 100%);
```

## 📱 Component Styling

### Cards
- Background: `var(--bg-secondary)` ou gradient subtil
- Border radius: `var(--radius-medium)` ou `var(--radius-organic)`
- Shadow: `var(--shadow-subtle)`
- Padding: 16px-20px

### Buttons
**Primary (Actions principales)**
- Background: `var(--tobacco-medium)`
- Text: `white`
- Hover: `var(--tobacco-dark)`

**Premium (Features payantes)**
- Background: `var(--gradient-premium)`
- Text: `var(--text-primary)`
- Border: `1px solid var(--gold-accent)`

**Secondary**
- Background: `transparent`
- Border: `1px solid var(--tobacco-light)`
- Text: `var(--tobacco-medium)`

### Form Elements
- Background: `var(--bg-primary)`
- Border: `1px solid var(--tobacco-light)`
- Focus: `2px solid var(--tobacco-medium)`
- Radius: `var(--radius-medium)`

## 🎯 Identité Visuelle

### Ton & Voice
- Premium mais accessible
- Expertise sans intimidation
- Convivialité chaleureuse
- Respect de la tradition + modernité

### Iconographie
- Style outline/minimal
- Inspiration: terroir, artisanat, voyage
- Cohérence avec palette tobacco
- Taille standard: 20px, 24px pour navigation

### Photos & Illustrations
- Tons chauds naturels
- Grain texture subtile (rappel papier/tabac)
- Éclairage doux, ambiance cosy
- Éviter les contrastes trop forts

## 🚀 Guidelines d'Usage

### À faire
✅ Utiliser les organic radius avec parcimonie (accents)
✅ Privilégier contraste élevé pour accessibilité
✅ Gradients subtils uniquement sur éléments premium
✅ Cohérence des espaces (8px grid system)

### À éviter
❌ Surcharger avec trop d'effets liquid
❌ Mélanger trop de tobacco shades dans un écran
❌ Oublier les états hover/focus/disabled
❌ Négliger la lisibilité pour l'esthétique

---

**Version:** 1.0  
**Dernière mise à jour:** Octobre 2025  
**Status:** Baseline pour développement MVP