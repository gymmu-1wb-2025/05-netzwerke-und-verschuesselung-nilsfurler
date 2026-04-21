# Arbeitsblatt 4: Kryptographie — Vigenère und XOR

> **Lernziele:** Du lernst, wie die Vigenère-Chiffre die Schwäche der Caesar-Chiffre
> überwindet, und verstehst das XOR-Verfahren — einen der Grundbausteine moderner
> Kryptographie.
>
> **Zeit:** ca. 45 Minuten
>
> **Voraussetzung:** Arbeitsblatt 3 (Caesar-Chiffre) sollte abgeschlossen sein.

---

## Hintergrund: Warum Caesar nicht sicher ist

In Arbeitsblatt 3 hast du erlebt, wie schnell die Caesar-Chiffre durch Brute-Force
geknackt werden kann: Es gibt nur 25 mögliche Schlüssel, und ein Computer probiert
sie in Millisekunden durch.

Selbst wenn man mehr mögliche Schlüssel hätte (z.B. eine Substitutionschiffre mit
26! ≈ 4 × 10²⁶ Möglichkeiten), bliebe ein Problem bestehen: die **Häufigkeitsanalyse**.
Im Deutschen kommt der Buchstabe 'e' am häufigsten vor — und der häufigste Buchstabe
im Geheimtext entspricht dann wahrscheinlich dem 'e'. Damit kann man den Schlüssel
erraten, ohne alle Möglichkeiten durchzuprobieren.

Das fundamentale Problem: Bei Caesar wird **jedes** Auftreten des Buchstabens 'A'
immer zum selben Geheimtext-Buchstaben. Die Häufigkeitsstruktur bleibt erhalten.

Die Lösung: Ein **variabler Schlüssel**.

---

## Die Vigenère-Chiffre

Blaise de Vigenère beschrieb diese Chiffre 1586. Statt eines festen Verschiebungswerts
verwendet sie ein **Schlüsselwort** — und jeder Buchstabe des Textes wird mit einem
anderen Buchstaben des Schlüsselworts verschlüsselt.

Beispiel: Schlüsselwort `"KEY"`, Klartext `"ANGRIFF"`:

```
Klartext:    A  N  G  R  I  F  F
Schlüssel:   K  E  Y  K  E  Y  K   ← Schlüssel wird wiederholt
Verschiebung:10  4 24 10  4 24 10   ← K=10, E=4, Y=24
Geheimtext:  K  R  E  B  M  D  P
```

Die Buchstaben des Schlüsselworts geben jeweils die Verschiebung an:
`A=0, B=1, C=2, ..., K=10, ..., Y=24, Z=25`.

Das Schlüsselwort wird so oft wiederholt, wie der Text lang ist.

**Warum ist das besser?** Der Buchstabe `'A'` wird je nach Position zu `'K'`, `'E'`
oder `'Y'` — der Geheimtext sieht statistisch gleichmäßiger aus. Häufigkeitsanalyse
funktioniert direkt nicht mehr.

---

## Das XOR-Verfahren

XOR (eXclusive OR) ist eine bitweise Operation aus der Digitaltechnik:

```
0 XOR 0 = 0
0 XOR 1 = 1
1 XOR 0 = 1
1 XOR 1 = 0   ← Beide gleich → 0 ("exklusiv": nur einer darf 1 sein)
```

Die entscheidende Eigenschaft: `A XOR B XOR B = A`

Das heißt: Wenn man einen Wert zweimal mit demselben Schlüssel XOR-verknüpft,
kommt wieder das Original heraus. Verschlüsseln und Entschlüsseln ist **dieselbe
Operation** — genau wie ROT13, aber viel flexibler.

In der Praxis arbeitet man mit den ASCII-Codes der Buchstaben (0–255).
Beispiel: `'H'` hat ASCII-Code 72, Schlüsselbyte `'K'` hat ASCII-Code 75:

```
'H' = 72  = 01001000 (binär)
'K' = 75  = 01001011 (binär)
XOR      = 00000011 = 3  → Geheimtext-Zeichen mit Code 3
```

Zum Entschlüsseln: `3 XOR 75 = 72 → 'H'` ✓

---

## Deine Aufgabe: `vigenere.js` und `xor.js` vervollständigen

Im Ordner `crypto/` liegen zwei Dateien:
- **`vigenere.js`** — drei TODOs (Blöcke 2–4)
- **`xor.js`** — drei TODOs (Block 5)

Öffne zunächst `vigenere.js` in VS Code und lies sie durch, bevor du mit den Aufgaben beginnst.

---

## Block 1: Das Programm kennenlernen

### Aufgabe 1.1 — Hilfe aufrufen

Rufe beide Skripte ohne Argumente auf:

```bash
node vigenere.js
node xor.js
```

Du siehst jeweils die verfügbaren Befehle:

```
# vigenere.js
Aufruf:
  node vigenere.js encrypt <text> <schluessel>
  node vigenere.js decrypt <text> <schluessel>
  node vigenere.js brute   <text> <max-laenge>

# xor.js
Aufruf:
  node xor.js encrypt <text> <schluessel>
  node xor.js decrypt <hex>  <schluessel>
  node xor.js brute   <hex>  <max-laenge>
```

**Fragen:**
- Was bedeutet `<schluessel>` hier im Vergleich zu `<verschiebung>` bei Caesar?
- Was könnte `<max-laenge>` beim Brute-Force bewirken?
- Was fällt dir beim `xor.js`-Aufruf von `decrypt` auf — was ist anders als bei `vigenere.js`?

**Aufgabe:** Lies beide Dateien durch. Finde die jeweils drei `TODO`-Kommentare.
Lies die Erklärungen über jeder Funktion. Notiere in eigenen Worten:
Was macht die Hilfsfunktion `getKeyShift` in `vigenere.js` und was macht `getByte` in `xor.js`?

---

### Aufgabe 1.2 — Schlüsselwiederholung verstehen

Die Funktion `getKeyShift` berechnet die Verschiebung für den *i*-ten Buchstaben
des Texts anhand des Schlüsselworts:

```javascript
const keyChar = key[i % key.length].toUpperCase();
return keyChar.charCodeAt(0) - 65;
```

- `i % key.length` sorgt dafür, dass der Schlüssel zyklisch wiederholt wird.
- `charCodeAt(0) - 65` rechnet den Schlüsselbuchstaben in eine Verschiebung 0–25 um
  (`A=0, B=1, ..., Z=25`).

Beispiel für Schlüssel `"KEY"` und Position `i=4`:

```
4 % 3 = 1  → key[1] = 'E'
'E' → charCode 69 → 69 - 65 = 4  → Verschiebung 4
```

**Fragen:**
- Was ist die Verschiebung für `i=6` mit Schlüssel `"KEY"`?
- Was passiert mit dem Schlüssel `"aaa"`? Welche Verschiebung ergibt das?

**Aufgabe:** Berechne von Hand die Verschiebungen für alle 7 Buchstaben von
`"ANGRIFF"` mit Schlüssel `"KEY"` (wie im Hintergrund-Beispiel oben).
Überprüfe: Stimmen sie mit der Tabelle in der Einführung überein?

---

## Block 2: Vigenère verschlüsseln

### Aufgabe 2.1 — Die Funktion `encrypt` ergänzen

Öffne `crypto/vigenere.js` und suche die Funktion `encrypt`.
Du siehst das `TODO`:

```javascript
function encrypt(text, key) {
  let result = "";
  let keyIndex = 0;  // Zaehlt nur Buchstaben-Positionen (kein Vorruecken bei Leerzeichen)

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z")) {
      // TODO: Ergaenze hier den fehlenden Code (2 Zeilen).
      // 1. Berechne die Verschiebung: Rufe "getKeyShift" mit "key" und "keyIndex" auf.
      // 2. Haenge "shiftChar(char, shift)" mit "+=" an "result" an.
      // 3. Erhoehere keyIndex um 1 (keyIndex++).
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
}
```

**Was du tun musst:** Ersetze den `// TODO`-Kommentar durch zwei Zeilen Code:
- Rufe `getKeyShift(key, keyIndex)` auf und speichere das Ergebnis in `shift`.
- Hänge `shiftChar(char, shift)` an `result` an.

(Das `keyIndex++` ist schon vorbereitet — zähle nur Buchstaben, nicht Leerzeichen.)

Zum Testen:

```bash
node vigenere.js encrypt "Hallo Welt" "KEY"
```

Erwartete Ausgabe:

```
Original:       Hallo Welt
Schluessel:     KEY
Verschluesselt: Rejvs Uopr
```

**Fragen:**
- Warum wird `keyIndex` nur bei Buchstaben erhöht, nicht bei Leerzeichen?
  Was würde sich ändern, wenn man es bei allen Zeichen erhöhen würde?

**Aufgabe:** Verschlüssele `"HALLO"` mit den Schlüsseln `"A"`, `"B"` und `"KEY"`.
Welches Ergebnis erhältst du bei Schlüssel `"A"`? Erkläre, warum.

---

### Aufgabe 2.2 — Schlüssellänge und Sicherheit

```bash
node vigenere.js encrypt "AAAAAAAAAA" "KEY"
node vigenere.js encrypt "AAAAAAAAAA" "AB"
node vigenere.js encrypt "AAAAAAAAAA" "A"
```

Erwartete Ausgaben (nach korrekter Implementierung):

```
Verschluesselt: KEYKEYKEYК
Verschluesselt: ABABABABAB
Verschluesselt: AAAAAAAAAA
```

**Fragen:**
- Was verrät die Ausgabe über die Struktur der Chiffre?
- Wenn der Angreifer weiß, dass der Klartext `"AAAAAA..."` war, was erfährt er
  dann direkt aus dem Geheimtext? Was sagt das über die Wahl des Klartexts?
- Warum ist ein langer, zufälliger Schlüssel besser als ein kurzes Wort?

**Aufgabe:** Verschlüssele `"ABCDEFGHIJ"` mit Schlüssel `"KEY"`.
Verschlüssele danach `"ABCDEFGHIJ"` mit Schlüssel `"KEYKEYKEYK"` (10 Zeichen).
Sind die Ergebnisse gleich? Erkläre, warum.

---

## Block 3: Vigenère entschlüsseln

### Aufgabe 3.1 — Die Funktion `decrypt` ergänzen

Suche die Funktion `decrypt` in `vigenere.js`:

```javascript
function decrypt(text, key) {
  // TODO: Ersetze "key" durch den richtigen Ausdruck.
  // Hinweis: Genau wie bei Caesar — was muss man mit der Verschiebung machen?
  // Schau dir an, wie "decrypt" in caesar.js aufgebaut war.
  return encrypt(text, key);
}
```

Das Prinzip ist dasselbe wie bei Caesar: Zum Entschlüsseln dreht man die Verschiebung um.
Aber hier kann man nicht einfach `-key` schreiben, weil der Schlüssel ein String ist.

Die Hilfsfunktion `invertKey` ist bereits fertig — sie dreht jeden Buchstaben des
Schlüsselworts um: `'K'` (Verschiebung 10) wird zu einer Verschiebung von `−10`,
also dem Buchstaben `'Q'` (26 − 10 = 16... nein, Moment).

Schaue dir `invertKey` in der Datei an. Sie berechnet für jeden Schlüsselbuchstaben
`c` den Buchstaben mit Verschiebung `(26 - shift) % 26`. Warum `% 26`?
(Tipp: Was ergibt `invertKey("A")`?)

Ersetze `key` durch den richtigen Funktionsaufruf.

Zum Testen:

```bash
node vigenere.js decrypt "Rejvs Uopr" "KEY"
```

Erwartete Ausgabe:

```
Verschluesselt: Rejvs Uopr
Schluessel:     KEY
Original:       Hallo Welt
```

**Fragen:**
- Warum braucht man `invertKey` überhaupt? Könnte man auch anders vorgehen?
  (Tipp: Wie war es bei `decrypt` in `caesar.js`?)

**Aufgabe:** Entschlüssele die folgende Nachricht — der Schlüssel ist `"INFO"`:

```
Qakczzfhqx ngb qns Thxh!
```

Was steht da?

---

### Aufgabe 3.2 — Gleicher Schlüssel, verschiedene Positionen

```bash
node vigenere.js encrypt "eeeeeeeee" "KEY"
```

**Fragen:**
- Alle Klartextbuchstaben sind `'e'`. Siehst du ein Muster im Geheimtext?
- Wie unterscheidet sich das von der Caesar-Chiffre?

**Aufgabe:** Führe denselben Test mit der Caesar-Chiffre aus:

```bash
node caesar.js encrypt "eeeeeeeee" 10
```

Vergleiche die Ausgaben. Was ist der entscheidende Unterschied, der
Vigenère gegen Häufigkeitsanalyse resistenter macht?

---

## Block 4: Vigenère Brute-Force

### Aufgabe 4.1 — Die Schleife in `bruteForce` ergänzen

Suche die Funktion `bruteForce` in `vigenere.js`:

```javascript
function bruteForce(text, maxKeyLength) {
  console.log(`Vigenere Brute-Force: alle Schluessel bis Laenge ${maxKeyLength}\n`);

  // TODO: Ersetze die 1 und 1 durch die richtigen Schleifengrenzen.
  // Die aeussere Schleife soll die Schluessellänge von 1 bis maxKeyLength durchlaufen.
  for (let len = 1; len <= 1; len++) {
    generateKeys(len, (key) => {
      const attempt = decrypt(text, key);
      console.log(`Schluessel "${key}": ${attempt}`);
    });
  }
}
```

Die Hilfsfunktion `generateKeys(len, callback)` ist bereits fertig — sie erzeugt
alle Schlüsselwörter aus Großbuchstaben der gegebenen Länge und ruft für jeden
`callback(key)` auf. Bei Länge 1 sind das 26 Schlüssel (`A`, `B`, ..., `Z`),
bei Länge 2 sind das 676 Schlüssel (`AA`, `AB`, ..., `ZZ`).

Ersetze das zweite `1` durch `maxKeyLength`.

> **Warnung:** Schon bei `max-laenge=3` gibt es 26³ = 17.576 Versuche —
> die Ausgabe wird sehr lang! Nutze zum Testen `max-laenge=1` oder `max-laenge=2`.

Zum Testen:

```bash
node vigenere.js brute "Rejvs Uopr" 1
```

Erwartete Ausgabe (Auszug):

```
Vigenere Brute-Force: alle Schluessel bis Laenge 1

Schluessel "A": Rejvs Uopr
Schluessel "B": Qdius Tnoq
...
```

Bei Schlüssellänge 1 gibt es keinen lesbaren deutschen Text — das ist korrekt,
denn der Schlüssel `"KEY"` hat 3 Buchstaben. Du musst `max-laenge 3` verwenden,
um den richtigen Schlüssel zu finden.

**Fragen:**
- Bei Schlüssellänge 1 ist Vigenère dasselbe wie was?
- Bei Schlüssellänge 3 gibt es 26³ = 17.576 Möglichkeiten. Wie viele wären
  es bei Schlüssellänge 10? Ist das immer noch per Brute-Force lösbar?

**Aufgabe:** Entschlüssele die folgende Nachricht mit `vigenere-brute` —
der Schlüssel hat maximal 2 Buchstaben:

```
Tqf ajve mobmisdu
```

(Tipp: Suche in der Ausgabe nach einem sinnvollen deutschen Satz.)
Welcher Schlüssel ergibt lesbaren Text?

---

### Aufgabe 4.2 — Grenzen des Brute-Force

```bash
node vigenere.js brute "Rejvs Uopr" 2
```

**Fragen:**
- Wie viele Zeilen gibt die Ausgabe aus? (26 + 26² = ?)
- Warum ist Brute-Force bei Vigenère mit langem Schlüssel unpraktisch,
  obwohl er bei Caesar trivial war?
- Ein echter Angreifer würde nicht alle Ausgaben manuell lesen. Welche
  Zusatzinformation könnte ein Programm nutzen, um automatisch den
  lesbaren Text zu erkennen?

**Aufgabe:** Überlege: Wenn der Schlüssel so lang wie der Text selbst ist
und **zufällig** gewählt wird, ist die Chiffre theoretisch unknackbar
(sogenanntes **One-Time-Pad**). Warum ist das in der Praxis trotzdem
schwer umzusetzen? (Tipp: Wie tauscht man den Schlüssel sicher aus?)

---

## Block 5: XOR-Verschlüsselung

### Aufgabe 5.1 — Die Funktion `encrypt` ergänzen

XOR arbeitet auf Byte-Ebene statt auf Buchstabenebene. Die Hilfsfunktion
`getByte` gibt den ASCII-Code des *i*-ten Schlüsselbuchstabens zurück
(zyklisch wiederholt, genau wie bei Vigenère).

Suche die Funktion `encrypt` in `xor.js`:

```javascript
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

  // Ausgabe als Hex-String (z.B. "1a 3f b2 ...")
  return result.map(b => b.toString(16).padStart(2, "0")).join(" ");
}
```

Der XOR-Operator in JavaScript ist `^`. Ersetze `0` durch den richtigen Ausdruck.

Zum Testen:

```bash
node xor.js encrypt "Hallo" "K"
```

Erwartete Ausgabe:

```
Original:       Hallo
Schluessel:     K
Verschluesselt: 03 2a 27 27 24
```

Die Ausgabe ist ein **Hex-String** — jede Zahl steht für ein Byte in
Hexadezimalschreibweise (Basis 16: 0–9, a–f).

**Fragen:**
- `'H'` hat ASCII-Code 72 (`0x48`), `'K'` hat ASCII-Code 75 (`0x4b`).
  Rechne `72 XOR 75` von Hand (als Binärzahl) — ergibt das `0x03 = 3`?
- Warum kann das Ergebnis kein lesbarer Text mehr sein?
  (Tipp: Was passiert, wenn das XOR-Ergebnis ein Steuerzeichen ist, z.B. Code 3?)

**Aufgabe:** Verschlüssele `"ABC"` mit Schlüssel `"A"`.
`'A'` hat ASCII-Code 65, `'B'` = 66, `'C'` = 67.
Berechne alle drei XOR-Werte von Hand und überprüfe mit dem Programm.

---

### Aufgabe 5.2 — XOR entschlüsseln

XOR ist selbstinvers: `a XOR b XOR b = a`.
Das bedeutet: Zum Entschlüsseln wendet man denselben Schlüssel nochmal an.

Suche die Funktion `decrypt` in `xor.js`:

```javascript
function decrypt(hexText, key) {
  // TODO: Ersetze "[]" durch den richtigen Ausdruck.
  // Hinweis: XOR ist selbstinvers — Verschluesseln und Entschluesseln sind identisch.
  // Aber Achtung: "hexText" ist ein Hex-String. Nutze "hexToBytes(hexText)",
  // um ihn erst in ein Byte-Array umzuwandeln, dann XOR anwenden.
  const bytes = [];

  return bytes.map(b => String.fromCharCode(b)).join("");
}
```

Die Hilfsfunktion `hexToBytes` ist bereits fertig — sie wandelt `"03 2a 27 27 24"`
in das Array `[3, 42, 39, 39, 36]` um.

**Was du tun musst:**
1. Wandle `hexText` in ein Byte-Array um: `hexToBytes(hexText)`
2. XOR-verknüpfe jedes Byte mit dem entsprechenden Schlüssel-Byte: `getByte(key, i)`
3. Wandle zurück in Text.

Die Schleife und Rückgabe sind schon vorbereitet — du musst nur `[]` durch
`hexToBytes(hexText)` ersetzen (und entsprechend iterieren, oder die vorhandene
`.map()`-Struktur nutzen). Schau dir den TODO-Kommentar genau an.

Zum Testen:

```bash
node xor.js decrypt "03 2a 27 27 24" "K"
```

Erwartete Ausgabe:

```
Verschluesselt: 03 2a 27 27 24
Schluessel:     K
Original:       Hallo
```

**Fragen:**
- Warum braucht `xor.js decrypt` keinen `invertKey`-Schritt wie `vigenere.js decrypt`?
- Was passiert, wenn du den falschen Schlüssel zum Entschlüsseln verwendest?
  Probiere es aus mit `"B"` statt `"K"`.

**Aufgabe:** Verschlüssele deinen Vornamen mit Schlüssel `"X"` und entschlüssele
das Ergebnis wieder. Notiere Befehl und Ausgabe.

---

### Aufgabe 5.3 — XOR Brute-Force

Suche die Funktion `bruteForce` in `xor.js`:

```javascript
function bruteForce(hexText, maxKeyLength) {
  console.log(`XOR Brute-Force: alle Schluessel bis Laenge ${maxKeyLength}\n`);

  // TODO: Ergaenze hier den fehlenden Code.
  // Genauso wie "bruteForce" — nutze "generateKeys" und "decrypt".
  // Ersetze "???" durch die richtigen Argumente und den richtigen Funktionsaufruf.
  for (let len = 1; len <= 1; len++) {
    generateKeys(len, (key) => {
      const attempt = "???";
      console.log(`Schluessel "${key}": ${attempt}`);
    });
  }
}
```

Diese Funktion hat zwei Stellen zu ergänzen:
1. Das zweite `1` → `maxKeyLength` (Schleifengrenze)
2. `"???"` → der richtige Funktionsaufruf zum Entschlüsseln

Zum Testen:

```bash
node xor.js brute "03 2a 27 27 24" 1
```

Erwartete Ausgabe (Auszug):

```
XOR Brute-Force: alle Schluessel bis Laenge 1

Schluessel "A": ...unlesbares Zeug...
...
Schluessel "K": Hallo
...
```

**Fragen:**
- Bei welchem Schlüssel siehst du lesbaren Text?
- Wie unterscheidet sich der Brute-Force bei XOR von dem bei Vigenère?
  (Tipp: Was ist bei XOR die "richtige" Ausgabe — Buchstaben oder Bytes?)

**Aufgabe:** Entschlüssele diesen XOR-verschlüsselten Text mit `xor-brute` —
der Schlüssel ist ein einzelner Großbuchstabe:

```
39 36 27 29 27 73 3d 36 26
```

Welcher Schlüssel und welcher Klartext ergibt sich?

---

## Zusammenfassung

Du hast heute:

- Die **Vigenère-Chiffre** verstanden und implementiert — ein Schlüsselwort statt
  einer festen Verschiebung
- Erlebt, warum **Schlüssellänge** die Sicherheit dramatisch beeinflusst
- Das **XOR-Verfahren** kennengelernt — selbstinvers und auf Byte-Ebene
- Beide Verfahren **per Brute-Force** angegriffen und deren Grenzen erlebt

Die sechs Funktionen, die du implementiert hast:

**`vigenere.js`**

| Funktion | Was sie tut |
|----------|-------------|
| `encrypt(text, key)` | Verschlüsselt mit wechselnden Verschiebungen (Schlüsselwort) |
| `decrypt(text, key)` | Kehrt die Verschiebungen um (nutzt `invertKey`) |
| `bruteForce(text, n)` | Probiert alle Schlüssel bis Länge `n` durch |

**`xor.js`**

| Funktion | Was sie tut |
|----------|-------------|
| `encrypt(text, key)` | XOR-verknüpft jeden Buchstaben mit dem Schlüssel (→ Hex) |
| `decrypt(hex, key)` | Kehrt XOR um — mit demselben Schlüssel! |
| `bruteForce(hex, n)` | Brute-Force für XOR bis Schlüssellänge `n` |

---

## Verbindung zu den anderen Arbeitsblättern

- **Arbeitsblatt 3:** Caesar ist ein Sonderfall von Vigenère (Schlüssel der Länge 1).
  ROT13 ist Caesar mit Verschiebung 13 — und XOR ist ebenfalls selbstinvers,
  wenn man zweimal denselben Schlüssel anwendet.
- **Arbeitsblatt 2:** HTTPS nutzt kein Vigenère und kein XOR direkt — aber
  **AES** (der Standard-Algorithmus für symmetrische Verschlüsselung) baut
  auf XOR als einem seiner Kernbausteine auf. Die Idee "XOR mit einem Schlüsselstrom"
  steckt auch im modernen **ChaCha20**-Algorithmus.
- **Arbeitsblatt 1:** Port 443 (HTTPS) schützt dein Daten mit denselben Prinzipien —
  nur mit einem kryptografisch sicheren Schlüsselstrom statt einem kurzen Wort.
