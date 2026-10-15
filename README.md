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

Sept tests couvrent les dates de Pékin, les seuils d’alerte, la validation des dates, la sauvegarde locale et la FAQ. Compilation TypeScript et build Vite validés.
