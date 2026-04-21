// =============================================================================
// vigenere.js — Vigenere-Chiffre in Node.js
// =============================================================================
//
// Aufruf:
//   node vigenere.js encrypt   <text> <schluessel>
//   node vigenere.js decrypt   <text> <schluessel>
//   node vigenere.js brute     <text> <max-laenge>
//
// Beispiele:
//   node vigenere.js encrypt "Hallo Welt" "KEY"
//   node vigenere.js decrypt "Rejvs Uopr" "KEY"
//   node vigenere.js brute   "Rejvs Uopr" 3
//
// =============================================================================

// -----------------------------------------------------------------------------
// Hilfsfunktion (aus caesar.js): Einzelnen Buchstaben verschieben
//
// Wie bereits bekannt:
//   - Nur Buchstaben A-Z und a-z werden verschoben.
//   - Sonderzeichen, Zahlen und Leerzeichen bleiben unveraendert.
//   - Nutzt ASCII-Codes und Modulo-Arithmetik fuer den Umbruch am Alphabetende.
// -----------------------------------------------------------------------------
function shiftChar(char, shift) {
  if (char >= "A" && char <= "Z") {
    const position = char.charCodeAt(0) - 65;
    const newPosition = (position + shift + 26) % 26;
    return String.fromCharCode(newPosition + 65);
  }
  if (char >= "a" && char <= "z") {
    const position = char.charCodeAt(0) - 97;
    const newPosition = (position + shift + 26) % 26;
    return String.fromCharCode(newPosition + 97);
  }
  return char;
}

// -----------------------------------------------------------------------------
// Hilfsfunktion: Verschiebung fuer den i-ten Buchstaben aus dem Schluessel holen
//
// Erklaerung:
//   - "key" ist das Schluesselwort (z.B. "KEY").
//   - "i" ist die aktuelle Buchstabenposition im Text (0-basiert, zaehlt nur
//     Buchstaben — Leerzeichen werden uebersprungen).
//   - "i % key.length" sorgt dafuer, dass der Schluessel zyklisch wiederholt wird:
//     Bei Schluessel "KEY" (Laenge 3):  0→K, 1→E, 2→Y, 3→K, 4→E, ...
//   - "charCodeAt(0) - 65" rechnet den Buchstaben in eine Verschiebung um:
//     A=0, B=1, C=2, ..., K=10, ..., Z=25
// -----------------------------------------------------------------------------
function getKeyShift(key, i) {
  // Schluessel zyklisch wiederholen und in Grossbuchstaben umwandeln
  const keyChar = key[i % key.length].toUpperCase();
  // Buchstaben in Verschiebung (0-25) umrechnen
  return keyChar.charCodeAt(0) - 65;
}

// -----------------------------------------------------------------------------
// Hilfsfunktion: Schluessel invertieren (fuer decrypt)
//
// Fuer jeden Buchstaben c im Schluessel wird die "Gegenverschluesslung" berechnet:
// Wenn c eine Verschiebung von +k bedeutet, liefert invertKey die Verschiebung -k.
//
// Beispiel: 'K' hat Verschiebung 10. invertKey liefert (26 - 10) % 26 = 16 → 'Q'.
// Denn: shiftChar(..., +10) gefolgt von shiftChar(..., +16) = shiftChar(..., +26) = unveraendert.
// -----------------------------------------------------------------------------
function invertKey(key) {
  let inverted = "";
  for (let i = 0; i < key.length; i++) {
    const shift = getKeyShift(key, i);
    const invertedShift = (26 - shift) % 26;
    inverted += String.fromCharCode(invertedShift + 65);
  }
  return inverted;
}

// -----------------------------------------------------------------------------
// Hilfsfunktion: Alle Schluesselwoerter einer bestimmten Laenge erzeugen
//
// Erzeugt alle Kombinationen aus Grossbuchstaben der gegebenen Laenge
// und ruft fuer jede Kombination "callback(key)" auf.
//
// Beispiel: generateKeys(2, console.log) gibt "AA", "AB", ..., "ZZ" aus.
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
// VIGENERE-CHIFFRE
// =============================================================================

// -----------------------------------------------------------------------------
// Aufgabe 2.1: Vigenere-Verschluesselung
//
// Verschluesselt jeden Buchstaben im Text mit einer anderen Verschiebung —
// naemlich der, die der aktuelle Buchstabe des Schluesselworts vorgibt.
//
// Sonderzeichen und Leerzeichen bleiben unveraendert.
// "keyIndex" wird nur bei Buchstaben erhoeht, nicht bei Sonderzeichen.
// (Sonst wuerde ein Leerzeichen den Rhythmus des Schluessels verschieben.)
//
// Tipp: Nutze "getKeyShift(key, keyIndex)" fuer die aktuelle Verschiebung,
//       dann "shiftChar(char, shift)" fuer die eigentliche Verschiebung.
// -----------------------------------------------------------------------------
function encrypt(text, key) {
  let result = "";
  let keyIndex = 0; // Zaehlt nur Buchstaben-Positionen (kein Vorruecken bei Leerzeichen)

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z")) {
      // TODO: Ergaenze hier den fehlenden Code (2 Zeilen).
      // 1. Berechne die Verschiebung: Rufe "getKeyShift" mit "key" und "keyIndex" auf.
      // 2. Haenge "shiftChar(char, shift)" mit "+=" an "result" an.
      // (Das keyIndex++ unten ist bereits vorbereitet — zaehle nur Buchstaben.)
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
}

// -----------------------------------------------------------------------------
// Aufgabe 3.1: Vigenere-Entschluesselung
//
// Kehrt die Verschluesselung um, indem der Schluessel invertiert wird.
// "invertKey" berechnet fuer jeden Schlusselbuchstaben die Gegenverschluesslung.
//
// Beispiel: Schluessel "KEY" → invertierter Schluessel "QWC"
//   K (Verschiebung 10) → (26-10)%26 = 16 → Q
//   E (Verschiebung  4) → (26-4) %26 = 22 → W
//   Y (Verschiebung 24) → (26-24)%26 =  2 → C
//
// Tipp: Du musst nur eine Stelle aendern — ersetze "key" durch den
//       richtigen Funktionsaufruf.
// -----------------------------------------------------------------------------
function decrypt(text, key) {
  // TODO: Ersetze "key" durch den richtigen Ausdruck.
  // Hinweis: Zum Entschluesseln braucht man den invertierten Schluessel.
  // Nutze "invertKey(key)" anstelle von "key".
  return encrypt(text, key);
}

// -----------------------------------------------------------------------------
// Aufgabe 4.1: Brute-Force
//
// Probiert alle moeglichen Schluesselwoerter bis zur gegebenen Laenge durch.
// "generateKeys" erzeugt alle Kombinationen und ruft einen Callback auf.
//
// Warnung: Schon bei Laenge 3 gibt es 26^3 = 17.576 Schluessel!
// Die Ausgabe kann sehr lang werden — nutze kleine Werte fuer max-laenge.
//
// Tipp: Ersetze das zweite "1" durch "maxKeyLength" (Schleifengrenze).
// -----------------------------------------------------------------------------
function bruteForce(text, maxKeyLength) {
  console.log(`Vigenere Brute-Force: alle Schluessel bis Laenge ${maxKeyLength}\n`);

  // TODO: Ersetze das zweite 1 durch maxKeyLength (Schleifengrenze).
  // Die aeussere Schleife soll die Schluessellänge von 1 bis maxKeyLength durchlaufen.
  for (let len = 1; len <= 1; len++) {
    generateKeys(len, (key) => {
      const attempt = decrypt(text, key);
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
  console.log("  node vigenere.js encrypt <text> <schluessel>");
  console.log("  node vigenere.js decrypt <text> <schluessel>");
  console.log("  node vigenere.js brute   <text> <max-laenge>");
  console.log("");
  console.log("Beispiele:");
  console.log('  node vigenere.js encrypt "Hallo Welt" "KEY"');
  console.log('  node vigenere.js decrypt "Rejvs Uopr" "KEY"');
  console.log('  node vigenere.js brute   "Rejvs Uopr" 3');
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
