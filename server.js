import { createServer } from "node:http";

const citations = [
  { id: 1, texte: "Apprendre en pratiquant.", auteur: "Équipe du TP" },
];

const server = createServer((req, res) => {
  // Exemple : traiter une méthode et un chemin.
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Bienvenue dans l’API de citations !");
  }

  if (req.method === "GET" && req.url === "/citations") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(citations));
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route introuvable" }));
});

server.listen(3000, () => {
  console.log("Serveur disponible sur http://localhost:3000");
});
