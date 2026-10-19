# Passage du prototype à un service réel

GitHub Pages publie des fichiers statiques : les comptes et permissions qui y sont calculés ne sont pas une autorité de confiance. Ne pas collecter de vrais matricules, téléphones ou documents avant de disposer d’un backend opérationnel.

## Contrat de sécurité à implémenter sur le serveur

- Vérifier la connexion et les rôles dans une base de données maîtrisée par l’université ; ne jamais accepter un rôle fourni par le navigateur.
- Remplacer le code professeur public par des invitations nominatives, révocables et contrôlées par l’ISO.
- Utiliser une session serveur avec cookie sécurisé HttpOnly, Secure et une politique SameSite adaptée ; vérifier les protections CSRF selon les flux.
- Vérifier l’appartenance au club sur chaque lecture et mutation de demandes, membres et articles. Un responsable du club A ne doit pas pouvoir consulter ou modifier les données du club B en modifiant l’identifiant d’une requête.
- Vérifier côté serveur le consentement au partage des informations et conserver les seules données nécessaires.
- Stocker les médias dans un espace partagé, appliquer les limites de taille et de type côté serveur, vérifier les fichiers, limiter les quotas et utiliser des accès adaptés à leur visibilité.
- Conserver les brouillons hors du flux public ; tracer publications, changements de rôle et décisions sans journaliser les secrets.
- Planifier les alertes à l’heure de Pékin dans une tâche serveur, assurer leur idempotence et distinguer mise en file, envoi, échec et lecture.

## Conditions d’ouverture

L’équipe doit vérifier les parcours sur plusieurs appareils, les restrictions de rôle par requêtes directes, la révocation des sessions, la récupération de compte, la restauration d’une sauvegarde et le traitement des échecs d’envoi. Les obligations applicables à la Chine, à WeChat et aux pays des utilisateurs doivent être évaluées avec les interlocuteurs compétents ; ce dépôt ne certifie aucune conformité.
