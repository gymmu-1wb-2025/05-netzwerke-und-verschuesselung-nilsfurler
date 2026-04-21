// =============================================================================
// xor.js — XOR-Verschluesselung in Node.js
// =============================================================================
//
// Aufruf:
//   node xor.js encrypt <text> <schluessel>
//   node xor.js decrypt <hex>  <schluessel>
//   node xor.js brute   <hex>  <max-laenge>
//
// Beispiele:
//   node xor.js encrypt "Hallo" "K"
//   node xor.js decrypt "03 2a 27 27 24" "K"
//   node xor.js brute   "03 2a 27 27 24" 3
//
// =============================================================================

// -----------------------------------------------------------------------------
// Hilfsfunktion: Schluessel-Byte fuer Position i holen
//
// Erklaerung:
//   - "key" ist das Schluesselwort (z.B. "KEY").
//   - "i" ist die aktuelle Position im Text (0-basiert).
//   - "i % key.length" sorgt dafuer, dass der Schluessel zyklisch wiederholt wird.
//   - "charCodeAt" gibt den ASCII-Code des Schluesselzeichens zurueck — damit
//     arbeiten wir direkt auf Byte-Ebene statt auf Buchstabenebene.
//
// Beispiel: Schluessel "KEY", i=4
//   4 % 3 = 1 → key[1] = 'E' → ASCII 69
// -----------------------------------------------------------------------------
function getByte(key, i) {
  return key.charCodeAt(i % key.length);
}

// -----------------------------------------------------------------------------
// Hilfsfunktion: Hex-String in Byte-Array umwandeln
//
// Wandelt "03 2a 27 27 24" in [3, 42, 39, 39, 36] um.
// Jede zweistellige Hexzahl wird als Zahl interpretiert (Basis 16).
// -----------------------------------------------------------------------------
function hexToBytes(hexString) {
  return hexString.split(" ").map(h => parseInt(h, 16));
}

// -----------------------------------------------------------------------------
// Hilfsfunktion: Alle Schluesselwoerter einer bestimmten Laenge erzeugen
//
// Erzeugt alle Kombinationen aus Grossbuchstaben der gegebenen Laenge
// und ruft fuer jede Kombination "callback(key)" auf.
//
// Beispiel: generateKeys(1, console.log) gibt "A", "B", ..., "Z" aus.
// Anzahl: 26^len Schluessel (len=1: 26, len=2: 676, len=3: 17576, ...)
// -----------------------------------------------------------------------------
function generateKeys(len, callback) {
  function generate(current) {
    if (current.length === len) {
      callback(current);
      return;
    }
    for (let i = 0; i < 26; i++) {
      generate(current + String.fromCharCode(65 + i));
    }
  }
  generate("");
}

// =============================================================================
// XOR-VERSCHLUESSELUNG
// =============================================================================

// -----------------------------------------------------------------------------
// Aufgabe 5.1: XOR-Verschluesselung
//
// Verknuepft jeden Buchstaben des Texts per XOR mit dem entsprechenden
// Schluessel-Byte. Das Ergebnis ist ein Hex-String (z.B. "03 2a 27 27 24").
//
// Warum Hex? Weil XOR-Ergebnisse oft keine druckbaren Zeichen sind —
// ein Hex-String stellt die rohen Bytes lesbar dar.
//
// Der XOR-Operator in JavaScript ist "^".
// Beispiel: 72 ^ 75 = 3  (d.h. 'H' XOR 'K' = Byte 3)
//
// Tipp: Ersetze "0" durch den richtigen XOR-Ausdruck mit "textByte" und "keyByte".
// -----------------------------------------------------------------------------
function encrypt(text, key) {
  let result = [];

  for (let i = 0; i < text.length; i++) {
    const textByte = text.charCodeAt(i);
    const keyByte = getByte(key, i);

    // TODO: Ersetze 0 durch den richtigen XOR-Ausdruck.
    // Verknuepfe "textByte" und "keyByte" mit dem XOR-Operator (^) in JavaScript.
    const encryptedByte = 0;
    result.push(encryptedByte);
  }

  // Bytes als Hex-String ausgeben (z.B. "03 2a 27 27 24")
  return result.map(b => b.toString(16).padStart(2, "0")).join(" ");
}

// -----------------------------------------------------------------------------
// Aufgabe 5.2: XOR-Entschluesselung
//
// XOR ist selbstinvers: a XOR b XOR b = a.
// Das bedeutet: Verschluesseln und Entschluesseln sind dieselbe Operation!
// Man wendet denselben Schluessel nochmal an.
//
// Achtung: "hexText" ist ein Hex-String wie "03 2a 27 27 24".
// Nutze "hexToBytes(hexText)", um ihn in ein Byte-Array umzuwandeln.
// Dann XOR-verknuepfe jedes Byte mit dem Schluessel-Byte.
// Zuletzt: Wandle Bytes zurueck in Zeichen (String.fromCharCode).
//
// Tipp: Ersetze "[]" durch "hexToBytes(hexText)" — die XOR-Zeile ist schon vorbereitet.
// -----------------------------------------------------------------------------
function decrypt(hexText, key) {
  // TODO: Ersetze "[]" durch den richtigen Ausdruck: hexToBytes(hexText)
  const bytes = [];

  return bytes.map((b, i) => String.fromCharCode(b ^ getByte(key, i))).join("");
}

// -----------------------------------------------------------------------------
// Aufgabe 5.3: XOR Brute-Force
//
// Probiert alle moeglichen Schluessel bis zur gegebenen Laenge durch.
// Genauso aufgebaut wie der Vigenere-Brute-Force in vigenere.js.
//
// Tipp: Ergaenze beide fehlenden Stellen:
//   1. Schleifengrenze: zweites "1" → maxKeyLength
//   2. Funktionsaufruf: "???" → decrypt mit den richtigen Argumenten
// -----------------------------------------------------------------------------
function bruteForce(hexText, maxKeyLength) {
  console.log(`XOR Brute-Force: alle Schluessel bis Laenge ${maxKeyLength}\n`);

  // TODO: Ergaenze hier den fehlenden Code.
  // 1. Ersetze das zweite "1" durch maxKeyLength
  // 2. Ersetze "???" durch den richtigen Aufruf von decrypt
  for (let len = 1; len <= 1; len++) {
    generateKeys(len, (key) => {
      const attempt = "???";
      console.log(`Schluessel "${key}": ${attempt}`);
    });
  }
}

// =============================================================================
// Hauptprogramm — liest die Kommandozeilenargumente aus
// =============================================================================

const command = process.argv[2];
const text = process.argv[3];
const keyOrLength = process.argv[4];

if (!command || !text) {
  console.log("Aufruf:");
  console.log("  node xor.js encrypt <text> <schluessel>");
  console.log("  node xor.js decrypt <hex>  <schluessel>");
  console.log("  node xor.js brute   <hex>  <max-laenge>");
  console.log("");
  console.log("Beispiele:");
  console.log('  node xor.js encrypt "Hallo" "K"');
  console.log('  node xor.js decrypt "03 2a 27 27 24" "K"');
  console.log('  node xor.js brute   "03 2a 27 27 24" 3');
  process.exit(1);
}

if (command === "encrypt") {
  if (!keyOrLength) {
    console.error("Fehler: Bitte einen Schluessel angeben.");
    process.exit(1);
  }
  const result = encrypt(text, keyOrLength);
  console.log(`Original:       ${text}`);
  console.log(`Schluessel:     ${keyOrLength}`);
  console.log(`Verschluesselt: ${result}`);

} else if (command === "decrypt") {
  if (!keyOrLength) {
    console.error("Fehler: Bitte einen Schluessel angeben.");
    process.exit(1);
  }
  const result = decrypt(text, keyOrLength);
  console.log(`Verschluesselt: ${text}`);
  console.log(`Schluessel:     ${keyOrLength}`);
  console.log(`Original:       ${result}`);

} else if (command === "brute") {
  const maxLen = parseInt(keyOrLength) || 3;
  bruteForce(text, maxLen);

} else {
  console.error(`Unbekannter Befehl: ${command}`);
  console.error("Erlaubte Befehle: encrypt, decrypt, brute");
  process.exit(1);
}
