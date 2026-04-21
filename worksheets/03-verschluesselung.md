# Arbeitsblatt 3: Kryptographie — die Caesar-Chiffre

> **Lernziele:** Du lernst, wie eine einfache Verschlüsselung funktioniert,
> implementierst sie in JavaScript und führst dein eigenes Programm über die
> Kommandozeile aus.
>
> **Zeit:** ca. 45 Minuten

---

## Hintergrund: Warum Verschlüsselung?

Wenn du Daten über ein Netzwerk schickst — ob eine Nachricht, ein Passwort oder
eine Kreditkartennummer — könnten sie theoretisch von Dritten abgefangen werden.
**Verschlüsselung** macht diese Daten für Unbefugte unlesbar.

Moderne Verschlüsselung (wie sie in HTTPS steckt, das du in Arbeitsblatt 2
gesehen hast) ist sehr komplex. Wir starten mit einer der ältesten und einfachsten
Methoden überhaupt: der **Caesar-Chiffre**.

---

## Die Caesar-Chiffre

Julius Caesar soll diese Methode verwendet haben, um militärische Botschaften
zu verschlüsseln. Das Prinzip: Jeder Buchstabe wird um eine feste Anzahl von
Stellen im Alphabet **verschoben**.

Beispiel mit Verschiebung **3**:

```
Klartext:   A  B  C  D  E  F  G  H  I  J  K  L  M
Geheimtext: D  E  F  G  H  I  J  K  L  M  N  O  P

Klartext:   N  O  P  Q  R  S  T  U  V  W  X  Y  Z
Geheimtext: Q  R  S  T  U  V  W  X  Y  Z  A  B  C
```

Das Wort `HALLO` wird so zu `KDOOR`:

```
H → K  (H ist der 8. Buchstabe, 8 + 3 = 11 → K)
A → D
L → O
L → O
O → R
```

Am Ende des Alphabets wird "umgebrochen": `X + 3 = A`, `Y + 3 = B`, `Z + 3 = C`.

---

## Deine Aufgabe: `caesar.js` vervollständigen

Im Ordner `crypto/` liegt die Datei `caesar.js`. Sie ist bereits größtenteils
fertig — du musst nur **vier markierte Stellen** (`TODO`) ergänzen.

Öffne die Datei in VS Code und lies sie durch, bevor du mit den Aufgaben beginnst.

---

## Block 1: Das Programm kennenlernen

### Aufgabe 1.1 — Hilfe aufrufen

Wechsle in den `crypto`-Ordner und führe das Programm ohne Argumente aus:

```bash
node caesar.js
```

Du siehst die verfügbaren Befehle:

```
Aufruf:
  node caesar.js encrypt     <text> <verschiebung>
  node caesar.js decrypt     <text> <verschiebung>
  node caesar.js brute-force <text>
  node caesar.js rot13       <text>

Beispiele:
  node caesar.js encrypt     "Hallo Welt" 3
  node caesar.js decrypt     "Kdoor Zhow" 3
  node caesar.js brute-force "Kdoor Zhow"
  node caesar.js rot13       "Hallo Welt"
```

**Fragen:**
- Was bedeutet `<text>`? Kannst du erkennen, was `<verschiebung>` sein soll?
- Wozu könnte `brute-force` nützlich sein?

**Aufgabe:** Lies die Datei `caesar.js` durch. Finde die vier `TODO`-Kommentare.
Lies auch die Erklärungen über jeder Funktion. Was macht die Funktion
`shiftChar`? Schreibe die Erklärung in eigenen Worten auf.

---

### Aufgabe 1.2 — Die Funktion `shiftChar` verstehen

Die fertige Funktion `shiftChar` macht die eigentliche Verschiebung.
Schaue dir diesen Ausschnitt an:

```javascript
const position = char.charCodeAt(0) - 65;
const newPosition = (position + shift + 26) % 26;
return String.fromCharCode(newPosition + 65);
```

- `charCodeAt(0)` gibt den **ASCII-Code** des Buchstabens zurück.
  Für `'A'` ist das `65`, für `'B'` ist es `66`, für `'Z'` ist es `90`.
- `- 65` rechnet den Buchstaben auf eine Position **0–25** um (`A=0, B=1, ..., Z=25`).
- `% 26` sorgt dafür, dass nach `Z` wieder bei `A` angefangen wird (Modulo-Rechnung).
- `+ 65` rechnet die Position wieder in einen ASCII-Code zurück.

Beispiel für `'H'` mit Verschiebung `3`:

```
'H' → charCode 72 → Position 7 (72 - 65)
(7 + 3 + 26) % 26 = 36 % 26 = 10
10 + 65 = 75 → 'K'
```

**Fragen:**
- Warum wird `+ 26` addiert, bevor das Modulo berechnet wird?
  Was würde passieren, wenn man es weglässt und die Verschiebung negativ ist?
  Beispiel: `(0 + (-3)) % 26` in JavaScript ergibt `-3`, nicht `23`.

**Aufgabe:** Berechne von Hand (ohne Computer), welcher Buchstabe
bei Verschiebung 13 aus `'A'` wird.
Rechne den Schritt für `'Z'` mit Verschiebung 3 nach — was kommt heraus?

---

## Block 2: Verschlüsseln implementieren

### Aufgabe 2.1 — Die Funktion `encrypt` ergänzen

Öffne `crypto/caesar.js` und suche die Funktion `encrypt`.
Du siehst das `TODO`:

```javascript
function encrypt(text, shift) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    // TODO: Ergaenze hier den fehlenden Code.
    // Rufe "shiftChar" mit dem i-ten Zeichen (text[i]) und "shift" auf.
    // Haenge das Ergebnis mit "+=" an "result" an.
  }

  return result;
}
```

**Was du tun musst:**
- Innerhalb der `for`-Schleife: Rufe `shiftChar` mit dem aktuellen Zeichen
  (`text[i]`) und `shift` auf.
- Hänge das Ergebnis an `result` an: `result += ...`

Ersetze den `// TODO`-Kommentar durch den fehlenden Code (eine Zeile).

Zum Testen:

```bash
node caesar.js encrypt "Hallo Welt" 3
```

Erwartete Ausgabe:

```
Original:       Hallo Welt
Verschiebung:   3
Verschluesselt: Kdoor Zhow
```

**Fragen:**
- Was gibt das Programm aus, wenn du als Text eine Zahl eingibst, z.B.
  `node caesar.js encrypt "123" 3`? Warum?

**Aufgabe:** Verschlüssele deinen eigenen Vornamen mit Verschiebung 7.
Notiere den Befehl und das Ergebnis.
Verschlüssele anschließend den Satz `"Das ist geheim!"` mit Verschiebung 13.

---

### Aufgabe 2.2 — Verschiedene Verschiebungen vergleichen

```bash
node caesar.js encrypt "Informatik" 1
node caesar.js encrypt "Informatik" 13
node caesar.js encrypt "Informatik" 25
```

Erwartete Ausgaben (nach korrekter Implementierung):

```
Verschluesselt: Jogpsnbujl
Verschluesselt: Vasbezngvx
Verschluesselt: Hmentsldji
```

**Fragen:**
- Was passiert bei Verschiebung 26? Führe es aus — überrascht dich das Ergebnis?
- Warum sind also nur die Verschiebungen 1–25 wirklich unterschiedlich?

**Aufgabe:** Verschlüssele `"ABCDEFGHIJKLMNOPQRSTUVWXYZ"` mit Verschiebung 3.
Was fällt an der Ausgabe auf? Was zeigt dir das über die Struktur der Chiffre?

---

## Block 3: Entschlüsseln implementieren

### Aufgabe 3.1 — Die Funktion `decrypt` ergänzen

Suche die Funktion `decrypt` in `caesar.js`:

```javascript
function decrypt(text, shift) {
  // TODO: Ersetze den Wert 0 durch den richtigen Ausdruck.
  // Hinweis: Wenn man mit +3 verschluesselt, wie entschluesselt man dann?
  return encrypt(text, 0);
}
```

Das Prinzip: Wenn man mit `+3` verschlüsselt, entschlüsselt man mit... was?
Ersetze den `0` durch den richtigen Ausdruck.

Tipp: Die Funktion `shiftChar` hat das `+ 26` extra drin,
damit auch negative Verschiebungen korrekt funktionieren.

Zum Testen:

```bash
node caesar.js decrypt "Kdoor Zhow" 3
```

Erwartete Ausgabe:

```
Verschluesselt: Kdoor Zhow
Verschiebung:   3
Original:       Hallo Welt
```

**Fragen:**
- Warum kann man zum Entschlüsseln einfach `encrypt` wiederverwenden,
  statt eine komplett neue Funktion zu schreiben?

**Aufgabe:** Entschlüssele die folgende Nachricht — sie wurde mit Verschiebung 5 verschlüsselt:
```
Inkwfxlxqjzsl nxm kzs
```
Was steht da?

---

### Aufgabe 3.2 — Verschlüsseln und Entschlüsseln kombinieren

```bash
node caesar.js encrypt "Geheimnis" 17
```

Notiere das Ergebnis. Führe dann aus:

```bash
node caesar.js decrypt "<dein Ergebnis>" 17
```

**Frage:** Bekommst du wieder `Geheimnis` zurück? Erkläre, warum das so sein muss.

**Aufgabe:** Schicke einem Mitschüler / einer Mitschülerin eine verschlüsselte Nachricht
(Verschiebung deiner Wahl) und lass ihn/sie sie entschlüsseln — aber nur wenn er/sie
die Verschiebung kennt. Wie übergibst du die Verschiebung "sicher"?

---

## Block 4: Brute-Force — ohne Schlüssel entschlüsseln

### Aufgabe 4.1 — Die Schleife in `bruteForce` ergänzen

Suche die Funktion `bruteForce` in `caesar.js`:

```javascript
function bruteForce(text) {
  console.log("Brute-Force: alle 25 moeglichen Verschiebungen\n");

  // TODO: Ersetze die beiden 0 durch die richtigen Zahlen (Start und Ende der Schleife).
  // Die Verschiebung soll von 1 bis 25 laufen.
  for (let shift = 0; shift <= 0; shift++) {
    const attempt = decrypt(text, shift);
    console.log(`Verschiebung ${shift.toString().padStart(2, " ")}: ${attempt}`);
  }
}
```

Ersetze die beiden `0` durch die richtigen Zahlen.
Die Schleife soll alle Verschiebungen von **1 bis 25** ausprobieren.

Zum Testen:

```bash
node caesar.js brute-force "Kdoor Zhow"
```

Erwartete Ausgabe (Auszug):

```
Brute-Force: alle 25 moeglichen Verschiebungen

Verschiebung  1: Jcnnq Ygnv
Verschiebung  2: Ibmmp Xfmu
Verschiebung  3: Hallo Welt
...
```

**Fragen:**
- Bei welcher Verschiebung siehst du lesbaren deutschen Text?
- Wie viele Verschiebungen musst du im schlimmsten Fall ausprobieren?

**Aufgabe:** Entschlüssele die folgende Nachricht mit Brute-Force —
du kennst die Verschiebung nicht:
```
Zhlm, khbgx Hfz!
```
Welche Verschiebung ergibt einen sinnvollen Text? Was steht da?

---

### Aufgabe 4.2 — Sicherheit der Caesar-Chiffre

```bash
node caesar.js brute-force "Ifmmp Xpsme"
```

**Fragen:**
- Wie lange brauchst du, um den Klartext zu finden?
- Warum ist die Caesar-Chiffre für echte Verschlüsselung ungeeignet?
- Moderne Verschlüsselung wie AES-256 hat `2^256` mögliche Schlüssel — das ist
  eine Zahl mit 77 Stellen. Wie lange würde ein Brute-Force dort dauern?

**Aufgabe:** Stelle dir vor, die Verschiebung wäre nicht 1–25, sondern du könntest
jeden Buchstaben auf einen beliebigen anderen abbilden (sogenannte Substitutionschiffre).
Wie viele verschiedene Schlüssel gäbe es dann für das lateinische Alphabet (26 Buchstaben)?
(Tipp: Das sind alle möglichen Anordnungen — Stichwort Permutation.)

---

## Block 5: ROT13 — ein Sonderfall

### Aufgabe 5.1 — Die Funktion `rot13` implementieren

ROT13 ist eine Caesar-Chiffre mit **Verschiebung 13**. Da das Alphabet genau
26 Buchstaben hat, gilt:

```
rot13(rot13(text)) == text
```

Verschlüsseln und Entschlüsseln sind **dieselbe Operation** — man wendet ROT13
einfach zweimal an.

Suche die Funktion `rot13` in `caesar.js`:

```javascript
function rot13(text) {
  // TODO: Ersetze den Rueckgabewert durch den richtigen Ausdruck.
  // Nutze eine der bereits vorhandenen Funktionen mit der richtigen Zahl.
  return "";
}
```

Ersetze `return ""` durch den richtigen Ausdruck in einer Zeile.
Nutze dafür eine der Funktionen, die du bereits implementiert hast.

Zum Testen:

```bash
node caesar.js rot13 "Hallo Welt"
```

Erwartete Ausgabe:

```
Original: Hallo Welt
ROT13:    Unyyb Jryg

ROT13 nochmal angewendet:
ROT13:    Hallo Welt
```

**Fragen:**
- Der zweite ROT13-Aufruf ergibt wieder das Original — warum?
- Überprüfe: Was ist ROT13 von `"ABCDEFGHIJKLMNOPQRSTUVWXYZ"`?

**Aufgabe:** ROT13 wurde früher in Internet-Foren verwendet, um Spoiler zu verstecken.
Entschlüssele diese Aussage (sie ist ROT13-kodiert):
```
Qnefgu Inqre vfg Yhxnf' Ingrne.
```
Führe den Befehl aus und notiere, was da steht.

---

### Aufgabe 5.2 — ROT13 im Vergleich

Führe beide Befehle aus und vergleiche:

```bash
node caesar.js encrypt "Geheimtext" 13
node caesar.js rot13   "Geheimtext"
```

**Frage:** Sind die Ergebnisse gleich? Warum?

**Aufgabe:** Kannst du jetzt `node caesar.js decrypt "..." 13` verwenden,
um einen ROT13-kodierten Text zu entschlüsseln? Probiere es aus.
Was sagt das über die Beziehung zwischen Verschlüsseln und Entschlüsseln bei ROT13?

---

## Zusammenfassung

Du hast heute:

- Die **Caesar-Chiffre** kennengelernt und von Hand angewendet
- Eine Node.js-Implementierung **gelesen, verstanden und ergänzt**
- Dein eigenes Programm über die **Kommandozeile** mit Argumenten aufgerufen
- Die **Unsicherheit** der Caesar-Chiffre durch Brute-Force erlebt
- **ROT13** als Sonderfall der Caesar-Chiffre implementiert

Die vier Funktionen, die du implementiert hast:

| Funktion | Was sie tut |
|----------|-------------|
| `encrypt(text, n)` | Verschiebt jeden Buchstaben um `n` Stellen |
| `decrypt(text, n)` | Dreht die Verschiebung um (ruft `encrypt` mit `-n` auf) |
| `bruteForce(text)` | Probiert alle 25 Verschiebungen aus |
| `rot13(text)` | Caesar mit Verschiebung 13 — Ver- und Entschlüsselung identisch |

---

## Verbindung zu den anderen Arbeitsblättern

- In **Arbeitsblatt 2** hast du gesehen, dass HTTPS deine Anfragen verschlüsselt.
  Dort steckt keine Caesar-Chiffre, sondern ein modernes Verfahren (TLS mit
  asymmetrischer Kryptographie) — aber das Grundprinzip ist dasselbe:
  Nachrichten werden so verändert, dass nur Berechtigte sie lesen können.
- In **Arbeitsblatt 1** hast du mit `nmap` offene Ports analysiert. Port 443
  (HTTPS) verschlüsselt den gesamten Traffic — genau das, was eine Caesar-Chiffre
  nicht leisten könnte.
