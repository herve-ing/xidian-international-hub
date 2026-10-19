# Localisation du Hub

## Langues et état partagé

Ordre du sélecteur : anglais, français, chinois simplifié, arabe, russe, espagnol, portugais, turc, indonésien, malais, ourdou, hindi, darija marocain, turkmène et lingala. L'anglais est la langue initiale, y compris dans le HTML avant le chargement React. Un choix déjà enregistré reste respecté.

`locale-config.ts` définit les codes, leur normalisation et le sens de lecture. `locale-store.ts` utilise un unique magasin React externe pour l'accueil public, la connexion et My Space. Le choix est conservé dans `xidian-locale`, propagé aux composants de la même page et aux autres onglets. Les anciennes copies concurrentes de l'état de langue et leurs effets de réécriture du stockage sont supprimés.

Arabe, darija et ourdou utilisent RTL ; le retour vers toute autre langue restaure LTR. Les emails et numéros gardent leur sens de lecture. Dates et heures utilisent la locale choisie et le fuseau de Pékin. Les filtres et formulaires conservent des valeurs canoniques indépendantes des libellés traduits.

## Catalogues

`src/locales/*.json` contient les traductions embarquées : aucune requête de traduction n'est nécessaire lors d'un changement de langue. `locale-overrides.json` rassemble les libellés prioritaires relus, notamment la navigation et les nouveaux jeux de langues. Les textes historiques déjà traduits sont conservés.

`content()` gère les textes bilingues/trilingues existants ; `localize()` gère les données publiques indexées et les messages d'interface déjà affichés avant le changement. Les noms de personnes, identifiants, emails, liens, PDF, CV en images et textes rédigés par les utilisateurs ne sont pas réécrits. Les documents officiels restent accessibles dans leur langue source.

Les compléments de traduction ont été préparés hors ligne à partir de NLLB-200 distilled 600M de Meta, exécuté avec CTranslate2. Ils constituent des traductions assistées, pas une certification linguistique. Les catalogues doivent être relus par des locuteurs et l'ISO avant un usage administratif réel. Les modèles ne sont ni distribués dans le dépôt ni chargés par le navigateur. Références : https://huggingface.co/facebook/nllb-200-distilled-600M et https://opennmt.net/CTranslate2/ . Les informations et visuels restent ceux des documents fournis, avec les limites du prototype.

## Vérifications

Les tests vérifient la couverture de tous les catalogues, l'ordre et la normalisation des langues, la persistance du choix, la synchronisation entre abonnés/onglets, les transitions RTL/LTR et les réponses FAQ. Les pages publiques sont rendues dans chaque langue pour détecter les paragraphes anglais résiduels et vérifier les valeurs Master/PhD indépendantes de leur traduction. `scripts/collect-ui-locales.mjs` extrait les textes de l'interface et des données publiques pour l'audit.
