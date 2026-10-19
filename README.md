# Xidian International Hub + Xie-Visas

Prototype étudiant indépendant : recherche de superviseurs, suivi des échéances administratives, guide d’arrivée, clubs et journal communautaire. Accueil public et parcours candidat ajoutés dans cette refonte ; aucune donnée de navigateur n’est transférée sur un serveur.

Interface disponible en 15 langues, avec anglais par défaut et choix partagé entre les espaces publics et connectés. [Documentation de localisation](docs/localization.md).

Les documents officiels, CV et contributions restent dans leur langue originale. Les traductions assistées nécessitent une relecture linguistique avant usage institutionnel. Le prototype utilise un stockage local au navigateur ; messagerie, dossiers et notifications ne sont pas reliés à un serveur.

Développement : `npm ci`, `npm run dev`. Vérifications : `npm run format:check`, `npm test`, `npm run build`. La version de production est générée depuis `src/` et déployée sur GitHub Pages par GitHub Actions.
