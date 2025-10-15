# Cigaro - Database Schema

> Schéma de base de données Supabase (PostgreSQL)  
> **Version:** 2.0 - Validation finale Octobre 2025

---

## 🔄 Changelog

**v2.0 (Octobre 2025 - FINAL)**
- ✅ Ajout `user_role` pour admins plateforme (user/moderator/admin/super_admin)
- ✅ Suppression `users.active` (redondant avec `status`)
- ✅ Ajout champs `clubs`: `contact_email`, `cover_photo_url`, `founded_at`, `member_count`, `settings`
- ✅ Modification `events.visibility`: ajout `invited_only`
- ✅ Suppression CHECK hardcodés dans `tastings`, création table `tasting_attributes`
- ✅ Ajout soft delete sur `posts`
- ✅ Renommage `likes` → `reactions` avec `reaction_type`
- ✅ Ajout metadata IA dans `event_reports`
- ✅ Nouvelles tables: `tasting_attributes`, `admin_actions`, `reports`

**v1.1 (Octobre 2025)**
- Ajout `address JSONB` sur `users`
- Refonte abonnements : distinction `solo_plan` vs `club_plan`
- Refonte `events.location` : structure complète avec privacy
- Support plans club : `free`, `premium_small`, `premium_large`

---

## 🛡️ ADMINISTRATION & MODÉRATION

### admin_actions ✅

```sql
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type VARCHAR(50) NOT NULL,
  -- 'ban_user', 'suspend_user', 'delete_post', 'delete_comment', 
  -- 'approve_club', 'reject_report', 'feature_tasting', etc.
  target_type VARCHAR(20) NOT NULL,
  -- 'user', 'club', 'post', 'tasting', 'comment', 'event', etc.
  target_id UUID NOT NULL,
  reason TEXT,
  metadata JSONB,
  -- Données additionnelles contextuelles
  -- Ex: {"previous_status": "active", "new_status": "suspended", "duration_days": 7}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_type, target_id);
CREATE INDEX idx_admin_actions_created ON admin_actions(created_at DESC);
```

**Usage :** Audit trail complet de toutes les actions admin. Permet de tracer qui a fait quoi, quand, et pourquoi.

---

### reports ✅

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reported_type VARCHAR(20) NOT NULL CHECK (reported_type IN ('user', 'post', 'tasting', 'comment', 'club', 'event')),
  reported_id UUID NOT NULL,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'harassment', 'fake', 'violence', 'other')),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_reported ON reports(reported_type, reported_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created ON reports(created_at DESC);
```

**Usage :** Système de modération communautaire. Les users peuvent signaler du contenu inapproprié, les admins/modérateurs review dans l'app admin.

---

## 👤 UTILISATEURS

### users ✅

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
  
  -- Status (remplace "active" boolean)
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'deleted')),
  
  -- Rôle plateforme (admin système)
  user_role VARCHAR(20) DEFAULT 'user' CHECK (user_role IN ('user', 'moderator', 'admin', 'super_admin')),
  
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
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_user_role ON users(user_role);
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

**Rôles plateforme :**
- `user` : Utilisateur normal
- `moderator` : Modération contenu (review reports, ban users, delete posts/comments)
- `admin` : Full access stats + gestion users/clubs + modération
- `super_admin` : Tout + gérer autres admins + settings plateforme

**Notes :**
- `address` nullable : optionnel, utilisé pour recherche clubs proximité
- `solo_plan` : abonnement individuel (free ou premium 4.99€/mois)
- Réduction -30% si user dans club premium (géré par Stripe coupons)
- `solo_subscription_id` : référence Stripe pour webhook sync

---

## 🎩 CLUBS & MEMBRES

### clubs ✅

```sql
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_photo_url TEXT,
  contact_email VARCHAR(255), -- Email public pour demandes adhésion
  owner_id UUID REFERENCES users(id) ON DELETE RESTRICT,
  
  -- Adresse (lieu par défaut des événements)
  address JSONB,
  
  -- Abonnement CLUB
  club_plan VARCHAR(20) DEFAULT 'free' CHECK (club_plan IN ('free', 'premium_small', 'premium_large')),
  club_subscription_id VARCHAR(255), -- Stripe subscription ID
  
  -- Dénormalisation pour performance
  member_count INTEGER DEFAULT 0,
  
  -- Visibilité
  invitation_code VARCHAR(20) UNIQUE,
  is_public BOOLEAN DEFAULT true,
  
  -- Metadata
  founded_at DATE,
  settings JSONB DEFAULT '{}',
  -- Ex: {"notifications_enabled": true, "auto_approve_members": false}
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clubs_owner ON clubs(owner_id);
CREATE INDEX idx_clubs_invitation_code ON clubs(invitation_code);
CREATE INDEX idx_clubs_is_public ON clubs(is_public);
CREATE INDEX idx_clubs_club_plan ON clubs(club_plan);
CREATE INDEX idx_clubs_member_count ON clubs(member_count);
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
- `member_count` : dénormalisé pour perf, mis à jour via trigger (voir section Migration)

---

### club_members ✅

```sql
CREATE TABLE club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('president', 'vice_president', 'member')),
  functional_role VARCHAR(20) CHECK (functional_role IN ('treasurer', 'organizer')),
  status VARCHAR(20) DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'suspended', 'left')),
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
**Status** :
- `invited` : Invitation en attente
- `active` : Membre actif
- `suspended` : Membre suspendu temporairement
- `left` : Ancien membre (soft delete, garde historique)

---

## 🗓️ ÉVÉNEMENTS

### events ✅

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  photo_url TEXT,
  
  -- === LIEU DE L'ÉVÉNEMENT ===
  
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
  visibility VARCHAR(20) DEFAULT 'members_only' CHECK (visibility IN ('members_only', 'invited_only', 'public')),
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

**Visibility options :**
- `members_only` : Tous les membres du club voient l'event
- `invited_only` : Seulement ceux avec RSVP voient l'event (event privé)
- `public` : Visible hors du club

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

### event_rsvps ✅

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

**Note :** Si `events.visibility='invited_only'`, seuls les users avec un RSVP (peu importe status) peuvent voir l'event.

---

### event_reports ✅

```sql
CREATE TABLE event_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE UNIQUE,
  report_markdown TEXT NOT NULL,
  summary_short TEXT,
  participants_count INTEGER,
  tastings_count INTEGER,
  top_cigars JSONB,
  
  -- Metadata IA
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generated_by VARCHAR(50) DEFAULT 'claude-sonnet-4.5',
  model_version VARCHAR(50),
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  generation_time_ms INTEGER,
  error_log TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_reports_event ON event_reports(event_id);
CREATE INDEX idx_event_reports_generated ON event_reports(generated_at DESC);
```

**Structure top_cigars** :
```json
[
  {"name": "Cohiba Behike 52", "avg_rating": 4.8, "tasting_count": 5},
  {"name": "Padron 1964", "avg_rating": 4.5, "tasting_count": 3}
]
```

**Note** : Bilan IA simplifié MVP (agrégation data + template). V2+ : analyse sémantique avancée.

---

## 🔥 DÉGUSTATIONS

### tasting_attributes ✅

```sql
CREATE TABLE tasting_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  -- 'body_strength', 'aroma_variety', 'draw', 'terroir', 'balance', 
  -- 'ash_nature', 'final_impression', 'aromatic_persistence', 'moment', 'situation'
  code VARCHAR(50) NOT NULL,
  label_fr VARCHAR(100) NOT NULL,
  label_en VARCHAR(100),
  description_fr TEXT,
  description_en TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, code)
);

CREATE INDEX idx_tasting_attributes_category ON tasting_attributes(category);
CREATE INDEX idx_tasting_attributes_active ON tasting_attributes(is_active);
```

**Usage :** Référentiel pour tous les attributs techniques des dégustations. Remplace les CHECK hardcodés, permet gestion via UI admin.

**Exemples de seeds :**
```sql
-- Body strength
('body_strength', 'light', 'Léger', 'Light', 'Corps léger, facile à fumer', 1),
('body_strength', 'medium', 'Moyen', 'Medium', 'Corps moyen, équilibré', 2),
('body_strength', 'full', 'Corsé', 'Full', 'Corps corsé, puissant', 3),
('body_strength', 'heavy', 'Très corsé', 'Heavy', 'Très puissant, pour experts', 4),

-- Draw
('draw', 'difficult', 'Difficile', 'Difficult', 'Tirage serré', 1),
('draw', 'correct', 'Correcte', 'Correct', 'Tirage optimal', 2),
('draw', 'too_easy', 'Trop facile', 'Too Easy', 'Tirage trop aisé', 3)
-- etc. (voir enums_codes.md pour liste complète)
```

---

### taste_options ✅

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

### aroma_options ✅

```sql
CREATE TABLE aroma_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('hay', 'divine', 'manure')),
  family VARCHAR(50),
  -- herbacé, boisé, sous-bois, épicé, poivré, fruité, animal, empyreumatique, divers
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

**Exemples descriptions** : "Cèdre, pin, bois résineux, bois fumé, bois humide, mousse de chêne, liège, sciure, écorce"

---

### tastings ✅

```sql
CREATE TABLE tastings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES users(id) ON DELETE SET NULL,
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
  aromas TEXT[], -- Codes aroma_options
  tasting_notes TEXT,
  
  -- === MODE EXPERT (optionnel) ===
  
  -- Contexte
  smoked_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  moment VARCHAR(50), -- Code tasting_attributes
  situation VARCHAR(50), -- Code tasting_attributes
  pairing VARCHAR(200),
  
  -- Avant allumage
  cape_aspect VARCHAR(50),
  cape_color VARCHAR(50),
  touch VARCHAR(50),
  
  -- Fumage à cru
  raw_smoke_tastes TEXT[], -- Codes taste_options
  raw_smoke_aromas TEXT[], -- Codes aroma_options
  
  -- Dégustation détaillée (codes références taste/aroma_options)
  tastes_hay TEXT[],
  tastes_divine TEXT[],
  tastes_manure TEXT[],
  aromas_hay TEXT[],
  aromas_divine TEXT[],
  aromas_manure TEXT[],
  
  -- Caractéristiques techniques (codes tasting_attributes)
  body_strength VARCHAR(50), -- Référence tasting_attributes.code
  aroma_variety VARCHAR(50),
  draw VARCHAR(50),
  terroir VARCHAR(50),
  balance VARCHAR(50),
  ash_nature VARCHAR(50),
  final_impression VARCHAR(50),
  aromatic_persistence VARCHAR(50),
  
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

**Note :** Tous les champs techniques (body_strength, draw, etc.) stockent des **codes** qui référencent `tasting_attributes.code`. Validation faite côté application TypeScript.

---

## 💬 SOCIAL & INTERACTIONS

### posts ✅

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
  
  -- Soft delete pour modération
  is_deleted BOOLEAN DEFAULT false,
  deleted_by UUID REFERENCES users(id),
  deleted_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_club ON posts(club_id);
CREATE INDEX idx_posts_tasting ON posts(tasting_id);
CREATE INDEX idx_posts_visibility ON posts(visibility);
CREATE INDEX idx_posts_is_deleted ON posts(is_deleted);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
```

---

### comments ✅

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

### reactions ✅

```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reactable_type VARCHAR(20) NOT NULL CHECK (reactable_type IN ('event', 'post', 'tasting', 'comment')),
  reactable_id UUID NOT NULL,
  reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'cheers', 'fire', 'mind_blown')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, reactable_type, reactable_id)
);

CREATE INDEX idx_reactions_user ON reactions(user_id);
CREATE INDEX idx_reactions_reactable ON reactions(reactable_type, reactable_id);
CREATE INDEX idx_reactions_type ON reactions(reaction_type);
```

**Emojis :**
- `like` → 👍 (J'aime)
- `love` → ❤️ (Adoré)
- `cheers` → 🥃 (Santé !)
- `fire` → 🔥 (Excellent)
- `mind_blown` → 🤯 (Waouh)

**Comportement** : Toggle classique (click = react, re-click = unreact via DELETE row). Changer de réaction = UPDATE `reaction_type`.

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
    (visibility = 'members_only' AND club_id IN (
      SELECT club_id FROM club_members WHERE user_id = auth.uid() AND status = 'active'
    )) OR
    (visibility = 'invited_only' AND id IN (
      SELECT event_id FROM event_rsvps WHERE user_id = auth.uid()
    ))
  );

-- Tastings : visibilité selon visibility
ALTER TABLE tastings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tastings visibility" ON tastings FOR SELECT 
  USING (
    user_id = auth.uid() OR
    (visibility = 'club' AND club_id IN (
      SELECT club_id FROM club_members WHERE user_id = auth.uid() AND status = 'active'
    )) OR
    visibility = 'public'
  );

-- Posts : visibilité selon visibility
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts visibility" ON posts FOR SELECT 
  USING (
    is_deleted = false AND (
      user_id = auth.uid() OR
      (visibility = 'club' AND club_id IN (
        SELECT club_id FROM club_members WHERE user_id = auth.uid() AND status = 'active'
      )) OR
      visibility = 'public'
    )
  );

-- Admin actions : admins uniquement
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admin actions" ON admin_actions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND user_role IN ('moderator', 'admin', 'super_admin')
  ));

-- Reports : reporter ou admins
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own reports" ON reports FOR SELECT
  USING (reporter_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND user_role IN ('moderator', 'admin', 'super_admin')
  ));
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
  "status": "active",
  "user_role": "user",
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
  "visibility": "members_only",
  "event_date": "2025-11-15T19:30:00Z"
}
```

---

## 🚀 Triggers & Functions

### Update club member_count

```sql
CREATE OR REPLACE FUNCTION update_club_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE clubs 
    SET member_count = (
      SELECT COUNT(*) FROM club_members 
      WHERE club_id = OLD.club_id AND status = 'active'
    )
    WHERE id = OLD.club_id;
    RETURN OLD;
  ELSE
    UPDATE clubs 
    SET member_count = (
      SELECT COUNT(*) FROM club_members 
      WHERE club_id = NEW.club_id AND status = 'active'
    )
    WHERE id = NEW.club_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_member_count
AFTER INSERT OR UPDATE OR DELETE ON club_members
FOR EACH ROW EXECUTE FUNCTION update_club_member_count();
```

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

**Version:** 2.0  
**Dernière mise à jour:** Octobre 2025  
**Status:** ✅ Validé et prêt pour implémentation MVP