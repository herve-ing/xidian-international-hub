# Audit du Hub — 20 octobre 2026

## Corrections livrées

- Restauration des traductions complètes et du choix de langue partagé (anglais au premier accès). Le commit précédent avait réintroduit un ancien composant public ; le test multilingue a empêché sa publication.
- Conservation du logo commun, des liens sans flèches et des dimensions tactiles déjà validées.
- Apparition progressive des photographies avec GSAP et IntersectionObserver : chargement terminé avant animation, animation unique par image montée, traitement des photos ajoutées par les filtres et sous-onglets. Les documents et CV restent stables.
- Pause des animations conservée dans le navigateur, prise en compte dynamique de la réduction des mouvements et nettoyage au changement de page.
- Lien d'évitement vers le contenu sans casser le routeur ; fermeture du menu mobile avec Échap ; retour du focus au contenu après navigation.
- Navigation entre les rubriques de l'Union sans retour forcé en haut du site ; les liens vers les activités d'un club conservent leur contexte.
- Politique CSP dans le HTML de production : scripts du même site uniquement, objets et iframes bloqués, styles en ligne autorisés pour React/GSAP, sources de polices explicites. Politique de référent réduisant les détails transmis hors du site.
- Minification explicitement activée, sourcemaps désactivées et contrôle récursif des fichiers publiés pour refuser sources TypeScript/JSX, archives, cartes de sources et fichiers de clés/configuration sensibles.
- Identification du commit dans les métadonnées du build pour vérifier la version effectivement servie par Pages.

## Structure conseillée

La navigation publique actuelle reste cohérente : Découvrir, Admissions, Superviseurs, Union étudiante, puis Candidater / Mon espace. Les clubs, départements, actualités et recrutement appartiennent à l'Union ; Friday Movie Night reste une activité de son club. Multiplier les onglets de premier niveau rendrait cette structure moins claire.

## Priorités avant une ouverture institutionnelle

1. **Identité et autorisation côté serveur.** Remplacer le code professeur de démonstration par des invitations nominatives et révocables. Vérifier chaque lecture/écriture côté API ; ne jamais accepter un rôle fourni par le navigateur. Stocker les sessions dans des cookies HttpOnly, Secure et SameSite adaptés au déploiement, avec protection CSRF et limitation des tentatives.
2. **Persistance partagée.** Les inscriptions, publications, médias, propositions de films, votes et candidatures sont aujourd'hui locaux au navigateur. Une base serveur avec cloisonnement des comptes, journal d'audit, sauvegardes et suppression/export des données est nécessaire.
3. **Alertes fiables.** Les rappels de visa nécessitent un ordonnanceur serveur et des canaux de livraison vérifiés. Une page fermée ne peut pas assurer les envois 30/15/7/1 jours. Ajouter reprises sur échec et prévention des doublons.
4. **Messagerie et admissions.** Les échanges actuels ne sont pas livrés à des superviseurs et le suivi de dossier n'est pas synchronisé avec le portail officiel. Prévoir vérification des destinataires, notifications, anti-spam et consentement ; conserver la distinction avec les décisions officielles de Xidian.
5. **Vie associative.** Ajouter des événements confirmés avec capacité, liste d'attente, calendrier exportable, annulation et modération. Les articles et votes doivent avoir une source partagée et des contrôles d'autorisation serveur.
6. **Validation éditoriale.** Faire relire les traductions et les contenus visa/admissions par les personnes compétentes ; maintenir des dates de révision et les liens officiels. Ne pas présenter les délais historiques 2026 comme des admissions ouvertes.

## Protection contre la copie : limites réelles

Le HTML, le CSS, le JavaScript et les images servis au navigateur sont téléchargeables. La minification n'est pas une protection d'accès et ne rend pas le code secret. Bloquer le clic droit ou les outils de développement pénaliserait les visiteurs sans protéger les fichiers.

Le dépôt GitHub est actuellement public : les sources et leur historique y sont consultables indépendamment du site. Le passer en privé demande de vérifier la compatibilité du forfait et de GitHub Pages ; cette modification de visibilité n'est pas effectuée par cet audit. Les anciennes copies publiques peuvent subsister après un changement de visibilité.

Les véritables secrets et règles sensibles doivent rester sur un serveur. Les comptes, rôles et le code professeur de cette démonstration ne constituent pas une frontière de sécurité de production. La CSP ne change pas cette limite ; elle réduit certaines possibilités d'injection de contenu actif. GitHub Pages ne permet pas ici de définir les en-têtes personnalisés requis pour toutes les protections (notamment frame-ancestors, qui ne fonctionne pas via une balise meta).

## Déploiement et vérification

Le pipeline conserve formatage, tests et build avant publication. Le test des 15 langues doit rester obligatoire. Ne pas désactiver un contrôle pour faire passer une mise à jour : une panne GitHub et une régression applicative sont deux causes distinctes. Confirmer ensuite le résultat du workflow, le commit dans la page publiée et les parcours visibles.
