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

## Refonte publique et archive fournie — 19 octobre 2026

L’archive `xidian-refactor.zip` fournie est intégrée : domaines, dépôts injectables, service d’authentification, fonctions de hachage et tests de service. Le composition root utilise le véritable annuaire de clubs au lieu de la liste vide du fichier d’exemple. La façade `accounts.ts` conserve les imports et les clés des données précédentes. La protection locale des sessions professeurs est maintenue.

L’accueil `/` est public ; l’annuaire `/supervisors`, les admissions `/admissions` et les clubs `/clubs` ne demandent aucun compte. Le portail existant est à `/login`, et le tableau de bord à `/workspace`. Un compte candidat distinct, sans matricule Xidian, prépare un dossier sur `/applications`. Les superviseurs disposent de `/faculty` pour une association de profil explicitement de démonstration et pour répondre aux conversations du même navigateur.

Les étapes reproduisent le parcours des diapositives fournies : préparer, déposer officiellement, passer l’entretien, compléter les pièces et confirmer l’offre. Le suivi est **personnel et déclaré**, jamais une décision officielle importée. Les PDF 2026 restent consultables et leurs échéances passées sont signalées. Aucune campagne 2027 n’est inventée.

**Messagerie :** les échanges sont fonctionnels entre comptes de démonstration du même navigateur. Aucun email n’est envoyé ; aucun vrai superviseur ne reçoit ces messages. Un backend avec comptes universitaires vérifiés et stockage partagé reste nécessaire pour une messagerie réelle. Le Hub n’est pas connecté au portail officiel d’admission.

Les images de campus, laboratoire, salle de cours et vie internationale proviennent du PowerPoint transmis. Le logo Hub est celui fourni par le porteur du projet. L’animation binaire est décorative, dispose d’un bouton pause et respecte `prefers-reduced-motion`. Le design est une composition originale inspirée de la navigation institutionnelle et des entrées par public du site HKU, sans reprise de ses visuels ou textes.

## Union étudiante et galerie (19 octobre 2026)

`#/union` réunit l’actualité issue du communiqué transmis, les huit départements, le recrutement, les clubs/inscriptions existants et une galerie de 12 photos d’archives extraites des pages 40–43 du PDF d’introduction et de la diapositive 32 du PPT. Les articles des responsables et professeurs restent ceux publiés localement via le studio des clubs. Les rattachements des clubs aux départements ne sont pas inventés. Le lien Kdocs est celui du communiqué : disponibilité non vérifiée, aucune candidature transmise par le Hub. Les photos ne sont pas présentées comme celles d’événements actuels de l’ISU.

L’annuaire public rétablit une fiche de contact avant la demande de connexion : email si publié, modèle d’email copiable/téléchargeable, lien officiel et documents en images. Aucune adresse manquante n’est fabriquée. Les images SIE externes dépendent de la disponibilité du site source ; le lien vers le document original reste accessible.

## Photos intégrées et design de l’Union (19 octobre 2026, deuxième mise à jour)

La rubrique galerie est supprimée. Les 13 clubs utilisent des photos locales optimisées du site de référence demandé ; une illustration vectorielle originale reste disponible pour les nouveaux clubs et en cas d’échec de chargement. Les visuels d’ambiance (notamment pour les activités sans photo confirmée) sont étiquetés. Les huit départements ont une image contextualisée. `community-imagery.ts` centralise la sélection.

L’espace Union reprend les principes d’Imperial College Union : découverte des activités, engagement dans les départements et accès à la gestion pour les responsables. Le design et les textes sont propres au Hub. Les trois actualités SIE ajoutées sont datées et liées aux sources officielles ; il s’agit d’une sélection éditoriale statique mise à jour le 19 octobre 2026, sans synchronisation automatique. Les visuels ne sont pas une preuve d’affiliation officielle à l’ISU ou de composition actuelle d’une équipe. Provenance détaillée dans `public/media/SOURCES.md`.

## Nouveaux clubs, cinéma participatif et réactions (19 octobre 2026)

Le catalogue comporte 15 clubs, dont Xidian Calisthenics Club et Friday Movie Night. La description Calisthenics est celle transmise par l’utilisateur : entraînements hebdomadaires et défis mensuels annoncés, certificats universitaires seulement sous réserve d’approbation.

`#/union?tab=cinema` permet aux étudiants ayant une inscription active (en attente ou approuvée) de proposer des films. Le responsable de Friday Movie Night et les professeurs valident ou refusent les propositions, ouvrent et clôturent le vote et confirment le film. Un vote par compte et par séance, modifiable avant clôture ; les propositions en attente sont visibles uniquement par leur auteur et les modérateurs. Les noms des votants ne sont pas publics. Les anciennes séances sont archivées.

La publication d’articles reste réservée aux responsables de leurs clubs et aux professeurs. Les étudiants peuvent aimer les articles publiés et partager le texte avec son lien. Les liens d’articles, likes, propositions et votes restent **locaux au navigateur** : ils ne sont ni synchronisés entre étudiants sur des appareils différents ni envoyés au site Friday Movie Night de référence. Les partages incluent cette limite.

### Admissions, CV et activités intégrées · 19 octobre 2026

- Admissions : tableaux des 28 entrées Master et 21 entrées Doctorat des guides 2026, langues par programme, exigences et pièces détaillées, calendrier historique en heure de Pékin, frais et bourses. Les différences entre guides et présentations sont signalées ; aucune rentrée 2027 n'est annoncée.
- Dix visuels intégraux extraits des PDF fournis illustrent la recherche, les installations, les coopérations, l'environnement industriel et les débouchés. Source et page sont légendées, avec lien d'agrandissement. Les logos et statistiques ne constituent pas une promesse de partenariat, de stage ou d'emploi.
- Superviseurs : aperçu de la fiche SIE sur les cartes lorsqu'une image est disponible ; lecteur de toutes les pages originales, agrandissement et accès séparé aux coordonnées et au modèle d'email. Sans document indexé, le lien officiel est conservé ; aucun CV n'est inventé.
- Friday Movie Night : les propositions et votes sont un sous-onglet de la fiche du club, dans Clubs & inscriptions. L'ancien lien `#/union?tab=cinema` ouvre cette fiche pour préserver les liens existants. Le lien actuel est `#/union?tab=clubs&club=friday-movie-night&activity=cinema`.
- Les limites du prototype restent applicables : stockage local, rôles de démonstration, pas de synchronisation collective, pas de transmission des conversations à l'université.
