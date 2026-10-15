# Xidian International Hub + Xie-Visas

Prototype public pour GitHub Pages. Les fichiers HTML/CSS/JS compilés sont à la racine : publication depuis `main` / `/ (root)`.

## Modules

Dashboard étudiant et ISO simulé, recherche de superviseurs, Xie-Visas, checklist d’arrivée, assistant FAQ, exports calendrier ICS/CSV/JSON et impression PDF.

Les exemples et rôles sont fictifs. « Tester mon espace local » conserve les dates, favoris et démarches uniquement dans le navigateur. Aucune authentification réelle, synchronisation serveur, IA générative ni notification externe n’est active. Ne pas entrer de données personnelles sensibles.

Navigation dans 11 langues ; contenus détaillés FR/EN/ZH. Informations à confirmer avec l’ISO et les autorités compétentes. Initiative étudiante indépendante, sans affiliation officielle à Xidian.

## Code source

Fichiers TypeScript directement consultables à la racine : hub.tsx, icons.tsx, navigation.tsx, prototype-api.ts, domain.ts, i18n.ts, supervisors.ts, faq.ts et main.tsx.

Xidian-source-complete.zip contient le projet Vite initial, le workflow GitHub Actions, les modules de la version serveur et sa documentation. Aucun secret ni donnée personnelle d’utilisateur n’est inclus.

## Développer et mettre à jour

Node.js 22 ou supérieur.

```bash
npm ci
npm test
npm run dev
npm run build
```

La compilation vérifie les types et met à jour index.html ainsi que les assets à la racine. Publier ces fichiers sur main actualise GitHub Pages. prototype.html est le point d’entrée de développement ; index.html est le fichier compilé public.

## Publication GitHub Pages

Settings → Pages → Deploy from a branch → main → / (root).

Les liens internes utilisent des fragments (#/visas, #/supervisors) pour fonctionner après rechargement.

Neuf tests couvrent les dates de Pékin, les seuils d’alerte, la validation des dates, la sauvegarde locale et la FAQ. Compilation TypeScript et build Vite validés.

## Annuaire officiel SIE — mise à jour du 15 octobre 2026

252 fiches provenant des 19 rubriques et des 22 pages de listes de l’annuaire anglais SIE, plus les 3 profils officiels précédemment sélectionnés : **255 profils**. La rubrique Hangzhou ne contient aucune fiche à cette date.

243 fiches SIE proposent des documents en images ; les 9 autres pages ne fournissent actuellement aucun document détaillé. Les images restent hébergées par Xidian et sont affichées à la demande dans les fiches, avec un lien vers leur page source. Les titres, emails, domaines, niveaux et langues non structurés ne sont pas inventés. La recherche par domaine et les filtres de niveau ne portent donc que sur les champs renseignés. L’inscription dans cet annuaire ne garantit pas de place disponible.

- `supervisors.ts` : données typées utilisées par le prototype.
- `supervisors-data.json` : données et métadonnées exportables.
- `supervisor-sources.json` : provenance et pagination de toutes les fiches.
- `directory.test.mjs` : contrôle d’exhaustivité et migration des anciens espaces locaux.

Pagination par 18 profils ; filtres par école, recherche par nom et favoris. La migration conserve les documents, préférences et ajouts locaux.
