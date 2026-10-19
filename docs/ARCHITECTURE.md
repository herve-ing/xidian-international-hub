# Architecture

```
src/
  domain/         types et règles pures (aucun accès navigateur)
  repositories/   ports de stockage ; implémentation localStorage aujourd’hui, HTTP demain
  services/       cas d’usage (authentification, clubs…), reçoivent leurs dépendances
  app/            composition root : branche les implémentations
  ui/             composants React (à migrer depuis hub.tsx, club-*.tsx…)
tests/            node:test, sans navigateur grâce à memoryStore()
docs/
```

Règle de dépendance : `ui → services → repositories → domain`. Jamais l’inverse.

Inspiration : la séparation `repository` / `page` du projet XDYou (traintime_pda).

## Passer au vrai produit

Remplacer `LocalAccountRepository` par un `HttpAccountRepository` qui appelle l’API décrite
dans `openapi.json`. Les services et l’interface ne changent pas. Les rôles doivent alors être
vérifiés par le serveur à chaque requête.
