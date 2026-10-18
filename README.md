# Xidian International Hub + Xie-Visas

Prototype étudiant indépendant : recherche de superviseurs, suivi des échéances administratives, guide d’arrivée, clubs et journal communautaire. Interface conservée dans cette refonte ; aucune donnée de navigateur n’est transférée sur un serveur.

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

Les sources lisibles sont dans `src/`. Les bundles et archives historiques ne sont pas conservés à la racine. Prettier possède une configuration partagée et deux commandes : `npm run format` et `npm run format:check`.

## Comptes et clubs

Trois rôles de démonstration : étudiant, responsable de club et professeur. Le responsable conserve les fonctions étudiantes et gère uniquement ses clubs ; le professeur accède à l’ISO et à tous les clubs.

1. L’étudiant crée son compte sur le navigateur de démonstration.
2. Un professeur ouvre **Gestion des clubs → Responsables**, sélectionne ce compte et lui attribue des clubs.
3. Le responsable utilise son compte étudiant habituel dans l’onglet **Responsable de club**.

Le professeur peut également créer un club et désigner son responsable dans **Articles et clubs**. Les responsables et professeurs y rédigent des brouillons ou publient des articles avec jusqu’à six images/vidéos et leurs légendes. Le journal public affiche seulement les articles publiés. Les nouvelles présentations et les articles conservent leur langue de rédaction.

Les 13 clubs initiaux restent disponibles, avec des illustrations originales. Les inscriptions, décisions, réponses et historiques sont conservés sur ce navigateur. Photos et vidéos sont conservées dans IndexedDB, autres données dans localStorage.

## Authentification : limites et renforcement

**Ce site n’est pas prêt à collecter de vraies données étudiantes.** Un navigateur contrôlé par son utilisateur ne peut pas être une autorité de sécurité. Le code professeur `XIDIAN-PROF-DEMO-2026` est public et sert uniquement à explorer le prototype.

Le modèle évite désormais d’accepter une simple déclaration `role: 'professor'` dans sessionStorage. Une connexion professeur validée par le code de démonstration crée une référence temporaire en mémoire. Sans cette référence, un objet professeur fabriqué est refusé ; déconnexion et rechargement l’invalident. **Les professeurs doivent donc se reconnecter après un rechargement.** Les documents, comptes étudiants, articles et médias ne sont pas effacés.

Cette défense empêche une falsification triviale de la session, mais **ne remplace ni une session serveur ni des autorisations côté serveur**. Le code démo étant public et les données locales modifiables, elle ne garantit pas une identité universitaire. Avant tout usage réel, suivre [le guide de mise en production](docs/PRODUCTION.md).

Les mots de passe de démonstration sont dérivés avec PBKDF2-SHA256 (sel aléatoire et 210 000 itérations). Les réponses publiques n’exposent ni sel ni hachage. Les erreurs d’authentification utilisent `AuthError` et `AuthErrorCode` ; l’interface ne déduit plus leur type en analysant un message arbitraire.

## Déploiement GitHub Pages

Configurer **Settings → Pages → Source → GitHub Actions**. Le workflow installe les dépendances verrouillées, contrôle le format, lance les tests, compile puis publie uniquement `dist/`. Les sources TypeScript et archives ne sont pas nécessaires dans le site public.

Les permissions de lecture du code et de déploiement sont séparées par job. Aucun job ne peut réécrire les sources ; aucun secret applicatif n’est ajouté. La version précédente reste accessible dans l’historique Git pour un retour arrière.

## Données et vérifications

255 profils de superviseurs, dont 252 entrées du répertoire anglais officiel SIE. Les champs non structurés des documents en images ne sont pas inventés ; disponibilité et informations à vérifier auprès de Xidian. Le filtre Master/PhD conserve une option explicite pour les profils au niveau non renseigné.

La logique des dates utilise le jour civil de Pékin. Les seuils sont couverts par les tests, y compris à minuit, aux frontières des alertes et lors des années bissextiles. Le prototype ne constitue pas un conseil administratif officiel et n’envoie aucune notification externe.

Voir [la revue de code](docs/TECHNICAL_REVIEW.md) et [l’historique fonctionnel](docs/HISTORY.md). Les contenus détaillés restent principalement FR/EN/ZH ; certaines autres langues utilisent un repli anglais annoncé dans l’interface.
