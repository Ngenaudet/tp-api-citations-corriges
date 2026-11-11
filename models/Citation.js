import mongoose from "mongoose";

const citationSchema = new mongoose.Schema({
  // TODO : déclarer texte et auteur comme chaînes requises et nettoyées.
});

export default mongoose.model("Citation", citationSchema);
