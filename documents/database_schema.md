# Epikura - Database Schema

> Schéma de base de données Supabase (PostgreSQL)  
> **Version:** 1.1 - Mise à jour Octobre 2025

---

## 🔄 Changelog

**v1.1 (Octobre 2025)**
- ✅ Ajout `address JSONB` sur `users` (localisation optionnelle)
- ✅ Refonte abonnements : distinction `solo_plan` vs `club_plan`
- ✅ Refonte `events.location` : structure complète avec privacy
- ✅ Support plans club : `free`, `premium_small`, `premium_large`

---

## users ✅

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  pseudo VARCHAR(50) UNIQUE,
  avatar_url TEXT,
  
  -- Localisation (optionnelle, pour recherche clubs proximité)
  address JSONB,
  
  -- Status
  active BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
  
  -- Abonnement SOLO (indépendant des clubs)
  solo_plan VARCHAR(20) DEFAULT 'free' CHECK (solo_plan IN ('free', 'premium')),
  solo_subscription_id VARCHAR(255), -- Stripe subscription ID
  
  -- Gamification
  rank VARCHAR(20) DEFAULT 'initie' CHECK (rank IN ('initie', 'aficionado', 'connaisseur')),
  xp INTEGER DEFAULT 0,
  
  -- Privacy
  privacy_settings JSONB DEFAULT '{"profile_public": true, "email_visible": false, "show_rank": true, "show_tastings_count": true, "show_clubs": true, "show_location": false}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_pseudo ON users(pseudo);
CREATE INDEX idx_users_solo_plan ON users(solo_plan);
CREATE INDEX idx_users_profile_public ON users ((privacy_settings->>'profile_public'));
CREATE INDEX idx_users_address_city ON users ((address->>'city'));
CREATE INDEX idx_users_address_country ON users ((address->>'country'));
```

**Structure address JSONB :**
```json
{
  "address": "12 rue de la Paix",
  "additional_address": "Appartement 3B",
  "city": "Paris",
  "zip": "75002",
  "country": "FR"
}
```

**Notes :**
- `address` nullable : optionnel, utilisé pour recherche clubs proximité
- `solo_plan` : abonnement individuel (free ou premium 4.99€/mois)
- Réduction -30% si user dans club premium (géré par Stripe coupons)
- `solo_subscription_id` : référence Stripe pour webhook sync

---

## clubs ✅

```sql
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  logo_url TEXT,
  email VARCHAR(255),
  owner_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  
  -- Adresse (lieu par défaut des événements)
  address JSONB,
  
  -- Abonnement CLUB
  club_plan VARCHAR(20) DEFAULT 'free' CHECK (club_plan IN ('free', 'premium_small', 'premium_large')),
  club_subscription_id VARCHAR(255), -- Stripe subscription ID
  
  -- Visibilité
  invitation_code VARCHAR(20) UNIQUE,
  is_public BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clubs_owner ON clubs(owner_id);
CREATE INDEX idx_clubs_invitation_code ON clubs(invitation_code);
CREATE INDEX idx_clubs_is_public ON clubs(is_public);
CREATE INDEX idx_clubs_club_plan ON clubs(club_plan);
```

**Structure address JSONB :**
```json
{
  "address": "12 rue de la Paix",
  "additional_address": "Bâtiment A, 3ème étage",
  "city": "Paris",
  "zip": "75002",
  "country": "FR"
}
```

**Plans club :**
- `free` : Max 15 membres, features basiques
- `premium_small` : Max 15 membres, 29€/mois, full features
- `premium_large` : Max 50 membres, 34€/mois, full features

**Notes :**
- Admin club paie l'abonnement club
- Membres dans club premium bénéficient de réduction -30% sur leur `solo_plan` premium

---

## club_members ✅

```sql
CREATE TABLE club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('president', 'vice_president', 'member')),
  functional_role VARCHAR(20) CHECK (functional_role IN ('treasurer', 'organizer')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('invited', 'active', 'inactive')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, club_id)
);

CREATE INDEX idx_club_members_user ON club_members(user_id);
CREATE INDEX idx_club_members_club ON club_members(club_id);
CREATE INDEX idx_club_members_role ON club_members(role);
CREATE INDEX idx_club_members_status ON club_members(status);
```

**Rôles hiérarchiques** : `president`, `vice_president`, `member`  
**Rôles fonctionnels** (optionnel) : `treasurer`, `organizer`  
**Status** : `invited` (invitation en attente), `active` (membre actif), `inactive` (ancien membre)

---

## events ✅

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  photo_url TEXT,
  
  -- === LIEU DE L'ÉVÉNEMENT (refonte complète) ===
  
  -- Type de lieu
  location_type VARCHAR(20) NOT NULL DEFAULT 'custom' 
    CHECK (location_type IN ('member_home', 'custom')),
  
  -- Si chez un membre : référence user (snapshot nom + lien profil)
  location_host_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Nom du lieu (toujours rempli)
  location_name VARCHAR(200) NOT NULL,
  -- Exemples : "Pierre Martin", "Restaurant Le Churchill", "Bar Le Havane"
  
  -- Adresse structurée (toujours remplie, snapshot)
  location_address JSONB NOT NULL,
  -- Si member_home : copie de users.address au moment création (historique préservé)
  -- Si custom : remplie manuellement
  
  -- Privacy : qui peut voir l'adresse ?
  address_visible_to VARCHAR(20) DEFAULT 'confirmed_only' 
    CHECK (address_visible_to IN ('all', 'confirmed_only')),
  -- 'all' : tous membres du club
  -- 'confirmed_only' : uniquement RSVP = 'yes'
  
  -- Instructions complémentaires (optionnel)
  location_notes TEXT,
  -- Exemples : "Code porte 1234", "Parking gratuit rue adjacente", "Sonner interphone"
  
  -- === FIN LIEU ===
  
  event_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 180,
  max_participants INTEGER,
  visibility VARCHAR(20) DEFAULT 'members_only' CHECK (visibility IN ('members_only', 'public')),
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_club ON events(club_id);
CREATE INDEX idx_events_date ON events(event_date DESC);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_visibility ON events(visibility);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_location_type ON events(location_type);
CREATE INDEX idx_events_location_host ON events(location_host_id);
```

**Structure location_address JSONB :**
```json
{
  "address": "12 rue de la Paix",
  "additional_address": "Appartement 3B",
  "city": "Paris",
  "zip": "75002",
  "country": "FR"
}
```

**Cas d'usage location :**

| Cas | location_type | location_host_id | location_name | location_address |
|-----|---------------|------------------|---------------|------------------|
| Chez membre (adresse profil) | `member_home` | ✅ UUID | "Pierre Martin" | Copie `users.address` |
| Chez membre (autre adresse) | `member_home` | ✅ UUID | "Pierre Martin" | Manuel (ex: maison campagne) |
| Chez membre (sans adresse) | `member_home` | ✅ UUID | "Pierre Martin" | Manuel |
| Restaurant / Autre | `custom` | ❌ NULL | "Restaurant Le Churchill" | Manuel |

**Notes :**
- **Snapshot address** : L'adresse est copiée au moment création, pas de JOIN dynamique
- Si membre déménage, events passés gardent l'ancienne adresse (historique)
- `location_host_id` sert à afficher avatar membre + lien profil dans UI
- Privacy `confirmed_only` par défaut pour "chez membre"

---

## event_rsvps ✅

```sql
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'maybe' CHECK (status IN ('yes', 'no', 'maybe')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user ON event_rsvps(user_id);
CREATE INDEX idx_event_rsvps_status ON event_rsvps(status);
```

---

## event_reports ✅

```sql
CREATE TABLE event_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE UNIQUE,
  report_markdown TEXT NOT NULL,
  summary_short TEXT,
  participants_count INTEGER,
  tastings_count INTEGER,
  top_cigars JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generated_by VARCHAR(50) DEFAULT 'claude-sonnet-4.5',
  token_count INTEGER,
  generation_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_reports_event ON event_reports(event_id);
CREATE INDEX idx_event_reports_generated ON event_reports(generated_at DESC);
```

**Structure top_cigars** : `[{"name": "Cohiba Behike 52", "avg_rating": 4.8, "tasting_count": 5}, ...]`  
**Note** : Bilan IA simplifié MVP (agrégation data + template). V2+ : analyse sémantique avancée.

---

## posts ✅

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  title VARCHAR(200),
  description TEXT,
  media_urls TEXT[],
  tasting_id UUID REFERENCES tastings(id) ON DELETE SET NULL,
  visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'club', 'public')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_club ON posts(club_id);
CREATE INDEX idx_posts_tasting ON posts(tasting_id);
CREATE INDEX idx_posts_visibility ON posts(visibility);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
```

---

## comments ✅

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  commentable_type VARCHAR(20) NOT NULL CHECK (commentable_type IN ('event', 'post', 'tasting')),
  commentable_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  deleted_by UUID REFERENCES users(id),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_commentable ON comments(commentable_type, commentable_id);
CREATE INDEX idx_comments_is_deleted ON comments(is_deleted);
CREATE INDEX idx_comments_created ON comments(created_at DESC);
```

**Modération** : Soft delete (`is_deleted`) pour historique et analytics. UI filtre automatiquement les supprimés.

---

## likes ✅

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  likeable_type VARCHAR(20) NOT NULL CHECK (likeable_type IN ('event', 'post', 'tasting', 'comment')),
  likeable_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, likeable_type, likeable_id)
);

CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_likeable ON likes(likeable_type, likeable_id);
```

**Comportement** : Toggle classique (click = like, re-click = unlike via DELETE row)

---

## taste_options ✅

```sql
CREATE TABLE taste_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('hay', 'divine', 'manure')),
  label_fr VARCHAR(100) NOT NULL,
  label_en VARCHAR(100),
  description_fr TEXT,
  description_en TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_taste_options_category ON taste_options(category);
CREATE INDEX idx_taste_options_active ON taste_options(is_active);
```

**Note** : Référentiel pour grille FOIN-DIVIN-PURIN (Hay-Divine-Manure) des goûts avec descriptions pédagogiques.

---

## aroma_options ✅

```sql
CREATE TABLE aroma_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('hay', 'divine', 'manure')),
  family VARCHAR(50),
  label_fr VARCHAR(100) NOT NULL,
  label_en VARCHAR(100),
  description_fr TEXT,
  description_en TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aroma_options_category ON aroma_options(category);
CREATE INDEX idx_aroma_options_family ON aroma_options(family);
CREATE INDEX idx_aroma_options_active ON aroma_options(is_active);
```

**Familles** : herbacé, boisé, sous-bois, épicé, poivré, fruité, animal, empyreumatique, divers  
**Exemples descriptions** : "Cèdre, pin, bois résineux, bois fumé, bois humide, mousse de chêne, liège, sciure, écorce"

---

## tastings ✅

```sql
CREATE TABLE tastings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Identification cigare
  cigar_name VARCHAR(200) NOT NULL,
  cigar_brand VARCHAR(100),
  vitola VARCHAR(100),
  
  -- Rating avec demi-points (0, 0.5, 1, 1.5, ..., 5)
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  
  -- Mode évaluation
  is_expert_mode BOOLEAN DEFAULT false,
  
  -- === MODE QUICK (toujours rempli) ===
  aromas TEXT[],
  tasting_notes TEXT,
  
  -- === MODE EXPERT (optionnel) ===
  
  -- Contexte
  smoked_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  moment VARCHAR(20),
  situation VARCHAR(50),
  pairing VARCHAR(200),
  
  -- Avant allumage
  cape_aspect VARCHAR(50),
  cape_color VARCHAR(50),
  touch VARCHAR(50),
  
  -- Fumage à cru
  raw_smoke_tastes TEXT[],
  raw_smoke_aromas TEXT[],
  
  -- Dégustation détaillée (codes références taste/aroma_options)
  tastes_hay TEXT[],
  tastes_divine TEXT[],
  tastes_manure TEXT[],
  aromas_hay TEXT[],
  aromas_divine TEXT[],
  aromas_manure TEXT[],
  
  -- Caractéristiques techniques (ENUMs - migration tables possible V2+)
  body_strength VARCHAR(50) CHECK (body_strength IN ('light', 'medium', 'full', 'heavy')),
  aroma_variety VARCHAR(50) CHECK (aroma_variety IN ('poor', 'modest', 'moderate', 'rich', 'generous', 'opulent', 'captivating', 'very_captivating')),
  draw VARCHAR(50) CHECK (draw IN ('difficult', 'correct', 'too_easy')),
  terroir VARCHAR(50) CHECK (terroir IN ('pronounced', 'sensitive', 'nonexistent')),
  balance VARCHAR(50) CHECK (balance IN ('good', 'jerky', 'smooth')),
  ash_nature VARCHAR(50) CHECK (ash_nature IN ('regular', 'irregular', 'clean')),
  final_impression VARCHAR(50) CHECK (final_impression IN ('fullness', 'heaviness', 'dryness', 'flatness', 'lightness', 'freshness')),
  aromatic_persistence VARCHAR(50) CHECK (aromatic_persistence IN ('long', 'medium', 'short')),
  
  -- Media
  photos TEXT[],
  
  -- Metadata
  visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'club', 'public')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tastings_user ON tastings(user_id);
CREATE INDEX idx_tastings_club ON tastings(club_id);
CREATE INDEX idx_tastings_event ON tastings(event_id);
CREATE INDEX idx_tastings_cigar_name ON tastings(cigar_name);
CREATE INDEX idx_tastings_rating ON tastings(rating);
CREATE INDEX idx_tastings_mode ON tastings(is_expert_mode);
CREATE INDEX idx_tastings_aromas ON tastings USING gin(aromas);
```

**Note stratégie** : Champs techniques en ENUMs (types TS côté app). Migration vers tables référentielles possible V2+ si feedbacks users nécessitent admin UI.

---

## 📋 Résumé Modèle Abonnements

### Indépendance Solo vs Club

**Abonnement SOLO (user individuel) :**
- `users.solo_plan` : `free` (3 éval/mois) ou `premium` (illimité, 4.99€/mois)
- Prix : 4.99€/mois (ou 3.49€/mois si dans club premium via coupon Stripe)
- Géré par Stripe subscriptions individuelles

**Abonnement CLUB (admin paie) :**
- `clubs.club_plan` : `free`, `premium_small` (29€/mois), `premium_large` (34€/mois)
- Admin paie l'abonnement club
- Donne accès features club premium (bilans IA illimités, stats avancées, branding)

**Réduction croisée :**
- User avec `solo_plan = premium` ET membre d'un club avec `club_plan = premium_*`
- → Bénéficie réduction -30% sur son abo solo (4.99€ → 3.49€)
- Géré par coupons Stripe appliqués via webhooks

### Limites

| Plan Club | Max membres | Prix/mois |
|-----------|-------------|-----------|
| `free` | 15 | 0€ |
| `premium_small` | 15 | 29€ |
| `premium_large` | 50 | 34€ |

---

## 🔒 Row Level Security (RLS)

**À implémenter lors du setup Supabase :**

```sql
-- Users : profil public si privacy_settings.profile_public = true
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles visible" ON users FOR SELECT 
  USING ((privacy_settings->>'profile_public')::boolean = true OR auth.uid() = id);

-- Clubs : publics visibles, privés uniquement aux membres
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public clubs visible" ON clubs FOR SELECT 
  USING (is_public = true OR id IN (
    SELECT club_id FROM club_members WHERE user_id = auth.uid()
  ));

-- Events : membres du club uniquement (sauf si visibility = public)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Club events visible to members" ON events FOR SELECT 
  USING (
    visibility = 'public' OR 
    club_id IN (SELECT club_id FROM club_members WHERE user_id = auth.uid())
  );

-- Tastings : visibilité selon users.visibility
ALTER TABLE tastings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tastings visibility" ON tastings FOR SELECT 
  USING (
    user_id = auth.uid() OR
    (visibility = 'club' AND club_id IN (SELECT club_id FROM club_members WHERE user_id = auth.uid())) OR
    visibility = 'public'
  );
```

---

## 📊 Exemple Données

### User avec adresse
```json
{
  "id": "uuid-123",
  "email": "pierre@example.com",
  "first_name": "Pierre",
  "last_name": "Martin",
  "pseudo": "PierreM",
  "address": {
    "address": "12 rue de la Paix",
    "city": "Paris",
    "zip": "75002",
    "country": "FR"
  },
  "solo_plan": "premium",
  "solo_subscription_id": "sub_1234567890",
  "rank": "aficionado",
  "xp": 250
}
```

### Event chez membre
```json
{
  "id": "uuid-456",
  "club_id": "uuid-club-1",
  "title": "Dégustation Cohiba Behike",
  "location_type": "member_home",
  "location_host_id": "uuid-123",
  "location_name": "Pierre Martin",
  "location_address": {
    "address": "12 rue de la Paix",
    "city": "Paris",
    "zip": "75002",
    "country": "FR"
  },
  "address_visible_to": "confirmed_only",
  "location_notes": "Code porte 1234, 3ème étage",
  "event_date": "2025-11-15T19:30:00Z"
}
```

### Event restaurant
```json
{
  "id": "uuid-789",
  "club_id": "uuid-club-1",
  "title": "Soirée cigares cubains",
  "location_type": "custom",
  "location_host_id": null,
  "location_name": "Restaurant Le Churchill",
  "location_address": {
    "address": "5 rue de Presbourg",
    "city": "Paris",
    "zip": "75016",
    "country": "FR"
  },
  "address_visible_to": "all",
  "location_notes": "Réservation au nom du club, parking gratuit",
  "event_date": "2025-11-20T19:00:00Z"
}
```

---

## 🚀 Migration depuis v1.0

```sql
-- 1. Users : Ajouter address + refonte abonnement
ALTER TABLE users ADD COLUMN address JSONB;
ALTER TABLE users RENAME COLUMN plan TO solo_plan;
ALTER TABLE users ADD COLUMN solo_subscription_id VARCHAR(255);
CREATE INDEX idx_users_solo_plan ON users(solo_plan);
CREATE INDEX idx_users_address_city ON users ((address->>'city'));
CREATE INDEX idx_users_address_country ON users ((address->>'country'));

-- 2. Clubs : Refonte plans + subscription_id
ALTER TABLE clubs DROP CONSTRAINT clubs_plan_check;
ALTER TABLE clubs RENAME COLUMN plan TO club_plan;
ALTER TABLE clubs ADD CONSTRAINT clubs_club_plan_check 
  CHECK (club_plan IN ('free', 'premium_small', 'premium_large'));
ALTER TABLE clubs ADD COLUMN club_subscription_id VARCHAR(255);
CREATE INDEX idx_clubs_club_plan ON clubs(club_plan);

-- 3. Events : Refonte complète location
ALTER TABLE events ADD COLUMN location_type VARCHAR(20) DEFAULT 'custom' 
  CHECK (location_type IN ('member_home', 'custom'));
ALTER TABLE events ADD COLUMN location_host_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE events ADD COLUMN location_name VARCHAR(200);
ALTER TABLE events ADD COLUMN location_address JSONB;
ALTER TABLE events ADD COLUMN address_visible_to VARCHAR(20) DEFAULT 'confirmed_only' 
  CHECK (address_visible_to IN ('all', 'confirmed_only'));
ALTER TABLE events ADD COLUMN location_notes TEXT;

-- Migrer données existantes si nécessaire
UPDATE events 
SET location_name = location,
    location_address = jsonb_build_object('address', location)
WHERE location IS NOT NULL;

-- Supprimer ancien champ
ALTER TABLE events DROP COLUMN location;

-- Rendre champs required après migration
ALTER TABLE events ALTER COLUMN location_type SET NOT NULL;
ALTER TABLE events ALTER COLUMN location_name SET NOT NULL;
ALTER TABLE events ALTER COLUMN location_address SET NOT NULL;

-- Indexes
CREATE INDEX idx_events_location_type ON events(location_type);
CREATE INDEX idx_events_location_host ON events(location_host_id);
```

---

**Version:** 1.1  
**Dernière mise à jour:** Octobre 2025  
**Status:** ✅ Validé et prêt pour implémentation MVP