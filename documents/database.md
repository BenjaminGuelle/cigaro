# Database Structure - Cigaro

> Structure complète de la base de données Supabase PostgreSQL

## 🏗️ Tables Principales

### users
Utilisateurs de l'application (solos et membres de clubs)

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Clé primaire |
| email | VARCHAR(255) | Email unique |
| first_name | VARCHAR(100) | Prénom |
| last_name | VARCHAR(100) | Nom |
| pseudo | VARCHAR(50) | Pseudo unique |
| avatar_url | TEXT | URL photo profil |
| address | JSONB | Adresse optionnelle |
| status | VARCHAR(20) | active/suspended/banned/deleted |
| user_role | VARCHAR(20) | user/moderator/admin/super_admin |
| **solo_plan** | **VARCHAR(20)** | **free/premium (abonnement solo)** |
| **solo_subscription_id** | **VARCHAR(255)** | **ID Stripe** |
| **is_admin_premium** | **BOOLEAN** | **Premium offert par admin** |
| **admin_premium_note** | **TEXT** | **Note admin ("Beta tester")** |
| rank | VARCHAR(20) | initie/aficionado/connaisseur |
| xp | INTEGER | Points gamification |
| privacy_settings | JSONB | Paramètres confidentialité |

**Relations :**
- Un user peut créer plusieurs clubs (owner)
- Un user peut être membre de plusieurs clubs
- Un user peut faire plusieurs dégustations
- Un user peut créer plusieurs posts/comments

---

### clubs
Cercles de dégustation

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Clé primaire |
| name | VARCHAR(100) | Nom du club |
| description | TEXT | Description |
| logo_url | TEXT | Logo |
| cover_photo_url | TEXT | Photo couverture |
| contact_email | VARCHAR(255) | Email public |
| owner_id | UUID | Propriétaire (FK users) |
| address | JSONB | Adresse siège |
| **club_plan** | **VARCHAR(20)** | **free/premium_small/premium_large** |
| **club_subscription_id** | **VARCHAR(255)** | **ID Stripe** |
| **is_admin_premium** | **BOOLEAN** | **Premium offert par admin** |
| **admin_premium_note** | **TEXT** | **Note admin** |
| member_count | INTEGER | Nombre membres (dénormalisé) |
| invitation_code | VARCHAR(20) | Code invitation unique |
| is_public | BOOLEAN | Club public/privé |
| founded_at | DATE | Date création |
| settings | JSONB | Paramètres club |

**Relations :**
- Un club appartient à un user (owner)
- Un club a plusieurs membres via club_members
- Un club organise plusieurs events
- Un club a plusieurs tastings partagées

---

### club_members
Table de liaison users ↔ clubs avec rôles

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Clé primaire |
| user_id | UUID | FK users |
| club_id | UUID | FK clubs |
| role | VARCHAR(20) | president/vice_president/member |
| functional_role | VARCHAR(20) | treasurer/organizer (optionnel) |
| status | VARCHAR(20) | invited/active/suspended/left |
| joined_at | TIMESTAMPTZ | Date adhésion |

**Relations :**
- Lie un user à un club
- Unique(user_id, club_id)

---

### events
Événements/Assemblées de dégustation

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Clé primaire |
| club_id | UUID | FK clubs |
| title | VARCHAR(200) | Titre événement |
| description | TEXT | Description |
| photo_url | TEXT | Photo événement |
| location_type | VARCHAR(20) | member_home/custom |
| location_host_id | UUID | FK users (si chez membre) |
| location_name | VARCHAR(200) | Nom du lieu |
| location_address | JSONB | Adresse complète |
| address_visible_to | VARCHAR(20) | all/confirmed_only |
| location_notes | TEXT | Instructions accès |
| event_date | TIMESTAMPTZ | Date/heure |
| duration_minutes | INTEGER | Durée (défaut 180min) |
| max_participants | INTEGER | Limite participants |
| visibility | VARCHAR(20) | members_only/invited_only/public |
| status | VARCHAR(20) | upcoming/ongoing/completed/cancelled |
| created_by | UUID | FK users |

**Relations :**
- Un event appartient à un club
- Un event peut être organisé chez un membre (location_host_id)
- Un event a plusieurs RSVP via event_rsvps
- Un event peut avoir un bilan IA via event_reports

---

### event_rsvps
Réponses aux invitations d'événements

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Clé primaire |
| event_id | UUID | FK events |
| user_id | UUID | FK users |
| status | VARCHAR(20) | yes/no/maybe |

**Relations :**
- Lie un user à un event
- Unique(event_id, user_id)

---

### tastings
Dégustations de cigares (privées ou partagées)

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Clé primaire |
| user_id | UUID | FK users |
| club_id | UUID | FK clubs (si partagée) |
| event_id | UUID | FK events (si lors d'un événement) |
| cigar_name | VARCHAR(200) | Nom du cigare |
| cigar_brand | VARCHAR(100) | Marque |
| vitola | VARCHAR(100) | Format |
| rating | DECIMAL(2,1) | Note /5 avec demi-points |
| is_expert_mode | BOOLEAN | Mode quick/expert |
| aromas | TEXT[] | Codes aromas (mode quick) |
| tasting_notes | TEXT | Notes libres |
| smoked_at | TIMESTAMPTZ | Date dégustation |
| duration_minutes | INTEGER | Durée fumage |
| moment | VARCHAR(50) | matin/midi/soir |
| situation | VARCHAR(50) | aperitif/cocktail/digestif |
| pairing | VARCHAR(200) | Accord (whisky, café...) |
| photos | TEXT[] | URLs photos |
| visibility | VARCHAR(20) | private/club/public |

**Relations :**
- Une tasting appartient à un user
- Une tasting peut être liée à un club (si partagée)
- Une tasting peut être liée à un event

---

### posts
Publications sociales dans les clubs

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Clé primaire |
| user_id | UUID | FK users |
| club_id | UUID | FK clubs |
| title | VARCHAR(200) | Titre |
| description | TEXT | Contenu |
| media_urls | TEXT[] | Photos/vidéos |
| tasting_id | UUID | FK tastings (si post sur dégustation) |
| visibility | VARCHAR(20) | private/club/public |
| is_deleted | BOOLEAN | Soft delete |

**Relations :**
- Un post appartient à un user
- Un post est publié dans un club
- Un post peut référencer une tasting

---

### comments
Commentaires sur posts/tastings/events

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Clé primaire |
| user_id | UUID | FK users |
| commentable_type | VARCHAR(20) | event/post/tasting |
| commentable_id | UUID | ID de l'objet commenté |
| content | TEXT | Contenu commentaire |
| is_deleted | BOOLEAN | Soft delete |

**Relations :**
- Un comment appartient à un user
- Un comment peut être sur un event, post, ou tasting (polymorphique)

---

### reactions
Réactions (like, love, etc.) sur contenu

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Clé primaire |
| user_id | UUID | FK users |
| reactable_type | VARCHAR(20) | event/post/tasting/comment |
| reactable_id | UUID | ID de l'objet |
| reaction_type | VARCHAR(20) | like/love/cheers/fire/mind_blown |

**Relations :**
- Une reaction appartient à un user
- Une reaction peut être sur event/post/tasting/comment (polymorphique)

---

## 📊 Abonnements & Business Model

### Logique des Plans

**Users (Solo) :**
- `solo_plan = 'free'` : 3 évaluations/mois
- `solo_plan = 'premium'` : Illimité (4.99€/mois)
- `is_admin_premium = true` : Override gratuit par admin

**Clubs :**
- `club_plan = 'free'` : Max 15 membres, pas de bilans IA
- `club_plan = 'premium_small'` : Max 15 membres, bilans IA illimités (29€/mois)
- `club_plan = 'premium_large'` : Max 50 membres, bilans IA illimités (34€/mois)
- `is_admin_premium = true` : Override gratuit par admin

**Réduction croisée :**
- User premium dans club premium → -30% sur abonnement solo (3.49€/mois)

---

## 🔗 Relations Principales

```
users (1) ──────── (n) clubs           [via owner_id]
users (n) ──────── (n) clubs           [via club_members]
clubs (1) ──────── (n) events
events (1) ─────── (n) event_rsvps ──── (1) users
events (1) ─────── (1) event_reports   [optionnel]
users (1) ──────── (n) tastings
tastings (n) ───── (1) events          [optionnel]
tastings (n) ───── (1) clubs           [si partagée]
clubs (1) ──────── (n) posts
posts (1) ──────── (n) comments
users (1) ──────── (n) reactions       [polymorphique]
```

---

## 🎯 Champs Importants

### Admin Premium (NOUVEAU)
- `users.is_admin_premium` + `admin_premium_note`
- `clubs.is_admin_premium` + `admin_premium_note`
- Permet d'offrir le premium gratuitement sans passer par Stripe

### Gamification
- `users.rank` : initie → aficionado → connaisseur
- `users.xp` : points d'expérience

### Dénormalisation Performance
- `clubs.member_count` : Mis à jour par trigger PostgreSQL

### JSONB Fields
- `users.address` : Adresse structurée
- `events.location_address` : Snapshot adresse événement
- `clubs.settings` : Paramètres club