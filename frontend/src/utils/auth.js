// src/utils/auth.js
import sha256 from "crypto-js/sha256.js"; 

export function tripleHash(input) {
  let hashed = input;
  for (let i = 0; i < 3; i++) {
    hashed = sha256(hashed).toString();
  }
  return hashed;
}

const generatedHash = tripleHash("2025");
console.log("Triple hash of PIN:", generatedHash);

export const ADMIN_HASH =

  "16065a92300f83679c4da83d06f413fd452a044214608bc96b892a942e2b721d";

export function verifyAdminPin(pinInput) {
  const inputHash = tripleHash(pinInput);
  return inputHash === ADMIN_HASH;
}
