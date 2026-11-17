// Importe Express pour créer le serveur web et définir ses routes.
import express from "express";
// Importe une fonction qui convertit une URL de fichier en chemin système.
import { fileURLToPath } from "node:url";

// Crée l’application Express.
const app = express();
// Configure EJS comme moteur de rendu pour les pages HTML.
app.set("view engine", "ejs");
// Indique où trouver les fichiers EJS, à partir de l’emplacement de ce fichier.
app.set("views", fileURLToPath(new URL("./views/", import.meta.url)));
// Analyse les corps de requêtes envoyés en JSON et les rend accessibles dans req.body.
app.use(express.json());

// Stocke les citations en mémoire. Les modifications seront perdues au redémarrage.
const citations = [
  // Ajoute une citation d’exemple avec l’identifiant 1.
  { id: 1, texte: "Apprendre en pratiquant.", auteur: "Équipe du TP" },
];
// Réserve l’identifiant 2 pour la prochaine citation créée.
let prochainId = 2;

// Définit une fonction de validation réutilisée par les routes POST et PUT.
function estUneChaineNonVide(valeur) {
  // Vérifie que la valeur est une chaîne et contient au moins un caractère hors espaces.
  return typeof valeur === "string" && valeur.trim().length > 0;
}

// Affiche la page d’accueil quand le navigateur envoie une requête GET sur /.
app.get("/", (req, res) => {
  // Génère la page HTML depuis index.ejs et transmet le tableau des citations au template.
  res.render("index", { citations });
});

// Définit une route de test pour vérifier que le serveur répond.
app.get("/ping", (req, res) => {
  // Envoie un message au format texte brut.
  res.type("text/plain").send("Serveur de citations prêt.");
});

// Définit la route qui renvoie toutes les citations.
app.get("/citations", (req, res) => {
  // Envoie le tableau au format JSON avec le statut HTTP 200 par défaut.
  res.json(citations);
});

// Définit la route qui renvoie une citation selon son identifiant dans l’URL.
app.get("/citations/:id", (req, res) => {
  // Convertit le paramètre d’URL, reçu sous forme de chaîne, en nombre.
  const id = Number(req.params.id);
  // Cherche la première citation dont l’identifiant correspond.
  const citation = citations.find((element) => element.id === id);

  // Si find() renvoie undefined, aucune citation ne correspond.
  if (!citation) {
    // Envoie une réponse 404 et quitte la fonction pour éviter une deuxième réponse.
    return res.status(404).json({ message: "Citation introuvable" });
  }

  // Envoie la citation trouvée au format JSON.
  res.json(citation);
});

// Définit la route qui crée une nouvelle citation.
app.post("/citations", (req, res) => {
  // Lit le texte envoyé. Le ?. renvoie undefined si req.body est absent.
  const texte = req.body?.texte;
  // Lit l’auteur envoyé avec la même protection.
  const auteur = req.body?.auteur;

  // Vérifie que le texte et l’auteur sont tous les deux des chaînes non vides.
  if (!estUneChaineNonVide(texte) || !estUneChaineNonVide(auteur)) {
    // Renvoie une erreur 400 et arrête la création si un champ est invalide.
    return res.status(400).json({ message: "Texte et auteur obligatoires" });
  }

  // Construit la citation avec le prochain identifiant et retire les espaces aux extrémités.
  const citation = { id: prochainId, texte: texte.trim(), auteur: auteur.trim() };
  // Ajoute la nouvelle citation à la fin du tableau.
  citations.push(citation);
  // Incrémente le compteur pour que la prochaine citation ait un autre identifiant.
  prochainId += 1;

  // Renvoie la citation créée avec le statut HTTP 201 « Created ».
  res.status(201).json(citation);
});

// Définit la route qui remplace le texte et l’auteur d’une citation existante.
app.put("/citations/:id", (req, res) => {
  // Convertit l’identifiant de l’URL en nombre.
  const id = Number(req.params.id);
  // Récupère l’objet citation directement dans le tableau.
  const citation = citations.find((element) => element.id === id);

  // Vérifie que la citation à modifier existe.
  if (!citation) {
    // Renvoie une erreur 404 et arrête le traitement si l’identifiant est introuvable.
    return res.status(404).json({ message: "Citation introuvable" });
  }

  // Récupère le nouveau texte dans le corps de la requête.
  const texte = req.body?.texte;
  // Récupère le nouvel auteur dans le corps de la requête.
  const auteur = req.body?.auteur;

  // Vérifie les deux champs avant de modifier la citation.
  if (!estUneChaineNonVide(texte) || !estUneChaineNonVide(auteur)) {
    // Renvoie une erreur 400 si l’un des champs est manquant ou invalide.
    return res.status(400).json({ message: "Texte et auteur obligatoires" });
  }

  // Modifie le texte de l’objet stocké dans le tableau.
  citation.texte = texte.trim();
  // Modifie l’auteur du même objet.
  citation.auteur = auteur.trim();
  // Renvoie la citation mise à jour au format JSON.
  res.json(citation);
});

// Définit la route qui supprime une citation selon son identifiant.
app.delete("/citations/:id", (req, res) => {
  // Convertit l’identifiant de l’URL en nombre.
  const id = Number(req.params.id);
  // Cherche la position de la citation dans le tableau. La première position vaut 0.
  const index = citations.findIndex((element) => element.id === id);

  // findIndex() renvoie -1 quand aucun élément ne correspond.
  if (index === -1) {
    // Renvoie une erreur 404 et arrête le traitement avant d’appeler splice().
    return res.status(404).json({ message: "Citation introuvable" });
  }

  // Supprime exactement un élément à la position trouvée.
  citations.splice(index, 1);
  // Termine la réponse avec le statut HTTP 204 « No Content », sans corps.
  res.status(204).end();
});

// Démarre le serveur sur le port 3000.
app.listen(3000, () => {
  // Affiche l’adresse dans le terminal dès que le serveur écoute.
  console.log("API disponible sur http://localhost:3000");
});
