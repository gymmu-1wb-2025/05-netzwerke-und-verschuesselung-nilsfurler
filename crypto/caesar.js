// =============================================================================
// caesar.js — Caesar-Chiffre in Node.js
// =============================================================================
//
// Aufruf:
//   node caesar.js encrypt "Hallo Welt" 3
//   node caesar.js decrypt "Kdoor Zhow" 3
//   node caesar.js brute-force "Kdoor Zhow"
//   node caesar.js rot13 "Hallo Welt"
//
// =============================================================================

// -----------------------------------------------------------------------------
// Hilfsfunktion: Einzelnen Buchstaben verschieben
//
// Erklaerung:
//   - Wir arbeiten nur mit den Buchstaben A-Z (Gross- und Kleinbuchstaben).
//   - Sonderzeichen, Zahlen und Leerzeichen bleiben unveraendert.
//   - "charCodeAt(0)" gibt den ASCII-Code des Buchstabens zurueck.
//   - Fuer 'A' ist das 65, fuer 'Z' ist das 90.
//   - Fuer 'a' ist das 97, fuer 'z' ist das 122.
//   - Mit "% 26" sorgen wir dafuer, dass wir nach 'Z' wieder bei 'A' anfangen.
// -----------------------------------------------------------------------------
function shiftChar(char, shift) {
  // Ist es ein Grossbuchstabe (A-Z)?
  if (char >= "A" && char <= "Z") {
    // ASCII-Code von 'A' = 65
    // Beispiel: 'H' hat ASCII 72. 72 - 65 = 7 (Position im Alphabet, 0-basiert)
    // Mit Verschiebung 3: (7 + 3) % 26 = 10 → 'K'
    const position = char.charCodeAt(0) - 65;
    const newPosition = (position + shift + 26) % 26;
    return String.fromCharCode(newPosition + 65);
  }

  // Ist es ein Kleinbuchstabe (a-z)?
  if (char >= "a" && char <= "z") {
    // ASCII-Code von 'a' = 97
    const position = char.charCodeAt(0) - 97;
    const newPosition = (position + shift + 26) % 26;
    return String.fromCharCode(newPosition + 97);
  }

  // Kein Buchstabe: unveraendert zurueckgeben (Leerzeichen, Zahlen, !)
  return char;
}

// -----------------------------------------------------------------------------
// Aufgabe 2.1: Funktion zum Verschluesseln
//
// Diese Funktion bekommt einen Text und eine Verschiebung und gibt den
// verschluesselten Text zurueck.
//
// Sie soll jeden Buchstaben im Text einzeln durch "shiftChar" schicken
// und alle Ergebnisse zu einem neuen String zusammensetzen.
//
// Tipp: Schau dir an, wie "decrypt" weiter unten aufgebaut ist —
//       beide Funktionen sind sehr aehnlich.
// -----------------------------------------------------------------------------
function encrypt(text, shift) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    // TODO: Ergaenze hier den fehlenden Code.
    // Rufe "shiftChar" mit dem i-ten Zeichen (text[i]) und "shift" auf.
    // Haenge das Ergebnis mit "+=" an "result" an.
  }

  return result;
}

// -----------------------------------------------------------------------------
// Aufgabe 3.1: Funktion zum Entschluesseln
//
// Zum Entschluesseln dreht man die Verschiebung einfach um:
// Statt +3 verwendet man -3.
//
// Diese Funktion ist bereits fast fertig — es fehlt nur der richtige Wert
// fuer die Verschiebung beim Aufruf von "encrypt".
// Hinweis: Wenn man mit +3 verschluesselt, wie entschluesselt man dann?
// -----------------------------------------------------------------------------
function decrypt(text, shift) {
  // TODO: Ersetze den Wert 0 durch den richtigen Ausdruck.
  // Hinweis: Wenn man mit +3 verschluesselt, wie entschluesselt man dann?
  return encrypt(text, 0);
}

// -----------------------------------------------------------------------------
// Aufgabe 4.1: Brute-Force — alle 25 Verschiebungen ausprobieren
//
// Manchmal kennt man die Verschiebung nicht. Dann kann man einfach alle
// 25 moeglichen Verschiebungen ausprobieren und schauen, welche einen
// lesbaren Text ergibt.
//
// Die Schleife ist vorbereitet — ergaenze die beiden Schleifengrenzen.
// Die Verschiebung soll von 1 bis 25 laufen.
// -----------------------------------------------------------------------------
function bruteForce(text) {
  console.log("Brute-Force: alle 25 moeglichen Verschiebungen\n");

  // TODO: Ersetze die beiden 0 durch die richtigen Zahlen (Start und Ende der Schleife).
  // Die Verschiebung soll von 1 bis 25 laufen.
  for (let shift = 0; shift <= 0; shift++) {
    const attempt = decrypt(text, shift);
    console.log(`Verschiebung ${shift.toString().padStart(2, " ")}: ${attempt}`);
  }
}

// -----------------------------------------------------------------------------
// Aufgabe 5.1: ROT13 — der Sonderfall
//
// ROT13 ist eine Caesar-Verschluesselung mit Verschiebung 13.
// Besonderheit: Da das Alphabet 26 Buchstaben hat, ist ROT13 selbstinvers —
// zweimal angewendet ergibt wieder den Originaltext.
//
// Implementiere diese Funktion in einer einzigen Zeile.
// Tipp: Nutze eine der bereits vorhandenen Funktionen mit der richtigen Zahl.
// -----------------------------------------------------------------------------
function rot13(text) {
  // TODO: Ersetze den Rueckgabewert durch den richtigen Ausdruck.
  // Nutze eine der bereits vorhandenen Funktionen mit der richtigen Zahl.
  return "";
}

// =============================================================================
// Hauptprogramm — liest die Kommandozeilenargumente aus
// =============================================================================

const command = process.argv[2];
const text = process.argv[3];
const shift = parseInt(process.argv[4]);

if (!command || !text) {
  console.log("Aufruf:");
  console.log("  node caesar.js encrypt     <text> <verschiebung>");
  console.log("  node caesar.js decrypt     <text> <verschiebung>");
  console.log("  node caesar.js brute-force <text>");
  console.log("  node caesar.js rot13       <text>");
  console.log("");
  console.log("Beispiele:");
  console.log('  node caesar.js encrypt     "Hallo Welt" 3');
  console.log('  node caesar.js decrypt     "Kdoor Zhow" 3');
  console.log('  node caesar.js brute-force "Kdoor Zhow"');
  console.log('  node caesar.js rot13       "Hallo Welt"');
  process.exit(1);
}

if (command === "encrypt") {
  if (isNaN(shift)) {
    console.error("Fehler: Bitte eine Zahl als Verschiebung angeben.");
    process.exit(1);
  }
  const result = encrypt(text, shift);
  console.log(`Original:       ${text}`);
  console.log(`Verschiebung:   ${shift}`);
  console.log(`Verschluesselt: ${result}`);

} else if (command === "decrypt") {
  if (isNaN(shift)) {
    console.error("Fehler: Bitte eine Zahl als Verschiebung angeben.");
    process.exit(1);
  }
  const result = decrypt(text, shift);
  console.log(`Verschluesselt: ${text}`);
  console.log(`Verschiebung:   ${shift}`);
  console.log(`Original:       ${result}`);

} else if (command === "brute-force") {
  bruteForce(text);

} else if (command === "rot13") {
  const result = rot13(text);
  console.log(`Original: ${text}`);
  console.log(`ROT13:    ${result}`);
  console.log("");
  console.log("ROT13 nochmal angewendet:");
  console.log(`ROT13:    ${rot13(result)}`);

} else {
  console.error(`Unbekannter Befehl: ${command}`);
  console.error("Erlaubte Befehle: encrypt, decrypt, brute-force, rot13");
  process.exit(1);
}
