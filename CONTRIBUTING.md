# Contribuer

1. `npm ci` puis `npm test` avant toute modification.
2. Une branche par changement, une pull request par branche.
3. `npm run format` avant de commiter (Prettier). La CI refuse le code non formaté.
4. Les messages d’erreur du domaine sont des `AuthError` avec un `code` : le texte vient de l’i18n, jamais du code métier.
5. Aucun accès direct à `localStorage` hors de `src/repositories/`.
6. Aucune donnée personnelle réelle dans les tests, les exemples ou les issues.

Langue du code, des commits et des noms : anglais. Documentation : français (à confirmer par l’équipe).
