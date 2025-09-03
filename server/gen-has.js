import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
    console.log("Usa: node gen-hash.js tu_contraseña");
    process.exit(1);
}
const hash = bcrypt.hashSync(password, 8);
console.log("Hash generado:", hash);