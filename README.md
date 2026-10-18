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

Les tests couvrent les dates de Pékin, les seuils d’alerte, la validation des dates, la sauvegarde locale et la FAQ. Compilation TypeScript et build Vite validés.

## Annuaire officiel SIE — mise à jour du 15 octobre 2026

252 fiches provenant des 19 rubriques et des 22 pages de listes de l’annuaire anglais SIE, plus les 3 profils officiels précédemment sélectionnés : **255 profils**. La rubrique Hangzhou ne contient aucune fiche à cette date.

243 fiches SIE proposent des documents en images ; les 9 autres pages ne fournissent actuellement aucun document détaillé. Les images restent hébergées par Xidian et sont affichées à la demande dans les fiches, avec un lien vers leur page source. Les titres, emails, domaines, niveaux et langues non structurés ne sont pas inventés. La recherche par domaine porte sur les champs renseignés. Le filtre de niveau inclut par défaut les profils non renseignés, clairement signalés et désactivables. L’inscription dans cet annuaire ne garantit pas de place disponible.

- `supervisors.ts` : données typées utilisées par le prototype.
- `supervisors-data.json` : données et métadonnées exportables.
- `supervisor-sources.json` : provenance et pagination de toutes les fiches.
- `directory.test.mjs` : contrôle d’exhaustivité et migration des anciens espaces locaux.

Pagination par 18 profils ; filtres par école, recherche par nom et favoris. La migration conserve les documents, préférences et ajouts locaux.

## Vie de campus et corrections — 15 octobre 2026

Nouvelle rubrique `#/campus` : découverte par catégories et recherche, favoris, adhésions locales de démonstration, agenda d’exemple, inscription/annulation locale, export calendrier ICS avec dates en heure de Pékin, propositions de clubs et espace personnel. Les six communautés et quatre activités sont des exemples clairement identifiés, pas des associations ou événements officiellement confirmés. Aucun formulaire n’est envoyé à un responsable.

Le filtre Master/Doctorat conserve par défaut les fiches dont le niveau n’a pas été structuré depuis les documents images. Les correspondances renseignées sont affichées en premier ; une option permet de ne garder que celles-ci. Aucun niveau de diplôme n’est inventé.

Traductions : contenu de la rubrique Vie de campus disponible dans les 11 langues, catalogue étendu de plus de 1 300 traductions et correction des libellés/confirmations FR/EN/ZH. Les documents sources restent dans leur langue originale. Certains textes détaillés des autres modules restent en anglais dans les huit langues supplémentaires ; une indication dans la langue sélectionnée le précise. Relecture humaine nécessaire avant usage institutionnel.

## Comptes étudiant et professeur — 16 octobre 2026

Le portail propose la création puis la connexion d’un compte étudiant avec nom complet, matricule, nationalité, spécialité (major), niveau d’études (grade), téléphone, email et mot de passe. La connexion suivante accepte l’email ou le matricule et le mot de passe. Chaque compte dispose de documents, favoris, checklist et activités distincts sur ce navigateur. La déconnexion efface la session de l’onglet ; les données du compte sont conservées pour la prochaine connexion.

L’étudiant ne voit pas l’espace ISO. Une navigation directe vers `#/admin` renvoie vers l’accueil, et l’API locale refuse les opérations ISO et la modification des superviseurs pour un compte étudiant. Les professeurs accèdent à toutes les rubriques ; l’espace ISO ne voit que les comptes créés sur ce même navigateur et ses rappels restent locaux.

**Code professeur public de démonstration : `XIDIAN-PROF-DEMO-2026`.** Ce code est volontairement un code de test, jamais un secret de production. GitHub Pages sert des fichiers publics : ce prototype ne fournit pas une authentification serveur ni une autorisation résistante à une modification du navigateur. Ne pas y saisir de véritables informations personnelles. Les mots de passe de démonstration sont dérivés avec PBKDF2-SHA256 (sel aléatoire, 210 000 itérations) et ne sont pas stockés en clair. Utiliser un mot de passe réservé à la démo.

Pour la mise en service : déplacer les comptes et rôles sur le backend, vérifier l’email et le statut universitaire, remplacer le code partagé par des invitations nominatives révocables et contrôler les droits sur chaque requête serveur.

## Annuaire des clubs — 18 octobre 2026

Les six clubs fictifs sont remplacés par les 13 clubs communiqués par le porteur du projet : International Basketball, Badminton, Volleyball, Tennis, Pickleball, Football, Boxing, Open Canvas, Singing, Street Dance, Chinese Dance, Filmmaker of Xidian (FOX), Math Club. Les noms chinois sont des traductions descriptives à valider, pas des dénominations officielles garanties.

Fonctions : recherche avec alias et accents, filtres catégorie/format, favoris, fiches détaillées et préparation d’une première visite, brouillons de contact (expérience, jours disponibles et message à copier), coordonnées exclues par défaut, suivi manuel « contact effectué », agenda personnel en heure de Pékin et export ICS provisoire avec rappel un jour avant. Les rendez-vous ne sont jamais présentés comme confirmés. L’ancien agenda fictif est retiré ; les propositions locales sont conservées lors de la migration.

Le catalogue public `#/clubs` permet de découvrir les clubs avant connexion, avec un espace de découverte local distinct des comptes. Les comptes connectés retrouvent leur suivi dans `#/campus` ; aucun accès ISO n’est ouvert au visiteur public.

Source communautaire consultée le 18 octobre 2026 : https://freshman-guide-and-clubs.onrender.com/ et sa fiche basketball https://freshman-guide-and-clubs.onrender.com/basketball.html. Cette dernière indique Oussama Boumlik et le contact WeChat `lkhawa101`, reproduits avec leur source. Les autres responsables, groupes, horaires, lieux et frais ne sont pas inventés. Aucune photo ni texte éditorial du site de référence n’est recopié. Descriptifs et conseils de préparation rédigés pour ce prototype ; à valider avec les clubs.

L’interface des clubs est traduite dans les 11 langues. Les descriptions et conseils détaillés des 13 nouveaux clubs sont rédigés en français, anglais et chinois, avec repli anglais et indication visible pour les autres langues. Les 17 tests couvrent notamment les 13 entrées, les recherches, la migration et les exports calendaires de Pékin.
