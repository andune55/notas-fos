import { db } from "../src/db.js";

const listas = db.prepare("SELECT id, list_key, usuario FROM lists").all();
const notas = db.prepare("SELECT id, list_key, usuario FROM notes").all();

console.log("Listas:");
for (const l of listas) {
  console.log(`  ${l.id} (${l.list_key}): usuario=${l.usuario}`);
}
console.log("Notas:");
for (const n of notas) {
  console.log(`  ${n.id} (list_key=${n.list_key}): usuario=${n.usuario}`);
}