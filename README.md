# Xidian International Hub + Xie-Visas

Prototype étudiant indépendant : recherche de superviseurs, suivi des échéances administratives, guide d’arrivée, clubs et journal communautaire. Accueil public et parcours candidat ajoutés dans cette refonte ; aucune donnée de navigateur n’est transférée sur un serveur.

## Développer

Node.js 22.18+ ou 24, npm.

```sh
npm ci
npm run dev
npm test
npm run format:check
npm run build
npm run preview
```

`npm run build` vérifie les types, reconstruit `dist/` et vérifie que les ressources référencées existent. Le lockfile est portable : aucune dépendance ne pointe vers un chemin de la machine de développement.

## Organisation

| Dossier                       | Contenu                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| `src/`                        | Composants React, styles et logique métier TypeScript          |
| `tests/`                      | Tests métier, accès, migration, traductions et rendu React     |
| `public/`                     | Favicon, contrat OpenAPI et données publiques des superviseurs |
| `scripts/`                    | Vérification du résultat de compilation                        |
| `docs/`                       | Revue technique, historique et guide de mise en production     |
| `dist/`                       | Site compilé, ignoré par Git et produit en CI                  |
| `.github/workflows/pages.yml` | Vérification et déploiement GitHub Pages                       |

Les sources lisibles sont dans `src/`. Les anciens fichiers à la racine sont historiques et ne sont plus utilisés par la compilation : seules les sources dans `src/` et les ressources de `public/` sont publiées. Leur retrait définitif du dernier état du dépôt reste à terminer. Prettier possède une configuration partagée et deux commandes : `npm run format` et `npm run format:check`.

