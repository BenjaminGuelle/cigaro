# Epikura - Product Backlog

# Epikura - Product Backlog

## 📊 Informations Projet

**Nom** : Epikura (La société des épicuriens du cigare)  
**Type** : PWA Mobile-First (Ionic + Capacitor)  
**Target** : Aficionados cigares 45-65 ans  
**Positionnement** : Journal cigare personnel + Gestion de clubs premium

---

## ✅ Sprint 0 : Setup Technique - DONE

### Infrastructure
- [x] Nx monorepo créé (v21.6.4)
- [x] Angular 18 standalone components
- [x] Ionic 8 avec `provideIonicAngular`
- [x] Capacitor 6 configuré
- [x] Tailwind CSS + PostCSS moderne
- [x] Git initialisé + Push GitHub
- [x] Structure projet validée

### Configuration
- [x] Webpack remplacé par esbuild
- [x] TypeScript strict mode
- [x] Jest (tests unitaires) configuré
- [x] Playwright (E2E) configuré
- [x] ESLint + Prettier

**Date** : Octobre 2025  
**Durée** : 1 journée

---

## 🚀 MVP - Semaines 1-8 (EN COURS)

### 🗄️ Database Setup (Semaine 1)

#### Supabase Configuration
- [ ] Créer projet Supabase (gratuit)
- [ ] Configurer environnements (dev/prod)
- [ ] Setup Supabase client Angular
- [ ] Configurer Row Level Security (RLS)

#### Tables Core
- [ ] **users** : Profil utilisateur
    - id, email, first_name, last_name, pseudo
    - avatar_url, tier (free/premium), rank (initié/aficionado/connaisseur)
    - created_at, updated_at
- [ ] **clubs** : Cercles de dégustation
    - id, name, description, owner_id
    - tier (free/premium), created_at, updated_at
- [ ] **club_members** : Relations users ↔ clubs
    - user_id, club_id, role (president/vice_president/member/pending)
    - functional_role (treasurer/organizer, nullable)
    - joined_at
- [ ] **tastings** : Évaluations cigares
    - user_id, club_id (nullable), cigar_name, cigar_brand
    - rating (1-5), notes, photos (array)
    - visibility (private/club/public)
    - created_at

**Estimation** : 2 jours  
**Priorité** : CRITIQUE

---

### 🔐 Authentication (Semaine 2)

#### OAuth Social
- [ ] Google Sign-In (primary)
- [ ] Apple Sign-In (iOS requis)
- [ ] Supabase Auth configuration
- [ ] Guards Angular (auth/guest)

#### Onboarding
- [ ] Screen welcome (storytelling 30 sec)
- [ ] Choix mode : Solo vs Cercle
- [ ] Profil initial (pseudo, avatar optionnel)
- [ ] Skip possible (friction minimale)

**Estimation** : 3-4 jours  
**Priorité** : CRITIQUE

---

### 👤 Mode Solo (Semaines 3-4)

#### Journal Cigare Personnel
- [ ] Page dashboard perso
- [ ] Formulaire évaluation cigare
    - Nom, marque, vitole
    - Rating 1-5 étoiles
    - Notes texte
    - Upload photos (Supabase Storage)
- [ ] Liste évaluations privées
- [ ] Filtres et recherche
- [ ] Stats basiques (nombre, rating moyen)

#### UI Components
- [ ] Card cigare (display)
- [ ] Form cigare (input)
- [ ] Rating component (stars)
- [ ] Photo uploader

**Estimation** : 1 semaine  
**Priorité** : HAUTE

---

### 🎩 Mode Cercle (Semaines 4-6)

#### Gestion Clubs
- [ ] Créer un cercle (nom, description)
- [ ] Rejoindre un cercle (code invitation simple)
- [ ] Liste membres du cercle
- [ ] Rôles et permissions basiques

#### Événements ("Assemblées")
- [ ] Créer événement (titre, date, lieu)
- [ ] RSVP membres (Présent/Absent/Peut-être)
- [ ] Liste événements à venir
- [ ] Historique événements passés

#### Évaluations Partagées
- [ ] Toggle visibilité (privée vs cercle)
- [ ] Feed cercle (évaluations des membres)
- [ ] Filtrer par événement
- [ ] Filtrer par membre

**Estimation** : 2 semaines  
**Priorité** : HAUTE

---

### 🤖 Bilans IA (Semaine 7)

#### Génération Automatique
- [ ] Supabase Edge Function
- [ ] Intégration Claude API (Anthropic)
- [ ] Prompt engineering (agrégation dégustations)
- [ ] Stockage bilans DB

#### Affichage
- [ ] Page détail événement avec bilan
- [ ] Format markdown stylé
- [ ] Partage bilan (export PDF?)

**Estimation** : 3-4 jours  
**Priorité** : MOYENNE (différenciateur)

---

### 💎 Système de Rangs (Semaine 7)

#### Progression Automatique
- [ ] Calcul XP basé sur activité
    - 10 XP par évaluation
    - 20 XP par événement
    - 50 XP par création cercle
- [ ] Paliers : Initié (0), Aficionado (100), Connaisseur (500)
- [ ] Badge visible dans profil
- [ ] Animation progression

**Estimation** : 2 jours  
**Priorité** : BASSE (nice-to-have)

---

### 💰 Monétisation (Semaine 8)

#### Stripe Integration
- [ ] Stripe Checkout (hosted)
- [ ] Plan Premium Solo (4.99€/mois)
- [ ] Plan Premium Cercle (29€/mois, admin paie)
- [ ] Webhook Stripe → Supabase (update tier)
- [ ] Guards features premium

#### Freemium Limits
- [ ] Free : 3 évaluations/mois
- [ ] Premium : Illimité
- [ ] UI paywall élégant

**Estimation** : 3 jours  
**Priorité** : MOYENNE

---

### 🎨 Polish & Testing (Semaine 8)

#### UX/UI
- [ ] Design cohérent (thème Ionic personnalisé)
- [ ] Animations transitions
- [ ] Loading states partout
- [ ] Error handling user-friendly
- [ ] Dark mode (optionnel)

#### Tests
- [ ] Tests unitaires features critiques
- [ ] Tests E2E parcours principaux
- [ ] Tests manuels devices (iOS/Android)

**Estimation** : 3-4 jours  
**Priorité** : HAUTE

---

## 📦 V2 - Post-MVP (Mois 3-6)

### Relations Sociales

#### User Relationships
- [ ] Table `user_relationships` (amis/favoris/bloqués)
- [ ] Feature "Bloquer un user" (modération)
    - UI block/unblock
    - Filtrage queries
    - RLS Supabase
- [ ] Feature "Suivre un aficionado" (discovery)
    - Feed public dégustations
    - Liste followers/following
    - Notifications (optionnel)
- [ ] Feature "Système d'amis" (réseau privé)
    - Demandes d'amis
    - Acceptation/refus
    - Feed amis

**Estimation** : 1 semaine  
**Priorité** : MOYENNE  
**Note** : Bloqués en priorité (modération), puis Favoris, puis Amis

---

### Cave Virtuelle

#### Gestion Collection
- [ ] Table `user_cellar`
- [ ] Ajouter cigare à la cave
- [ ] Quantités en stock
- [ ] Filtres et recherche avancée
- [ ] Suggestions "À fumer bientôt"

**Estimation** : 1 semaine  
**Priorité** : MOYENNE

---

### Recommandations IA

#### Smart Suggestions
- [ ] Edge Function + Claude API
- [ ] Analyse historique dégustations
- [ ] Recommandations personnalisées
- [ ] Suggestions basées sur mood/occasion

**Estimation** : 1 semaine  
**Priorité** : BASSE (différenciateur fort mais complexe)

---

### Scan Cigare ML

#### Computer Vision
- [ ] Migration app native (Capacitor)
- [ ] Intégration ML Kit (Firebase) ou TensorFlow Lite
- [ ] Entraînement modèle (dataset cigares)
- [ ] Scan bague cigare → reconnaissance marque/modèle

**Estimation** : 3-4 semaines  
**Priorité** : BASSE (complexe, ROI incertain)  
**Requis** : App native (App Store + Google Play)

---

### Stats Avancées

#### Analytics
- [ ] Graphiques évolution (Chart.js ou Recharts)
- [ ] Comparaisons inter-membres (cercles)
- [ ] Tendances communauté
- [ ] Export données (CSV/PDF)

**Estimation** : 1 semaine  
**Priorité** : BASSE

---

### Internationalisation

#### i18n
- [ ] Angular i18n setup
- [ ] Traduction EN (priorité USA)
- [ ] Traduction DE (Allemagne)
- [ ] Traduction ES (Espagne)
- [ ] Détection locale automatique

**Estimation** : 1 semaine  
**Priorité** : HAUTE (pour scale international)  
**Timeline** : Mois 6-12

---

## 🚫 Hors Scope

### Ne pas faire (jamais ou très tard)

- ❌ E-commerce cigares (légal complexe)
- ❌ Chat en temps réel (scope creep)
- ❌ Stories/Reels type social media
- ❌ Livestream dégustations
- ❌ Matching algorithmique (dating-style)
- ❌ Blockchain/NFT (bullshit)

---

## 📈 Metrics de Succès MVP

### Objectifs Année 1
- **Users** : 800 (15 clubs + 500 solos)
- **Paying** : 120 premium solo + 10 clubs premium
- **MRR** : 890€
- **Retention** : 40% à 3 mois

### KPIs à tracker
- Taux conversion gratuit → premium
- Nombre évaluations/user/mois
- Taux activité clubs (événements créés)
- NPS (Net Promoter Score)

---

## 🛠️ Décisions Techniques Importantes

### ✅ Validées
1. **Pas d'adresse** sur users (RGPD, friction, Stripe gère)
2. **Pas de relations sociales** en MVP (clubs suffisent)
3. **PWA d'abord**, app native si succès validé
4. **Supabase gratuit** suffisant année 1
5. **Claude API** pour bilans IA (pas OpenAI)
6. **Tailwind** cohabite avec Ionic (utiliser `!important` si conflits)

### 🔄 À réévaluer
- Migration app native (si besoin scan ML ou notifs push)
- Stripe vs autre payment (si international complexe)
- Self-hosted vs Supabase Cloud (si coûts explosent)

---

## 📅 Timeline Résumé

| Phase | Durée | Objectif |
|-------|-------|----------|
| **Setup** | 1 jour | Infrastructure OK |
| **MVP Dev** | 8 semaines | Produit utilisable |
| **Beta** | 4 semaines | 5-10 clubs pilotes |
| **Launch** | Mois 4 | Marketing + onboarding |
| **V2 Features** | Mois 5-12 | Scale + international |

---

**Dernière mise à jour** : Octobre 2025  
**Prochaine review** : Fin Sprint MVP (semaine 8)