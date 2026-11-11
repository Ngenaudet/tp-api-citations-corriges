# 03 · Enregistrer les citations dans MongoDB Atlas

[Parcours et rendu](PARCOURS.md) · Lance `npm install`.

## Prépare Atlas

1. Ouvre ton projet Atlas et sélectionne ton cluster. Crée un utilisateur de base de données avec des droits de lecture et d’écriture pour le TP.
2. Dans les paramètres d’accès réseau, ajoute l’adresse IP publique actuelle depuis laquelle tu travailles.
3. Ouvre **Connect → Drivers** pour ton cluster et copie l’URI Node.js. Copie `.env.example` vers `.env` et complète `MONGODB_URI` en remplaçant les valeurs de l’utilisateur de base de données. Si le mot de passe contient des caractères réservés, encode-les dans l’URI.
4. Vérifie que `git check-ignore .env` affiche `.env`. Garde le fichier `.env.example` vide de tout identifiant de connexion.

[Documentation de connexion MongoDB Atlas](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)

## Mini-cours

MongoDB enregistre des documents dans une collection. Avec Mongoose, un schéma décrit les champs d’un document et un modèle permet d’interroger la collection. Les appels à la base sont asynchrones. `await` te permet d’attendre le résultat avant de renvoyer la réponse HTTP. MongoDB attribue un `_id` à chaque citation.

## À toi de jouer

1. Déclare les champs `texte` et `auteur` dans `models/Citation.js` avec `String`, `required` et `trim`.
2. Complète la connexion avant le démarrage du serveur avec `process.env.MONGODB_URI` et l’option `dbName` réglée sur `tp_citations`. Lance `npm start` et vérifie que `GET /citations` renvoie un tableau.
3. Ajoute le POST avec `Citation.create`. Enregistre uniquement `texte` et `auteur`. Vérifie comme à la branche précédente que ce sont des chaînes non vides. Réponds 201 avec le document créé, ou 400 si les données sont invalides.
4. Ajoute `GET /citations/:id` avec `Citation.findById`. Utilise `mongoose.isObjectIdOrHexString` pour renvoyer 400 quand l’identifiant est mal formé et 404 quand il est valide mais absent.
5. Bonus si tu as le temps. Ajoute PUT et DELETE. Pour PUT, valide les deux champs, applique les validateurs Mongoose à la mise à jour et renvoie le document modifié. Pour DELETE, renvoie 204 sans corps. Les deux routes reprennent les règles 400 et 404 du GET par identifiant.

```bash
curl -i -X POST http://localhost:3000/citations -H 'Content-Type: application/json' -d '{"texte":"Je reste après le redémarrage.","auteur":"Ada"}'
curl -i http://localhost:3000/citations
curl -i http://localhost:3000/citations/invalide
curl -i http://localhost:3000/citations/000000000000000000000000
```

Copie le `_id` du POST, arrête le serveur, relance `npm start`, puis retrouve la citation sur `/citations/<id>`. Dans `RENDU.md`, indique le résultat du POST et du GET après redémarrage. Explique pourquoi la citation survit au redémarrage et comment tu distingues un identifiant invalide d’une citation absente.
