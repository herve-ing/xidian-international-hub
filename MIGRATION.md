# Migration depuis la racine à plat

| Fichier actuel | Destination |
|---|---|
| `accounts.ts` | **fait** : `src/domain/*`, `src/repositories/account-repository.ts`, `src/services/auth-service.ts` |
| `clubs.ts`, `club-enrollments.ts`, `club-publishing.ts` | `src/domain/` + `src/services/` (même schéma que les comptes) |
| `supervisors.ts`, `supervisor-filter.ts`, `supervisors-data.json` | `src/domain/supervisors/` + `src/data/` |
| `translations.ts`, `club-translations.ts`, `i18n.ts` | `src/i18n/<langue>.json` + un test de clés manquantes |
| `hub.tsx`, `campus.tsx`, `club-*.tsx`, `account-portal.tsx`, `navigation.tsx`, `icons.tsx` | `src/ui/` |
| `*.test.mjs` | `tests/` |
| `prototype-*.js`, `prototype-*.css`, `gsap-*.js`, `ScrollTrigger-*.js`, `Xidian-source-complete.zip` | supprimer du dépôt ; publier le build via GitHub Actions |

## package.json : à fusionner

```json
"scripts": {
  "test": "node --experimental-strip-types --test tests/*.test.mjs",
  "typecheck": "tsc --noEmit",
  "lint": "eslint .",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
},
"devDependencies": { "eslint": "^9", "prettier": "^3", "typescript-eslint": "^8" }
```

`tsconfig.json` : ajouter `"allowImportingTsExtensions": true` et `"include": ["src", "tests"]`.

## Licence

Ajouter un fichier `LICENSE` (choix du porteur du projet). Si vous reprenez du code de
traintime_pda (MPL-2.0), conservez l’en-tête de licence de chaque fichier concerné.
