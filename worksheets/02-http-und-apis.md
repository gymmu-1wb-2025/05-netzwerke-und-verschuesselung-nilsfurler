# Arbeitsblatt 2: HTTP und APIs

> **Lernziele:** Du lernst, wie Browser und Server miteinander kommunizieren,
> was HTTP-Methoden sind und wie du mit `curl` direkt mit einer API sprichst.
>
> **Zeit:** ca. 45 Minuten

---

## Hintergrund: Das HTTP-Protokoll

Wenn du eine Webseite aufrufst, läuft im Hintergrund folgendes ab:

1. Dein Browser schickt eine **HTTP-Anfrage** (Request) an den Server.
2. Der Server verarbeitet sie und schickt eine **HTTP-Antwort** (Response) zurück.
3. Die Antwort enthält einen **Statuscode** und meistens Inhalt (HTML, JSON, ...).

Jede HTTP-Anfrage hat eine **Methode**, die angibt, was getan werden soll:

| Methode | Bedeutung | Analogie |
|---------|-----------|----------|
| `GET` | Daten abrufen | Einen Brief lesen |
| `POST` | Neuen Datensatz erstellen | Einen neuen Brief schreiben |
| `PUT` | Bestehenden Datensatz ersetzen | Einen Brief komplett neu schreiben |
| `DELETE` | Datensatz löschen | Einen Brief vernichten |

**Statuscodes** signalisieren, was mit der Anfrage passiert ist:

| Code | Bedeutung |
|------|-----------|
| `200 OK` | Anfrage erfolgreich |
| `201 Created` | Neuer Datensatz wurde angelegt |
| `204 No Content` | Erfolgreich, aber keine Rückgabe (z.B. nach DELETE) |
| `301 Moved Permanently` | Weiterleitung |
| `400 Bad Request` | Fehler in der Anfrage |
| `404 Not Found` | Ressource nicht gefunden |
| `500 Internal Server Error` | Fehler auf dem Server |

---

## Die Test-API: JSONPlaceholder

Für diese Übungen verwenden wir **JSONPlaceholder** (`jsonplaceholder.typicode.com`) —
eine öffentliche API, die extra fürs Ausprobieren gemacht wurde. Sie enthält
Beispieldaten wie Blog-Beiträge, Kommentare und Nutzer.

Alle Änderungen (POST, PUT, DELETE) werden **nicht wirklich gespeichert** —
der Server tut so als ob, und gibt trotzdem eine sinnvolle Antwort zurück.
Damit kannst du gefahrlos alles ausprobieren.

**Datenformat:** Die API gibt **JSON** zurück — ein weit verbreitetes Format,
um strukturierte Daten zu übertragen:

```json
{
  "id": 1,
  "title": "Mein erster Beitrag",
  "body": "Das ist der Inhalt.",
  "userId": 1
}
```

---

## Block 1: GET — Daten abrufen

`GET` ist die häufigste HTTP-Methode — jeder normale Browser-Aufruf ist ein GET.

---

### Aufgabe 1.1 — Ersten Blick auf die API werfen

```bash
curl https://jsonplaceholder.typicode.com/posts/1
```

Die Antwort ist ein einzelner Blog-Beitrag im JSON-Format:
curl https://jsonplaceholder.typicode.com/posts/1
```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur ..."
}
```

- `userId` — welcher Nutzer diesen Beitrag erstellt hat
- `id` — die eindeutige Nummer dieses Beitrags
- `title` — der Titel
- `body` — der Inhalt

**Fragen:**
- Welche `id` hat der Beitrag?

**Aufgabe:** Ändere den Befehl so, dass du Beitrag Nummer 5 abrufst.
Wie lautet der vollständige Befehl? Was ist der Titel von Beitrag 5?
Probiere anschließend Beitrag 42 — was sind `userId` und `title`?

---

### Aufgabe 1.2 — Eine Liste abrufen

```bash
curl https://jsonplaceholder.typicode.com/posts
```

Du bekommst alle 100 Beiträge als JSON-Array zurück:

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "...",
    "body": "..."
  },
  {
    "userId": 1,
    "id": 2,
    ...
  },
  ...
]
```

Die eckigen Klammern `[...]` zeigen an, dass es sich um eine **Liste** (Array) handelt.

**Frage:** Wie viele Beiträge werden zurückgegeben? Scroll durch die Ausgabe — was fällt dir auf?

**Aufgabe:** JSONPlaceholder hat nicht nur Beiträge (`posts`), sondern auch andere Ressourcen.
Ersetze `posts` in der URL durch `users` und rufe die Liste ab. Welche Felder hat ein Nutzer?
Schau dir Nutzer Nr. 3 einzeln an — in welcher Stadt wohnt er laut den Daten?

---

### Aufgabe 1.3 — Mit Filtern arbeiten

```bash
curl "https://jsonplaceholder.typicode.com/posts?userId=1"
```

Das `?userId=1` am Ende ist ein **Query-Parameter** — er filtert die Ergebnisse.
Du bekommst nur Beiträge von Nutzer 1.

```json
[
  { "userId": 1, "id": 1, "title": "...", ... },
  { "userId": 1, "id": 2, "title": "...", ... },
  ...
]
```

**Frage:** Wie viele Beiträge hat Nutzer 1 geschrieben?

**Aufgabe:** Ändere den Query-Parameter auf `userId=3` — wie viele Beiträge hat Nutzer 3?
Die API hat auch eine Ressource `comments`. Finde alle Kommentare zu Beitrag 1:
Die URL dafür lautet `https://jsonplaceholder.typicode.com/comments?postId=1`.
Wie viele Kommentare gibt es zu Beitrag 1?

---

### Aufgabe 1.4 — HTTP-Header der Antwort sehen

```bash
curl -I https://jsonplaceholder.typicode.com/posts/1
```

`-I` (großes i) zeigt nur den **Response-Header**, nicht den Inhalt:

```
HTTP/2 200
date: Tue, 21 Apr 2026 08:00:00 GMT
content-type: application/json; charset=utf-8
content-length: 292
cache-control: max-age=43200
```

- `HTTP/2 200` — HTTP-Version und Statuscode
- `content-type: application/json` — die Antwort enthält JSON (nicht HTML!)
- `content-length: 292` — die Antwort ist 292 Bytes groß
- `cache-control: max-age=43200` — der Browser darf die Antwort bis zu 43200 Sekunden
  (= 12 Stunden) zwischenspeichern, ohne erneut zu fragen

**Fragen:**
- Welchen Statuscode erhältst du?
- Was ist der `content-type`? Was bedeutet das?

**Aufgabe:** Schau dir jetzt die Header der `users`-Liste an:
```bash
curl -I https://jsonplaceholder.typicode.com/users
```
Vergleiche den `content-length`-Wert mit dem von `/posts/1` aus dieser Aufgabe.
Welche Antwort ist größer? Macht das Sinn angesichts des Inhalts?

---

### Aufgabe 1.5 — Statuscode bei nicht vorhandener Ressource

```bash
curl -I https://jsonplaceholder.typicode.com/posts/9999
```

```
HTTP/2 404
```

Beitrag 9999 existiert nicht — der Server antwortet mit `404 Not Found`.

**Frage:** Was siehst du, wenn du denselben Befehl ohne `-I` ausführst
(also `curl https://jsonplaceholder.typicode.com/posts/9999`)?

**Aufgabe:** Welchen Statuscode liefert eine Ressource, die es grundsätzlich nicht gibt —
also kein falscher Eintrag, sondern eine komplett unbekannte URL?
```bash
curl -I https://jsonplaceholder.typicode.com/dieseRessourceGibtEsNicht
```
Ist der Code derselbe wie bei `/posts/9999`? Was würde `500` in diesem Kontext bedeuten?

---

## Block 2: POST — Daten erstellen

`POST` sendet neue Daten an den Server, um einen neuen Datensatz zu erstellen.
Im Gegensatz zu `GET` hat ein `POST`-Request auch einen **Body** — den Inhalt,
den du senden willst.

---

### Aufgabe 2.1 — Einen neuen Beitrag erstellen

```bash
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Mein Testbeitrag", "body": "Das ist der Inhalt.", "userId": 1}'
```

Erklärung der Optionen:
- `-X POST` — verwende die HTTP-Methode POST (statt des Standard-GET)
- `-H "Content-Type: application/json"` — setze einen **Header**, der dem Server
  mitteilt, dass wir JSON schicken
- `-d '...'` — der **Body** (Inhalt) der Anfrage — die Daten, die wir senden

Die Antwort des Servers:

```json
{
  "title": "Mein Testbeitrag",
  "body": "Das ist der Inhalt.",
  "userId": 1,
  "id": 101
}
```

Der Server hat den Beitrag "angelegt" und gibt ihn mit einer neuen `id` (101) zurück.
Der Statuscode wäre `201 Created`.

**Fragen:**
- Welche `id` bekommt dein neu erstellter Beitrag?
- Warum macht es Sinn, dass der Server die `id` vergibt — und nicht du sie selbst festlegst?

**Aufgabe:** Schreibe einen eigenen POST-Request: Erstelle einen Beitrag mit deinem eigenen
`title` und `body`. Verwende `userId: 5`. Notiere den vollständigen Befehl und
die Antwort des Servers.

---

### Aufgabe 2.2 — Statuscode beim Erstellen sehen

```bash
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "body": "Inhalt", "userId": 1}' \
  -w "\n\nStatuscode: %{http_code}\n"
```

`-w "\n\nStatuscode: %{http_code}\n"` gibt am Ende die HTTP-Statusnummer aus.

```json
{
  "title": "Test",
  "body": "Inhalt",
  "userId": 1,
  "id": 101
}

Statuscode: 201
```

`201 Created` — der Server signalisiert, dass eine neue Ressource erstellt wurde.
Das ist ein Unterschied zu `200 OK`, der einfach "alles gut" bedeutet.

**Frage:** Warum ist es sinnvoll, `201` statt `200` zu verwenden, wenn etwas neu erstellt wurde?

**Aufgabe:** Was passiert, wenn du den `Content-Type`-Header weglässt?
Führe denselben POST-Request ohne `-H "Content-Type: application/json"` aus und
vergleiche Antwort und Statuscode. Hat der Server die Daten trotzdem verstanden?

---

## Block 3: PUT — Daten ersetzen

`PUT` ersetzt einen bestehenden Datensatz vollständig durch neue Daten.
Im Gegensatz zu `POST` wird die URL des bestehenden Datensatzes angegeben.

---

### Aufgabe 3.1 — Einen Beitrag vollständig ersetzen

```bash
curl -X PUT https://jsonplaceholder.typicode.com/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "title": "Neuer Titel", "body": "Neuer Inhalt.", "userId": 1}'
```

Der Unterschied zu POST:
- Die URL enthält die ID des zu ersetzenden Datensatzes: `.../posts/1`
- Wir schicken den vollständigen, neuen Datensatz (inkl. `id`)

Die Antwort:

```json
{
  "id": 1,
  "title": "Neuer Titel",
  "body": "Neuer Inhalt.",
  "userId": 1
}
```

**Aufgabe:** Was würde passieren, wenn du `"body"` im `-d`-Parameter weglässt?
Versuche es — passe den `-d`-Parameter so an, dass `"body"` fehlt — und schau dir
die Antwort an. Was enthält die Antwort des Servers? Was sagt das über das
Verhalten von `PUT` aus?

---

### Aufgabe 3.2 — Statuscode bei PUT

```bash
curl -X PUT https://jsonplaceholder.typicode.com/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "title": "Neuer Titel", "body": "Neuer Inhalt.", "userId": 1}' \
  -w "\n\nStatuscode: %{http_code}\n"
```

```
Statuscode: 200
```

Bei `PUT` antwortet der Server mit `200 OK`, weil kein neues Objekt erstellt,
sondern ein bestehendes ersetzt wurde.

**Frage:** Was ist der Unterschied zwischen POST und PUT?
Wann würde man welche Methode verwenden?

**Aufgabe:** Ändere den PUT-Request so, dass du Beitrag 7 (statt Beitrag 1) aktualisierst.
Passe sowohl die URL als auch die `"id"` im Body entsprechend an.
Was muss in der URL und im Body übereinstimmen?

---

## Block 4: DELETE — Daten löschen

`DELETE` löscht einen bestehenden Datensatz.

---

### Aufgabe 4.1 — Einen Beitrag löschen

```bash
curl -X DELETE https://jsonplaceholder.typicode.com/posts/1 \
  -w "Statuscode: %{http_code}\n"
```

Die Antwort:

```
{}
Statuscode: 200
```

Der Server antwortet mit einem leeren JSON-Objekt `{}` und dem Statuscode `200 OK`.
(Bei manchen APIs ist es auch `204 No Content` — dann kommt gar kein Body zurück.)

**Frage:** Wenn du danach `curl https://jsonplaceholder.typicode.com/posts/1` ausführst —
kommt der Beitrag zurück? Warum oder warum nicht?
(Zur Erinnerung: JSONPlaceholder speichert nichts wirklich.)

**Aufgabe:** Lösche einen anderen Beitrag — passe den Befehl für Beitrag 50 an.
Versuche außerdem, eine nicht existierende Ressource zu löschen (`/posts/9999`).
Bekommst du denselben Statuscode? Was würde eine echte API in diesem Fall zurückgeben?

---

### Aufgabe 4.2 — Alle Methoden im Vergleich

Führe alle vier Befehle aus und trage die Statuscodes in die Tabelle ein:

| Methode | Befehl | Statuscode | Bedeutung |
|---------|--------|------------|-----------|
| GET | `curl https://jsonplaceholder.typicode.com/posts/1` | ___ | |
| POST | `curl -X POST ... -d '{...}'` | ___ | |
| PUT | `curl -X PUT .../posts/1 ... -d '{...}'` | ___ | |
| DELETE | `curl -X DELETE .../posts/1` | ___ | |

Tipp: Füge jeweils `-w "\nStatuscode: %{http_code}\n"` ans Ende.

---

## Block 5: Verbindung zu Arbeitsblatt 1

Die HTTP-Kommunikation, die du hier mit `curl` beobachtest, nutzt intern alle
Konzepte aus Arbeitsblatt 1:

---

### Aufgabe 5.1 — DNS hinter einer API-URL

Bevor `curl` die Anfrage senden kann, muss der Domainname aufgelöst werden:

```bash
nslookup jsonplaceholder.typicode.com
```

**Frage:** Welche IP-Adresse hat `jsonplaceholder.typicode.com`?

**Aufgabe:** Führe `nslookup` mehrmals hintereinander aus. Bekommst du immer dieselbe IP?
Führe zusätzlich `whois <IP-Adresse>` aus — welchem Unternehmen gehört die IP?
Überrascht dich das Ergebnis?

---

### Aufgabe 5.2 — Welchen Port nutzt HTTPS?

```bash
curl -v https://jsonplaceholder.typicode.com/posts/1 2>&1 | head -20
```

`-v` (verbose) zeigt den Verbindungsaufbau im Detail. In der Ausgabe findest du:

```
* Trying 104.21.x.x:443...
* Connected to jsonplaceholder.typicode.com (104.21.x.x) port 443
```

`443` ist der Standard-Port für HTTPS — genau wie in der Tabelle aus Arbeitsblatt 1.

**Frage:** Was wäre der Port, wenn die URL mit `http://` statt `https://` begänne?

**Aufgabe:** Schau dir mit `-v` auch den Verbindungsaufbau zu einer anderen API an —
z.B. `https://api.github.com`. Findest du ebenfalls Port 443?
Welche Zeile in der verbose-Ausgabe zeigt dir, dass eine TLS-Verschlüsselung
aufgebaut wurde?

---

### Aufgabe 5.3 — Weiterleitung bei HTTP

```bash
curl -I http://jsonplaceholder.typicode.com/posts/1
```

```
HTTP/1.1 301 Moved Permanently
Location: https://jsonplaceholder.typicode.com/posts/1
```

Der Server leitet automatisch auf HTTPS um — genauso wie bei Google in Aufgabe 5.3
des ersten Arbeitsblatts. Unverschlüsselte HTTP-Verbindungen werden heute von den
meisten Webservern auf HTTPS weitergeleitet.

**Frage:** Warum ist es wichtig, API-Anfragen über HTTPS statt HTTP zu senden?
Was könnte passieren, wenn man es nicht tut?

**Aufgabe:** Teste, ob `curl` der Weiterleitung automatisch folgt, wenn du `-L` hinzufügst:
```bash
curl -L http://jsonplaceholder.typicode.com/posts/1
```
Bekommst du jetzt die Daten? Füge zusätzlich `-v` hinzu und erkläre anhand der Ausgabe,
was hinter den Kulissen passiert (wie viele Verbindungen werden aufgebaut?).

---

## Zusammenfassung

Du hast heute die vier wichtigsten HTTP-Methoden kennengelernt:

| Methode | Zweck | Typischer Statuscode |
|---------|-------|---------------------|
| `GET` | Daten abrufen | 200 OK |
| `POST` | Neuen Datensatz erstellen | 201 Created |
| `PUT` | Bestehenden Datensatz ersetzen | 200 OK |
| `DELETE` | Datensatz löschen | 200 OK / 204 No Content |

Und diese `curl`-Optionen:

| Option | Bedeutung |
|--------|-----------|
| `-X POST` | HTTP-Methode festlegen |
| `-H "..."` | HTTP-Header setzen |
| `-d '...'` | Body (Inhalt) der Anfrage |
| `-I` | Nur Response-Header anzeigen |
| `-v` | Alle Details der Verbindung anzeigen |
| `-L` | Weiterleitungen automatisch folgen |
| `-w "%{http_code}"` | Statuscode am Ende ausgeben |
