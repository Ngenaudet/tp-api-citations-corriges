import express from "express";

const app = express();
app.use(express.json());

const citations = [
  { id: 1, texte: "Apprendre en pratiquant.", auteur: "Équipe du TP" },
];
let prochainId = 2;

function estUneChaineNonVide(valeur) {
  return typeof valeur === "string" && valeur.trim().length > 0;
}

app.get("/citations", (req, res) => {
  res.json(citations);
});

app.get("/citations/:id", (req, res) => {
  const id = Number(req.params.id);
  const citation = citations.find((element) => element.id === id);

  if (!citation) {
    return res.status(404).json({ message: "Citation introuvable" });
  }

  res.json(citation);
});

app.post("/citations", (req, res) => {
  const texte = req.body?.texte;
  const auteur = req.body?.auteur;

  if (!estUneChaineNonVide(texte) || !estUneChaineNonVide(auteur)) {
    return res.status(400).json({ message: "Texte et auteur obligatoires" });
  }

  const citation = { id: prochainId, texte: texte.trim(), auteur: auteur.trim() };
  citations.push(citation);
  prochainId += 1;

  res.status(201).json(citation);
});

app.put("/citations/:id", (req, res) => {
  const id = Number(req.params.id);
  const citation = citations.find((element) => element.id === id);

  if (!citation) {
    return res.status(404).json({ message: "Citation introuvable" });
  }

  const texte = req.body?.texte;
  const auteur = req.body?.auteur;

  if (!estUneChaineNonVide(texte) || !estUneChaineNonVide(auteur)) {
    return res.status(400).json({ message: "Texte et auteur obligatoires" });
  }

  citation.texte = texte.trim();
  citation.auteur = auteur.trim();
  res.json(citation);
});

app.delete("/citations/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = citations.findIndex((element) => element.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Citation introuvable" });
  }

  citations.splice(index, 1);
  res.status(204).end();
});

app.listen(3000, () => {
  console.log("API disponible sur http://localhost:3000");
});
