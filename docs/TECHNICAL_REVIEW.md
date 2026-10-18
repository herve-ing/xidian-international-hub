# Revue et modifications — 18 octobre 2026

Cette revue porte sur le code réellement lu : `accounts`, le portail, `hub`, `domain`, l’API locale, la configuration de compilation et leurs tests. Elle ne constitue pas un audit de sécurité indépendant. La fiche Claude externe n’était pas accessible ; les recommandations reproduites dans la demande ont servi de point de départ.

## Recommandations appliquées

| Point                          | Changement                                                                                 | Vérification                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Lisibilité                     | Sources et tests formatés avec Prettier, configuration partagée                            | `npm run format:check`                                        |
| Organisation                   | Code dans `src/`, tests dans `tests/`, ressources dans `public/`                           | Imports, typecheck et tests adaptés                           |
| Bundles anciens et ZIP         | Absents de la nouvelle arborescence ; `dist/` reconstruit et ignoré                        | Script de vérification du build                               |
| Installation reproductible     | Lockfile reconstruit sans liens vers les dossiers locaux de développement                  | Installation propre et build                                  |
| Erreurs magiques               | Classe `AuthError` et catalogue de codes typés                                             | Test sur la classe, le code et le repli des erreurs inconnues |
| Session professeur déclarative | Connexion démo requise dans la page active, session révoquée à la déconnexion/rechargement | Tests de falsification, changement de rôle et rejeu           |
| Animations du dashboard        | Hook dédié, sélecteurs limités au composant et imports tardifs abandonnés après démontage  | Typecheck, compilation et lecture du cycle de vie             |

Le mécanisme temporaire de session n’est pas présenté comme un serveur sécurisé. Il limite une erreur précise de confiance dans sessionStorage. Le contrôle des rôles du client reste contournable par une personne qui contrôle son navigateur.

## Lecture de `domain.ts`

Le calcul existant convertit la date d’expiration et le jour civil de Pékin en bornes UTC avant de calculer leur différence. Cela évite les changements de fuseau de l’ordinateur. Les catégories couvrent les frontières sans trou : expiré `<0`, critique `<7`, orange `<30`, à venir `<=90`, puis valide. Les seuils de rappel capturent les visites entre deux échéances, mais ne sont pas un cron serveur.

La validation refuse les dates impossibles qui seraient normalisées par JavaScript. Les tests complémentaires portent sur le passage minuit UTC/Pékin et les années bissextiles. Les règles métier des visas n’ont pas été modifiées dans cette refonte.

## Lecture de `hub.tsx`

Les opérations de l’ISO sont filtrées dans l’interface et vérifiées à nouveau dans l’API locale. L’export CSV protège les cellules commençant par des marqueurs de formule. Les contenus sont rendus comme texte React. La revue a identifié un risque de fin d’import d’animation après navigation ; le nouveau hook y remédie et limite les sélecteurs au dashboard concerné.

Le composant central reste volumineux même après formatage. Une extraction progressive des pages ISO, visas et superviseurs reste souhaitable, avec validation de chaque parcours. Cette refonte n’introduit pas une réécriture simultanée de tous les écrans. Quelques structures de données y utilisent encore `any` ; leur typage mérite une étape distincte.

## À traiter avant un usage institutionnel

Authentification et droits côté serveur, registre universitaire des professeurs, stockage partagé, sauvegardes et restauration, tests de bout en bout avec serveur, diffusion réelle des alertes, revue humaine des traductions et validation ISO des contenus. Aucun de ces points n’est considéré résolu par une mise en forme ou par la session de démonstration.
