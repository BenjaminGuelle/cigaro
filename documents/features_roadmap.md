# Cigaro - Features Roadmap

> Roadmap complète des fonctionnalités par version  
> **Dernière mise à jour:** Octobre 2025

---

## 📋 Légende Priorités

- 🔴 **CRITIQUE** : Bloquant, nécessaire au MVP
- 🟡 **HAUTE** : Très important, ajout valeur significative
- 🟢 **MOYENNE** : Nice-to-have, améliore l'expérience
- ⚪ **BASSE** : Futur, pas prioritaire

---

## ✅ MVP (Semaines 1-8) - EN COURS

### 🔐 Authentication & Onboarding
**Priorité:** 🔴 CRITIQUE  
**Estimation:** 3-4 jours

- [x] Setup Supabase Auth
- [ ] Google Sign-In (OAuth)
- [ ] Apple Sign-In (OAuth, requis iOS)
- [ ] Guards Angular (auth/guest/admin)
- [ ] Screen welcome (storytelling 30 sec, skippable)
- [ ] Choix mode : Solo (Voyageur) vs Club (Cercle)
- [ ] Profil initial (pseudo, avatar optionnel)
- [ ] Skip onboarding possible (friction minimale)

---

### 👤 Mode Solo (Voyageur)
**Priorité:** 🔴 CRITIQUE  
**Estimation:** 1 semaine

#### Journal Cigare Personnel
- [ ] Page dashboard perso
- [ ] Formulaire évaluation cigare (mode quick)
    - Nom, marque, vitole
    - Rating 0-5 (demi-points)
    - Arômes (select multiple)
    - Notes texte
    - Upload photos (Supabase Storage)
- [ ] Liste évaluations privées
- [ ] Filtres et recherche
- [ ] Stats basiques (nombre, rating moyen, top cigares)

#### UI Components
- [ ] Card cigare (display)
- [ ] Form cigare (input)
- [ ] Rating component (stars avec demi-points)
- [ ] Photo uploader (drag & drop)
- [ ] Aroma picker (chips select)

---

### 🎩 Mode Club (Cercle)
**Priorité:** 🔴 CRITIQUE  
**Estimation:** 2 semaines

#### Gestion Clubs
- [ ] Créer un cercle (nom, description, logo, cover)
- [ ] Rejoindre un cercle (code invitation ou demande si public)
- [ ] Liste membres du cercle (avatars, rôles)
- [ ] Permissions basiques (president/vice_president/member)
- [ ] Quitter un club

#### Événements (Dégustations)
- [ ] Créer événement
    - Titre, description, photo
    - Date & durée
    - Lieu : chez membre (sélection) ou custom
    - Visibility : members_only / invited_only / public
    - Max participants (optionnel)
- [ ] RSVP membres (Oui/Non/Peut-être)
- [ ] Liste événements à venir
- [ ] Historique événements passés
- [ ] Détail événement avec participants

#### Évaluations Partagées
- [ ] Toggle visibilité évaluation (privée vs cercle vs public)
- [ ] Feed cercle (évaluations des membres)
- [ ] Filtrer par événement
- [ ] Filtrer par membre
- [ ] Commenter évaluations (cercle)

---

### 🤖 Bilans IA
**Priorité:** 🟡 HAUTE  
**Estimation:** 3-4 jours

- [ ] Supabase Edge Function
- [ ] Intégration Claude API (Anthropic)
- [ ] Prompt engineering (agrégation dégustations événement)
- [ ] Génération bilan markdown
- [ ] Stockage `event_reports` DB
- [ ] Page détail événement avec bilan
- [ ] Format markdown stylé
- [ ] Bouton "Générer bilan" (admins club premium)

---

### 💎 Système de Rangs
**Priorité:** 🟢 MOYENNE  
**Estimation:** 2 jours

- [ ] Calcul XP basé sur activité
    - 10 XP par évaluation
    - 20 XP par participation événement
    - 50 XP par création cercle
    - 5 XP par commentaire
    - 2 XP par reaction
- [ ] Paliers rangs :
    - Initié 🌱 (0-99 XP)
    - Aficionado 🔥 (100-499 XP)
    - Connaisseur 👑 (500+ XP)
- [ ] Badge visible profil
- [ ] Animation progression (toast notification)
- [ ] Page "Mon rang" avec progression bar

---

### 💰 Monétisation
**Priorité:** 🟡 HAUTE  
**Estimation:** 3 jours

#### Stripe Integration
- [ ] Stripe Checkout (hosted)
- [ ] Plan Premium Solo (4.99€/mois)
- [ ] Plan Premium Club Small (29€/mois, max 15 membres)
- [ ] Plan Premium Club Large (34€/mois, max 50 membres)
- [ ] Webhook Stripe → Supabase (sync `solo_plan`, `club_plan`)
- [ ] Guards features premium (Angular)
- [ ] Gestion coupons -30% (si user dans club premium)

#### Freemium Limits
- [ ] Free Solo : 3 évaluations/mois
- [ ] Premium Solo : Illimité
- [ ] Free Club : Max 15 membres, features basiques
- [ ] Premium Club : Bilans IA illimités, stats avancées
- [ ] UI paywall élégant (modal + CTA)
- [ ] Page pricing

---

### 🎨 Polish & Testing MVP
**Priorité:** 🔴 CRITIQUE  
**Estimation:** 3-4 jours

#### UX/UI
- [ ] Design cohérent (variables CSS custom)
- [ ] Animations transitions (Ionic + CSS)
- [ ] Loading states partout (skeletons)
- [ ] Error handling user-friendly (toasts, messages)
- [ ] Empty states (illustrations + CTAs)
- [ ] Dark mode support (optionnel)

#### Tests
- [ ] Tests unitaires features critiques
- [ ] Tests E2E parcours principaux (Playwright)
- [ ] Tests manuels devices (iOS/Android/Desktop)
- [ ] Performance audit (Lighthouse)

---

## 📦 V2 (Mois 3-6) - POST-MVP

### 🔍 Mode Expert Évaluation
**Priorité:** 🟡 HAUTE  
**Estimation:** 1 semaine

- [ ] Toggle mode Quick/Expert dans form
- [ ] Champs additionnels Expert :
    - Contexte : moment, situation, pairing
    - Avant allumage : cape aspect/color, touch
    - Fumage à cru : tastes/aromas
    - Grille FOIN-DIVIN-PURIN (hay/divine/manure)
    - Caractéristiques techniques (body_strength, draw, etc.)
- [ ] UI mode expert (accordéons, steps)
- [ ] Affichage détaillé évaluation expert

---

### 🛡️ Modération & Admin
**Priorité:** 🔴 CRITIQUE (si croissance)  
**Estimation:** 1 semaine

#### Reports Modération
- [ ] Bouton "Signaler" sur posts/comments/tastings/users
- [ ] Formulaire report (raison + description)
- [ ] Table `reports` DB
- [ ] Admin panel : liste reports
- [ ] Admin actions : ban/suspend user, delete content
- [ ] Table `admin_actions` (audit trail)
- [ ] Notifications admins (nouveaux reports)

#### Admin Dashboard
- [ ] Stats globales (users, clubs, tastings, events)
- [ ] Graphiques croissance
- [ ] Liste users avec filtres
- [ ] Détail user (profil + activité + historique)
- [ ] Gestion clubs (validation, suspension)
- [ ] Logs admin actions

---

### 📱 App Native (iOS + Android)
**Priorité:** 🟡 HAUTE  
**Estimation:** 2-3 semaines

- [ ] Configuration Capacitor complete
- [ ] Build iOS (Xcode)
- [ ] Build Android (Android Studio)
- [ ] App icons & splash screens
- [ ] Push notifications natives
    - Setup Firebase Cloud Messaging
    - Notifications événements
    - Notifications mentions/comments
    - Notifications bilans IA
- [ ] Deep linking (invitations clubs, events)
- [ ] App Store submission
- [ ] Google Play submission

---

### 💬 Relations Sociales
**Priorité:** 🟢 MOYENNE  
**Estimation:** 1 semaine

#### User Relationships
- [ ] Table `user_relationships`
- [ ] Feature "Bloquer un user"
    - UI block/unblock
    - Filtrage queries (masquer contenu)
    - RLS Supabase
- [ ] Feature "Suivre un aficionado" (optionnel)
    - Feed public dégustations
    - Liste followers/following
    - Notifications (optionnel)

---

### 🍷 Cave Virtuelle
**Priorité:** 🟢 MOYENNE  
**Estimation:** 1 semaine

- [ ] Table `user_cellar`
- [ ] Page "Ma Cave"
- [ ] Ajouter cigare à la cave
    - Nom, marque, vitole
    - Quantité en stock
    - Date achat
    - Notes perso
- [ ] Décrémenter stock après évaluation
- [ ] Filtres et recherche cave
- [ ] Stats cave (valeur estimée, cigares préférés)
- [ ] Suggestions "À fumer bientôt" (IA)

---

### 📊 Stats Avancées
**Priorité:** 🟢 MOYENNE  
**Estimation:** 1 semaine

- [ ] Graphiques évolution ratings (Chart.js ou Recharts)
- [ ] Comparaisons inter-membres (cercles)
- [ ] Tendances communauté (cigares populaires)
- [ ] Export données (CSV)
- [ ] Export rapport PDF (dégustation ou cave)
- [ ] Timeline activité (feed personnel)

---

### 🔔 Système Notifications
**Priorité:** 🟢 MOYENNE  
**Estimation:** 3-4 jours

- [ ] Table `notifications`
- [ ] In-app notifications
    - Badge count
    - Liste notifications
    - Mark as read
- [ ] Types notifications :
    - Invitation club
    - RSVP événement
    - Nouveau commentaire/reaction
    - Bilan IA généré
    - Nouveau membre club
    - Rank up (nouveau palier XP)
- [ ] Préférences notifications (settings user)

---

### 🌐 Internationalisation
**Priorité:** 🟡 HAUTE (pour scale)  
**Estimation:** 1 semaine

- [ ] Angular i18n setup
- [ ] Extraction textes FR
- [ ] Traduction EN (priorité USA/UK)
- [ ] Traduction DE (Allemagne)
- [ ] Traduction ES (Espagne)
- [ ] Détection locale automatique
- [ ] Sélecteur langue (settings)
- [ ] Formatage dates/nombres selon locale

---

## 🚀 V3 (Année 2) - SCALE

### 🤖 Recommandations IA
**Priorité:** 🟢 MOYENNE  
**Estimation:** 2 semaines

- [ ] Edge Function + Claude API
- [ ] Analyse historique dégustations user
- [ ] Recommandations personnalisées cigares
- [ ] Suggestions basées sur :
    - Profil gustatif (arômes/tastes préférés)
    - Mood/occasion (moments, situations)
    - Similarité avec autres users (collaborative filtering)
- [ ] Page "Recommandations" avec explications
- [ ] "Pourquoi ce cigare ?" (justification IA)

---

### 📸 Scan Cigare ML
**Priorité:** ⚪ BASSE  
**Estimation:** 3-4 semaines

- [ ] App native requis (Capacitor)
- [ ] Intégration ML Kit (Firebase) ou TensorFlow Lite
- [ ] Dataset cigares (bagues, packaging)
- [ ] Entraînement modèle reconnaissance
- [ ] UI scan (camera overlay)
- [ ] Scan bague cigare → reconnaissance marque/modèle
- [ ] Auto-fill formulaire évaluation
- [ ] Fallback search manuelle si échec

---

### 📅 Intégration Calendrier
**Priorité:** 🟢 MOYENNE  
**Estimation:** 3-4 jours

- [ ] Ajouter événement au calendrier device (Capacitor Calendar API)
- [ ] Sync bidirectionnel (optionnel)
- [ ] Rappels événements (push notifications)
- [ ] Import events depuis Google Calendar/iCal

---

### 💬 Chat Club (Messaging)
**Priorité:** 🟢 MOYENNE  
**Estimation:** 2 semaines

- [ ] Table `messages` + `conversations`
- [ ] Chat temps réel (Supabase Realtime)
- [ ] Conversation par club
- [ ] Messages privés entre membres (optionnel)
- [ ] Upload photos/vidéos dans chat
- [ ] Notifications nouveaux messages
- [ ] Badge unread count

---

### 🗳️ Sondages Dates Événements
**Priorité:** ⚪ BASSE  
**Estimation:** 3-4 jours

- [ ] Table `date_polls`
- [ ] Créer sondage dates (multi-choix)
- [ ] Vote membres
- [ ] Fermeture automatique sondage
- [ ] Création event avec date gagnante

---

### 💰 Cotisations Club
**Priorité:** ⚪ BASSE  
**Estimation:** 1 semaine

- [ ] Table `club_fees`
- [ ] Configuration montant cotisation (admin club)
- [ ] Demande paiement membres
- [ ] Intégration Stripe (split payment)
- [ ] Suivi paiements
- [ ] Rappels automatiques

---

### 📷 Galeries Photos Événements
**Priorité:** 🟢 MOYENNE  
**Estimation:** 3-4 jours

- [ ] Album photos par événement
- [ ] Upload multiple photos (tous participants)
- [ ] Galerie événement (lightbox)
- [ ] Tagging membres sur photos
- [ ] Téléchargement album complet (ZIP)

---

## 🔮 V4 (Année 3+) - AVANCÉ

### 🏆 Gamification Avancée
**Priorité:** ⚪ BASSE

- [ ] Badges achievements
    - "Premier cigare cubain"
    - "10 événements participés"
    - "Explorateur" (50 cigares différents)
    - etc.
- [ ] Leaderboards clubs/communauté
- [ ] Défis mensuels
- [ ] Récompenses (badges exclusifs)

---

### 🌍 Carte Clubs & Événements
**Priorité:** 🟢 MOYENNE

- [ ] Carte interactive (Mapbox/Leaflet)
- [ ] Afficher clubs publics proximité
- [ ] Afficher événements publics proximité
- [ ] Filtres carte (distance, date)
- [ ] Rejoindre club depuis carte

---

### 🎥 Vidéos Événements
**Priorité:** ⚪ BASSE

- [ ] Upload vidéos événements
- [ ] Player vidéo intégré
- [ ] Compression vidéos (Supabase Edge Functions)
- [ ] Thumbnails auto-générés

---

### 🤝 Partenariats Marques
**Priorité:** 🟢 MOYENNE (business)

- [ ] Programme ambassadeurs
- [ ] Contenus sponsorisés
- [ ] Codes promos partenaires
- [ ] Affiliation cave à cigares
- [ ] Revenue share

---

### 📚 Wiki Cigares Communautaire
**Priorité:** ⚪ BASSE

- [ ] Table `cigars` (base de données)
- [ ] Fiche cigare détaillée
    - Histoire, origine
    - Notes communauté
    - Stats (rating moyen, popularité)
- [ ] Contribution utilisateurs
- [ ] Modération wiki

---

## 🚫 Hors Scope (Ne PAS faire)

### Jamais ou très tard

- ❌ **E-commerce cigares** : Légal trop complexe (tabac réglementé)
- ❌ **Chat temps réel global** : Scope creep, pas la value prop
- ❌ **Stories/Reels** : Pas TikTok, on reste focus cigare
- ❌ **Livestream dégustations** : Complexité technique >>> value
- ❌ **Matching algorithmique** : Pas un dating app
- ❌ **Blockchain/NFT** : Bullshit, inutile
- ❌ **Jeux/mini-games** : Hors scope

---

## 📊 Priorisation Stratégique

### Critères Décision
1. **Impact User** : Améliore l'expérience significativement ?
2. **Différenciation** : Unique vs concurrence ?
3. **Effort/Valeur** : ROI développement ?
4. **Business** : Génère revenus ou rétention ?

### Focus Année 1-2
- ✅ **Bilans IA** : Différenciateur #1
- ✅ **Mode Expert** : Pour aficionados sérieux
- ✅ **App Native** : Crédibilité + notifications
- ✅ **International** : x28 le marché

### Nice-to-have Année 2-3
- Cave virtuelle
- Recommendations IA
- Stats avancées
- Chat club

### Futur lointain
- Scan ML
- Wiki communautaire
- Gamification avancée

---

**Dernière mise à jour:** Octobre 2025  
**Prochaine review:** Fin MVP (Semaine 8)