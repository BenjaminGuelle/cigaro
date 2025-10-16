# Cigaro - ENUMs & Codes Reference

> Référentiel complet des codes et valeurs pour tables référentielles  
> **Version:** 2.0 - Basé sur fiche Club Tables et Cigares de Caen  
> **Date:** Octobre 2025

---

## 📋 Table des matières

1. [Tasting Attributes](#tasting-attributes)
2. [Taste Options (Goûts)](#taste-options)
3. [Aroma Options (Arômes)](#aroma-options)
4. [Reactions](#reactions)
5. [ENUMs Hardcodés](#enums-hardcodés)

---

## 🔥 Tasting Attributes

Valeurs pour `tasting_attributes` table (mode expert) - **Issues de la fiche originale**.

### Aspect de la cape

| Code | Label FR | Label EN |
|------|----------|----------|
| `bien_tendue` | Bien tendue | Well stretched |
| `relachee` | Relâchée | Loose |
| `grain_fin_luisant` | Grain fin et luisant | Fine shiny grain |
| `aspect_mat` | Aspect mat | Matte appearance |
| `gras` | Gras | Oily |
| `terne` | Terne | Dull |
| `neutre` | Neutre | Neutral |
| `nervuree` | Nervurée | Veined |

---

### Couleur de la cape

| Code | Label FR | Label EN |
|------|----------|----------|
| `negro` | Negro (brun-noir) | Negro (dark brown) |
| `maduro` | Maduro (marron foncé) | Maduro (dark brown) |
| `maduro_claro` | Maduro-claro (marron) | Maduro-claro (brown) |
| `colorado` | Colorado (brun rouge) | Colorado (red brown) |
| `colorado_claro` | Colorado-claro (marron clair, ocre, fauve) | Colorado-claro (light brown) |
| `claro` | Claro (marron très clair, brun marbrée) | Claro (very light brown) |
| `clarissimo` | Clarissimo (clair) | Clarissimo (light) |

---

### Toucher

| Code | Label FR | Label EN |
|------|----------|----------|
| `rigide` | Rigide | Rigid |
| `ferme` | Ferme | Firm |
| `souple` | Souple | Supple |
| `regulier` | Régulier | Regular |
| `irregulier` | Irrégulier | Irregular |

---

### Début (fumage)

| Code | Label FR | Label EN |
|------|----------|----------|
| `piquant` | Piquant | Spicy |
| `amertume` | Amertume | Bitterness |
| `secheresse` | Sécheresse | Dryness |
| `agreable` | Agréable | Pleasant |
| `irritation` | Irritation | Irritation |

---

### Impression finale en bouche

| Code | Label FR | Label EN |
|------|----------|----------|
| `plenitude` | Plénitude | Fullness |
| `lourdeur` | Lourdeur | Heaviness |
| `secheresse` | Sécheresse | Dryness |
| `platitude` | Platitude | Flatness |
| `legerete` | Légèreté | Lightness |
| `fraicheur` | Fraîcheur | Freshness |

---

### Persistance aromatique

| Code | Label FR | Label EN |
|------|----------|----------|
| `longue` | Longue | Long |
| `moyenne` | Moyenne | Medium |
| `courte` | Courte | Short |

---

### Tirage

| Code | Label FR | Label EN |
|------|----------|----------|
| `difficile` | Difficile | Difficult |
| `correct` | Correct | Correct |
| `trop_aise` | Trop aisé | Too easy |

---

### Terroir

| Code | Label FR | Label EN |
|------|----------|----------|
| `accuse` | Accusé | Pronounced |
| `sensible` | Sensible | Sensitive |
| `inexistant` | Inexistant | Nonexistent |

---

### Équilibre

| Code | Label FR | Label EN |
|------|----------|----------|
| `bon` | Bon | Good |
| `heurte` | Heurté | Jerky |
| `fondu` | Fondu | Smooth |

---

### Moment

| Code | Label FR | Label EN |
|------|----------|----------|
| `matin` | Matin | Morning |
| `apres_midi` | Après-midi | Afternoon |
| `soir` | Soir | Evening |

---

### Nature de la cendre

| Code | Label FR | Label EN |
|------|----------|----------|
| `reguliere` | Régulière | Regular |
| `irreguliere` | Irrégulière | Irregular |
| `nette` | Nette | Clean |

---

### Situation

| Code | Label FR | Label EN |
|------|----------|----------|
| `aperitif` | Apéritif | Aperitif |
| `cocktail` | Cocktail | Cocktail |
| `digestif` | Digestif | Digestif |

---

### Corps - Puissance olfactive

| Code | Label FR | Label EN |
|------|----------|----------|
| `inconsistant` | Inconsistant | Inconsistent |
| `creux` | Creux | Hollow |
| `faible` | Faible | Weak |
| `mince` | Mince | Thin |
| `moyen` | Moyen | Medium |
| `etoffe` | Étoffé | Full |
| `plein` | Plein | Full-bodied |
| `copieux` | Copieux | Rich |
| `rassasiant` | Rassasiant | Filling |
| `tres_rassasiant` | Très rassasiant | Very filling |

---

### Corps - Variété dans les arômes

| Code | Label FR | Label EN |
|------|----------|----------|
| `indigent` | Indigent | Poor |
| `tres_pauvre` | Très pauvre | Very poor |
| `pauvre` | Pauvre | Poor |
| `modeste` | Modeste | Modest |
| `moyen` | Moyen | Medium |
| `riche` | Riche | Rich |
| `genereux` | Généreux | Generous |
| `opulent` | Opulent | Opulent |
| `capiteux` | Capiteux | Heady |
| `tres_capiteux` | Très capiteux | Very heady |

---

## 👅 Taste Options

Grille **FOIN-DIVIN-PURIN** (Hay-Divine-Manure) pour les goûts.

**19 goûts au total** - À répartir dans les 3 catégories selon la grille de ta fiche.

| Code | Label FR | Label EN | Category | Description |
|------|----------|----------|----------|-------------|
| `herbace` | Herbacé | Herbaceous | HAY | Goût végétal, herbe |
| `fleuri` | Fleuri | Floral | DIVINE | Goût floral, fleurs |
| `boise` | Boisé | Woody | DIVINE | Goût boisé, cèdre |
| `terreux` | Terreux | Earthy | HAY | Goût de terre |
| `douceatre` | Douceâtre | Sweetish | DIVINE | Douceur légère |
| `piquant` | Piquant | Spicy | DIVINE | Piquant, poivré |
| `sucre` | Sucré | Sweet | DIVINE | Sucré, doux |
| `fruite` | Fruité | Fruity | DIVINE | Goût fruité |
| `mielleux` | Mielleux | Honeyed | DIVINE | Goût de miel |
| `onctueux` | Onctueux | Creamy | DIVINE | Crémeux, onctueux |
| `mat` | Mat | Dull | HAY | Sans relief |
| `plat` | Plat | Flat | HAY | Fade, plat |
| `apre` | Âpre | Harsh | MANURE | Âpreté, astringent |
| `corse` | Corsé | Full-bodied | DIVINE | Corsé, puissant |
| `fade` | Fade | Bland | HAY | Fade, insipide |
| `acidule` | Acidulé | Acidic | MANURE | Légèrement acide |
| `amer` | Amer | Bitter | MANURE | Amertume |
| `empuant` | Empuant | Stinking | MANURE | Âcre, repoussant |
| `cacaote` | Cacaoté | Cocoa | DIVINE | Goût cacao |

**Note :** Les catégories HAY/DIVINE/MANURE sont indicatives et peuvent être cochées lors du seeding selon la classification de ta fiche originale.

---

## 🌸 Aroma Options

Arômes organisés par **famille olfactive** et catégorie HDM.

**16 arômes principaux** + familles détaillées en descriptions.

### Arômes Principaux

| Code | Label FR | Label EN | Family | Category |
|------|----------|----------|--------|----------|
| `herbace` | Herbacé | Herbaceous | herbacé | HAY |
| `floral` | Floral | Floral | floral | DIVINE |
| `boise` | Boisé | Woody | boisé | DIVINE |
| `terreux` | Terreux | Earthy | terreux | HAY |
| `sous_bois` | Sous-bois | Undergrowth | sous-bois | HAY |
| `poivre` | Poivré | Peppery | poivré | DIVINE |
| `epice` | Épicé | Spicy | épicé | DIVINE |
| `fruite` | Fruité | Fruity | fruité | DIVINE |
| `animal` | Animal | Animal | animal | MANURE |
| `cafe` | Café | Coffee | empyreumatique | DIVINE |
| `cacao` | Cacao | Cocoa | empyreumatique | DIVINE |
| `creme` | Crème | Cream | divers | DIVINE |
| `brioche` | Brioché | Brioche | empyreumatique | DIVINE |
| `viennoiserie` | Viennoiserie | Pastry | empyreumatique | DIVINE |
| `caramel` | Caramel | Caramel | divers | DIVINE |
| `empyreumatique` | Empyreumatique | Smoky | empyreumatique | DIVINE |

---

### Familles d'Arômes (Descriptions détaillées)

#### Herbacé
Paille, foin (humide, séché, coupé), herbe (humide, séchée, brûlée, coupée)

#### Floral
Fleurs (séchées, coupées)

#### Boisé
Cèdre, bois résineux, bois brûlé, bois humide, mousse de chêne, liège, sciure, écorce

#### Terreux
Terre (humide, chaude), poussière, tourbe

#### Sous-bois
Humus, feuilles mortes, mousse, champignon, noix, noisette...

#### Épicé
Poivre, cannelle, cumin, vanille, noix de muscade, thym, réglisse, pain d'épice

#### Poivré
Blanc, gris, noir, vert, poivron, menthe poivrée

#### Fruité
Banane, fruits exotiques, citron, citron vert, citronnelle, fruits confits, fruits secs...

#### Animal
Étable, gibier, venaison, mise bas, cuir, fauve, musc, vieux, rancio(chaud)

#### Empyreumatique
Café torréfié, café crème, espresso, pain grillé, cacao, fève de cacao grillée, croissant chaud

#### Divers
Amande, crème, eucalyptus, ambre, miel, caramel, fougères sèches, clou de girofle, chocolat blanc, cappuccino

**Note :** Les catégories HAY/DIVINE/MANURE sont indicatives et seront cochées dans la grille lors du seeding.

---

## 💬 Reactions

Types de réactions possibles sur posts/tastings/comments/events.

| Code | Emoji | Label FR | Label EN | Usage |
|------|-------|----------|----------|-------|
| `like` | 👍 | J'aime | Like | Réaction positive générique |
| `love` | ❤️ | Adoré | Love | Coup de cœur, très apprécié |
| `cheers` | 🥃 | Santé ! | Cheers | Toast, convivialité cigare |
| `fire` | 🔥 | Excellent | Fire | Exceptionnel, top qualité |
| `mind_blown` | 🤯 | Waouh | Mind Blown | Surprise, découverte incroyable |

**Comportement :** Un user peut mettre UNE seule réaction par élément. Changer de réaction = UPDATE `reaction_type`.

---

## 🔒 ENUMs Hardcodés

Valeurs hardcodées dans les tables (CHECK constraints).

### users.status

| Code | Label | Description |
|------|-------|-------------|
| `active` | Actif | Compte actif et utilisable |
| `suspended` | Suspendu | Compte temporairement suspendu |
| `banned` | Banni | Compte définitivement banni |
| `deleted` | Supprimé | Compte soft-deleted |

---

### users.user_role

| Code | Label | Permissions |
|------|-------|-------------|
| `user` | Utilisateur | Utilisateur normal, aucun pouvoir admin |
| `moderator` | Modérateur | Review reports, ban users, delete content |
| `admin` | Administrateur | Full access stats + gestion users/clubs + modération |
| `super_admin` | Super Admin | Tout + gérer autres admins + settings plateforme |

---

### users.solo_plan

| Code | Label | Prix | Features |
|------|-------|------|----------|
| `free` | Gratuit | 0€ | 3 évaluations/mois |
| `premium` | Premium | 4.99€/mois | Évaluations illimitées, stats avancées |

**Note :** Réduction -30% (3.49€/mois) si membre d'un club premium.

---

### users.rank

| Code | Label | XP Required | Badge |
|------|-------|-------------|-------|
| `initie` | Initié | 0-99 XP | 🌱 |
| `aficionado` | Aficionado | 100-499 XP | 🔥 |
| `connaisseur` | Connaisseur | 500+ XP | 👑 |

**XP Gains :**
- 10 XP par évaluation
- 20 XP par participation événement
- 50 XP par création cercle
- 5 XP par commentaire
- 2 XP par reaction

---

### clubs.club_plan

| Code | Label | Prix | Max Membres | Features |
|------|-------|------|-------------|----------|
| `free` | Gratuit | 0€ | 15 | Features basiques |
| `premium_small` | Premium Small | 29€/mois | 15 | Bilans IA illimités, stats avancées |
| `premium_large` | Premium Large | 34€/mois | 50 | Tout Premium Small + 50 membres |

---

### club_members.role

| Code | Label | Permissions |
|------|-------|-------------|
| `president` | Président | Full control club (edit, delete, manage members) |
| `vice_president` | Vice-président | Manage members, create events, modération |
| `member` | Membre | Participate, create tastings, comment |

---

### club_members.functional_role

| Code | Label | Rôle |
|------|-------|------|
| `treasurer` | Trésorier | Gestion finances club (optionnel) |
| `organizer` | Organisateur | Organisation événements (optionnel) |

---

### club_members.status

| Code | Label | Description |
|------|-------|-------------|
| `invited` | Invité | Invitation en attente de réponse |
| `active` | Actif | Membre actif du club |
| `suspended` | Suspendu | Membre temporairement suspendu |
| `left` | Parti | Ancien membre (soft delete) |

---

### events.location_type

| Code | Label | Usage |
|------|-------|-------|
| `member_home` | Chez un membre | Event chez un membre du club |
| `custom` | Lieu personnalisé | Restaurant, bar, autre lieu |

---

### events.address_visible_to

| Code | Label | Qui voit l'adresse ? |
|------|-------|---------------------|
| `all` | Tous les membres | Tous les membres du club voient l'adresse |
| `confirmed_only` | Confirmés uniquement | Seulement ceux avec RSVP = 'yes' |

---

### events.visibility

| Code | Label | Qui voit l'event ? |
|------|-------|-------------------|
| `members_only` | Membres uniquement | Tous membres actifs du club |
| `invited_only` | Invités uniquement | Seulement ceux avec RSVP (privé) |
| `public` | Public | Visible hors du club |

---

### events.status

| Code | Label | Description |
|------|-------|-------------|
| `upcoming` | À venir | Event futur, pas encore commencé |
| `ongoing` | En cours | Event en cours actuellement |
| `completed` | Terminé | Event passé, terminé |
| `cancelled` | Annulé | Event annulé |

---

### event_rsvps.status

| Code | Label | Emoji |
|------|-------|-------|
| `yes` | Oui | ✅ |
| `no` | Non | ❌ |
| `maybe` | Peut-être | ❓ |

---

### tastings.visibility

| Code | Label | Qui voit ? |
|------|-------|-----------|
| `private` | Privée | Seulement moi |
| `club` | Cercle | Membres de mon cercle |
| `public` | Publique | Tout le monde |

---

### posts.visibility

| Code | Label | Qui voit ? |
|------|-------|-----------|
| `private` | Privé | Seulement moi |
| `club` | Cercle | Membres de mon cercle |
| `public` | Public | Tout le monde |

---

### comments.commentable_type

| Code | Description |
|------|-------------|
| `event` | Commentaire sur un événement |
| `post` | Commentaire sur un post |
| `tasting` | Commentaire sur une dégustation |

---

### reactions.reactable_type

| Code | Description |
|------|-------------|
| `event` | Réaction sur un événement |
| `post` | Réaction sur un post |
| `tasting` | Réaction sur une dégustation |
| `comment` | Réaction sur un commentaire |

---

### reports.reported_type

| Code | Description |
|------|-------------|
| `user` | Signaler un utilisateur |
| `post` | Signaler un post |
| `tasting` | Signaler une dégustation |
| `comment` | Signaler un commentaire |
| `club` | Signaler un club |
| `event` | Signaler un événement |

---

### reports.reason

| Code | Label FR | Label EN |
|------|----------|----------|
| `spam` | Spam | Spam |
| `inappropriate` | Contenu inapproprié | Inappropriate Content |
| `harassment` | Harcèlement | Harassment |
| `fake` | Faux / Trompeur | Fake / Misleading |
| `violence` | Violence | Violence |
| `other` | Autre | Other |

---

### reports.status

| Code | Label | Description |
|------|-------|-------------|
| `pending` | En attente | Report non traité |
| `reviewing` | En cours | Modérateur examine |
| `resolved` | Résolu | Action prise, fermé |
| `dismissed` | Rejeté | Report non fondé |

---

## 📝 Notes d'Implémentation

### Source des Données
Toutes les données proviennent de la **fiche de dégustation officielle** du Club Tables et Cigares de Caen.

### Seeding Strategy

1. **tasting_attributes** : Seed complet au setup initial avec toutes les valeurs de la fiche (~80 valeurs)
2. **taste_options** : 19 goûts issus de la fiche (répartition HAY/DIVINE/MANURE indicative)
3. **aroma_options** : 16 arômes principaux + familles détaillées
4. **Hardcodés** : Validation DB native via CHECK constraints (NestJS validera également)

### Frontend Usage (Angular)

```typescript
// Type-safe enums côté frontend
export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin';
export type SoloPlan = 'free' | 'premium';
export type ClubPlan = 'free' | 'premium_small' | 'premium_large';
export type ReactionType = 'like' | 'love' | 'cheers' | 'fire' | 'mind_blown';

// Référentiels à charger depuis API NestJS
const tastingAttributes = await this.http.get<TastingAttribute[]>('/api/tasting-attributes').toPromise();
const tasteOptions = await this.http.get<TasteOption[]>('/api/taste-options').toPromise();
const aromaOptions = await this.http.get<AromaOption[]>('/api/aroma-options').toPromise();
```

### Backend Usage (NestJS)

```typescript
// DTOs avec validation
export class CreateTastingDto {
  @IsString()
  cigarName: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsArray()
  @IsString({ each: true })
  aromas: string[]; // Codes aroma_options

  @IsEnum(['private', 'club', 'public'])
  visibility: TastingVisibility;
}
```

### Catégorisation HAY/DIVINE/MANURE

Les goûts et arômes sont associés aux catégories de manière indicative :
- **HAY (Foin)** : Végétal, herbacé, terreux, simple
- **DIVINE (Divin)** : Noble, raffiné, complexe, plaisant
- **MANURE (Purin)** : Puissant, âcre, animal, intense

Cette catégorisation se fera lors du seeding SQL initial.

---

**Version:** 2.0 (Basée sur fiche Club Tables et Cigares de Caen)  
**Dernière mise à jour:** Octobre 2025  
**Status:** ✅ Données authentiques de la fiche officielle