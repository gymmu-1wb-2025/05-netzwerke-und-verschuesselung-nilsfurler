# Arbeitsblatt 1: Netzwerke inspizieren

> **Lernziele:** Du lernst, wie du mit der Kommandozeile dein Netzwerk analysieren,
> Verbindungen prüfen und Dienste untersuchen kannst.
>
> **Zeit:** ca. 45 Minuten

---

## Bevor du loslegst

Öffne ein Terminal (in VS Code: `Strg + J` oder über das Menü `Terminal > New Terminal`).

Teste kurz, ob alles funktioniert:

```bash
echo "Hallo Netzwerk!"
```

Du solltest `Hallo Netzwerk!` als Ausgabe sehen.

---

## Block 1: Mein Gerät im Netzwerk

### Hintergrund

Jedes Gerät in einem Netzwerk hat eine **IP-Adresse** — eine eindeutige Nummer,
die es identifiziert. Es gibt zwei Versionen:

- **IPv4:** `192.168.1.42` — 4 Zahlen, je 0–255, durch Punkte getrennt
- **IPv6:** `fe80::1` — neueres Format, viel mehr mögliche Adressen

Eine besondere Adresse ist die **Loopback-Adresse** `127.0.0.1` (auch `localhost`):
Sie zeigt immer auf das eigene Gerät — hilfreich zum Testen.

Ein Gerät kann mehrere **Netzwerkschnittstellen** (Interfaces) haben:
- `lo` — Loopback (nur intern, verlässt das Gerät nie)
- `eth0` / `ens...` — Kabelverbindung
- `wlan0` / `wlp...` — WLAN

---

### Aufgabe 1.1 — Interfaces und IP-Adressen anzeigen

```bash
ip addr
```

> Kurzform: `ip a`

Du wirst eine Ausgabe sehen, die ungefähr so aussieht:

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    link/loopback 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host

2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether aa:bb:cc:dd:ee:ff
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
    inet6 fe80::1/64 scope link
```

- Jede nummerierte Zeile ist ein Interface (`1: lo`, `2: eth0`, ...).
- `inet` zeigt die IPv4-Adresse an, `inet6` die IPv6-Adresse.
- Das `/8` bzw. `/16` hinter der IP nennt sich **Subnetzmaske** und legt fest,
  welche Adressen zum gleichen Netz gehören.

**Fragen:**
- Wie viele Interfaces siehst du?
- Unter welchem Interface findest du `127.0.0.1`?
- Mit welchen Zahlen beginnt deine eigene IP-Adresse?

**Aufgabe:** `ip addr` zeigt alle Interfaces auf einmal. Finde heraus, wie du
mit demselben Befehl nur die Informationen zu einem *einzelnen* Interface anzeigen kannst —
z.B. nur für `eth0`. Tipp: `ip addr help` oder `ip addr show ?`

---

### Aufgabe 1.2 — Kompakte Übersicht

```bash
ip -brief addr
```

Die Ausgabe sieht so aus:

```
lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0             UP             172.17.0.2/16 fe80::1/64
```

Eine Zeile pro Interface: Name, Status (`UP`/`DOWN`/`UNKNOWN`) und IP-Adressen.

**Frage:** Was bedeutet der Status `UP` bei `eth0`?

**Aufgabe:** Der Befehl zeigt IP-Adressen kompakt. Probiere `ip -brief link` aus.
Was zeigt dieser Befehl im Vergleich zu `ip -brief addr` — was fehlt, was kommt dazu?

---

### Aufgabe 1.3 — MAC-Adresse anzeigen

```bash
ip link
```

Die Ausgabe enthält für jedes Interface eine Zeile wie:

```
link/ether aa:bb:cc:dd:ee:ff brd ff:ff:ff:ff:ff:ff
```

- Die **MAC-Adresse** (`aa:bb:cc:dd:ee:ff`) ist die fest eingebaute Hardware-Adresse
  deiner Netzwerkkarte — sie ist weltweit eindeutig.
- Sie besteht aus 6 Paaren Hexadezimalzahlen, getrennt durch Doppelpunkte.
- Im Gegensatz zur IP-Adresse wird sie nicht vergeben, sondern ist in der Hardware eingebaut.

**Frage:** Welche MAC-Adresse hat das Loopback-Interface `lo`? Was fällt dir daran auf?

**Aufgabe:** Die MAC-Adresse besteht aus zwei Hälften: Die ersten drei Paare (`aa:bb:cc`)
identifizieren den Hersteller der Netzwerkkarte (OUI). Notiere die MAC-Adresse deines
`eth0`-Interfaces und suche die ersten drei Paare auf `https://macvendors.com` —
welchem Hersteller gehört diese Adresse?

---

## Block 2: Erreichbarkeit prüfen

### Hintergrund

Mit **Ping** kannst du prüfen, ob ein anderes Gerät oder ein Server erreichbar ist.
Dein Rechner schickt kleine Pakete (sogenannte ICMP Echo Requests) und wartet
auf eine Antwort. Die Zeit dazwischen heißt **Latenz** (gemessen in Millisekunden, ms).

---

### Aufgabe 2.1 — Einen Server anpingen

```bash
ping -c 4 google.com
```

> `-c 4` bedeutet: sende genau 4 Pakete, dann stopp.
> Ohne `-c` läuft `ping` endlos — stoppen mit `Strg + C`.

Die Ausgabe sieht ungefähr so aus:

```
PING google.com (142.250.74.46) 56(84) bytes of data.
64 bytes from fra16s55-in-f14.1e100.net (142.250.74.46): icmp_seq=1 ttl=116 time=14.3 ms
64 bytes from fra16s55-in-f14.1e100.net (142.250.74.46): icmp_seq=2 ttl=116 time=13.8 ms
64 bytes from fra16s55-in-f14.1e100.net (142.250.74.46): icmp_seq=3 ttl=116 time=14.1 ms
64 bytes from fra16s55-in-f14.1e100.net (142.250.74.46): icmp_seq=4 ttl=116 time=14.9 ms

--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss
rtt min/avg/max/mdev = 13.8/14.3/14.9/0.4 ms
```

- `time=14.3 ms` — das ist die Latenz für dieses Paket.
- `0% packet loss` — alle Pakete sind angekommen.
- `ttl=116` — Time To Live: jeder Router auf dem Weg zählt diesen Wert um 1 herunter.
  Erreicht er 0, wird das Paket verworfen (verhindert endlose Weiterleitung).

**Fragen:**
- Wie hoch ist die Latenz bei dir (Wert hinter `time=`)?
- Sind alle 4 Pakete angekommen (`0% packet loss`)?

**Aufgabe:** Pinge statt `google.com` eine andere bekannte Adresse an — z.B. `cloudflare.com`
oder `github.com`. Vergleiche die Latenz: Welcher Server antwortet schneller?
Was könnte der Grund dafür sein?

---

### Aufgabe 2.2 — Loopback anpingen

```bash
ping -c 4 127.0.0.1
```

Die Latenz wird diesmal sehr viel kleiner sein — weit unter 1 ms:

```
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.045 ms
```

Das liegt daran, dass das Paket das Gerät nie verlässt. Es wird vom Betriebssystem
sofort beantwortet, ohne durch Kabel, Router oder das Internet zu reisen.

**Frage:** Vergleiche die Latenz mit Aufgabe 2.1. Was sagt dir der Unterschied
darüber, wie lange Netzwerkkommunikation dauert?

**Aufgabe:** `ping` kann auch mehr als 4 Pakete senden. Passe den Befehl so an,
dass er genau 10 Pakete sendet und schau dir die Statistikzeile am Ende an:
Wie groß ist die Schwankung zwischen dem schnellsten und dem langsamsten Paket (`mdev`)?

---

### Aufgabe 2.3 — Den Weg eines Pakets verfolgen

```bash
traceroute google.com
```

Die Ausgabe zeigt jeden Router (sogenannter **Hop**), über den das Paket reist:

```
traceroute to google.com (142.250.74.46), 30 hops max
 1  172.17.0.1       0.4 ms   0.3 ms   0.4 ms   ← Docker-Gateway
 2  192.168.1.1      2.1 ms   1.9 ms   2.0 ms   ← lokaler Router
 3  10.x.x.x         8.3 ms   8.1 ms   8.4 ms   ← ISP
 4  * * *                                        ← keine Antwort
 5  209.85.x.x      12.1 ms  11.9 ms  12.2 ms   ← Google-Netz
...
12  142.250.74.46   14.5 ms  14.3 ms  14.6 ms   ← Ziel erreicht
```

- Jede Zeile ist ein Router auf dem Weg.
- Die drei Zeitwerte sind drei Messdurchläufe für den gleichen Hop.
- `* * *` bedeutet: dieser Router antwortet nicht auf Traceroute-Anfragen
  (aus Sicherheitsgründen). Das Paket kommt trotzdem durch — es wird nur
  nicht bestätigt.

**Fragen:**
- Wie viele Hops braucht das Paket bis zu Google?
- Steigt die Latenz mit jedem Hop an? Warum macht das Sinn?
- Was ist die IP-Adresse des ersten Hops?

**Aufgabe:** Führe `traceroute` zu einem anderen Ziel aus — z.B. `yahoo.co.jp` (Japan).
Braucht das Paket mehr Hops als zu Google? Ab welchem Hop steigt die Latenz
besonders stark an? Was könnte das über den physischen Weg des Pakets verraten?

---

## Block 3: DNS — Namen statt Nummern

### Hintergrund

Menschen merken sich Namen wie `google.com` besser als IP-Adressen wie `142.250.74.46`.
Das **Domain Name System (DNS)** ist das "Telefonbuch des Internets":
Es übersetzt Domainnamen in IP-Adressen — und umgekehrt.

Bevor dein Browser eine Webseite lädt, fragt er immer zuerst einen **DNS-Server**
nach der zugehörigen IP-Adresse. Erst dann baut er die eigentliche Verbindung auf.

---

### Aufgabe 3.1 — Domain in IP-Adresse auflösen

```bash
nslookup google.com
```

Die Ausgabe sieht so aus:

```
Server:         127.0.0.11
Address:        127.0.0.11#53

Non-authoritative answer:
Name:    google.com
Address: 142.250.74.46
```

- `Server: 127.0.0.11` — das ist dein **DNS-Server** (im DevContainer ein
  Docker-interner DNS-Resolver). Er nimmt deine Anfrage entgegen und beantwortet sie.
- `#53` — DNS läuft standardmäßig auf Port 53.
- `Non-authoritative answer` — die Antwort kommt aus dem Cache, nicht direkt
  vom zuständigen DNS-Server von Google.
- Die IP-Adresse von Google kann sich bei jeder Abfrage leicht unterscheiden,
  weil Google viele Server weltweit betreibt (**Load Balancing**).

**Fragen:**
- Welche IP-Adresse bekommst du für `google.com`?
- Stimmt sie mit der IP überein, die `ping` in Aufgabe 2.1 angezeigt hat?

**Aufgabe:** Löse statt `google.com` eine andere Domain auf — z.B. die Domain deiner Schule.
Wie viele IP-Adressen bekommst du zurück? Manche Domains haben mehrere Einträge
(Load Balancing). Probiere auch `nslookup wikipedia.org` — was fällt auf?

---

### Aufgabe 3.2 — Detaillierte DNS-Abfrage

```bash
dig google.com
```

`dig` liefert viel mehr Details als `nslookup`. Die wichtigste Sektion ist `ANSWER SECTION`:

```
;; ANSWER SECTION:
google.com.     300    IN    A    142.250.74.46
```

- `google.com.` — die abgefragte Domain (der Punkt am Ende ist Teil der offiziellen Schreibweise)
- `300` — **TTL (Time To Live)** in Sekunden: Wie lange darf diese Antwort
  zwischengespeichert (gecacht) werden? Hier 300 Sekunden = 5 Minuten.
  Danach muss der DNS-Server neu gefragt werden.
- `IN` — Internet (Klasse des Eintrags, fast immer `IN`)
- `A` — Typ des Eintrags: `A` steht für eine IPv4-Adresse
- `142.250.74.46` — die aufgelöste IP-Adresse

**Frage:** Was passiert wohl, wenn du denselben Befehl zweimal innerhalb von 5 Minuten
ausführst — bekommst du immer die gleiche IP?

**Aufgabe:** `dig` kann auch gezielt einen anderen DNS-Server befragen — nicht den Standard-DNS.
Frage Googles DNS-Server `8.8.8.8` direkt an:
```bash
dig google.com @8.8.8.8
```
Vergleiche TTL und IP-Adresse mit der Ausgabe von vorhin. Gibt es einen Unterschied?

---

### Aufgabe 3.3 — Reverse-Lookup: IP → Name

```bash
host 8.8.8.8
```

Die Ausgabe:

```
8.8.8.8.in-addr.arpa domain name pointer dns.google.
```

Das Gegenteil der normalen DNS-Abfrage: aus einer IP-Adresse wird ein Name.
`8.8.8.8` ist der berühmte öffentliche DNS-Server von Google — er heißt `dns.google`.

**Frage:** Führe auch `host 1.1.1.1` aus. Wem gehört diese Adresse?

**Aufgabe:** Führe einen normalen Forward-Lookup durch und dann sofort den Reverse-Lookup:
```bash
host google.com
host <IP-Adresse-aus-dem-vorherigen-Ergebnis>
```
Bekommst du bei beiden denselben Namen zurück? Was könnte es bedeuten, wenn der
Reverse-Lookup einen anderen Namen liefert als der Forward-Lookup?

---

### Aufgabe 3.4 — Was passiert ohne DNS?

```bash
nslookup diese-domain-existiert-nicht-xyz123.com
```

Die Fehlermeldung:

```
** server can't find diese-domain-existiert-nicht-xyz123.com: NXDOMAIN
```

`NXDOMAIN` steht für "Non-Existent Domain". Der DNS-Server konnte keinen
Eintrag für diese Domain finden.

Ohne eine gültige DNS-Antwort hat dein Computer keine IP-Adresse — und ohne IP
kann keine Verbindung aufgebaut werden. DNS-Ausfälle können daher dazu führen,
dass Webseiten nicht erreichbar sind, obwohl das Internet selbst funktioniert.

**Frage:** Was würde passieren, wenn du versuchst, `https://diese-domain-existiert-nicht-xyz123.com`
im Browser zu öffnen?

**Aufgabe:** Frage einen DNS-Server direkt nach dem MX-Eintrag (Mail Exchange) einer Domain —
also welcher Server die E-Mails empfängt:
```bash
nslookup -type=MX gmail.com
```
Welcher Server ist für E-Mails an `gmail.com` zuständig? Was bedeutet die Zahl vor dem Servernamen?

---

## Block 4: Ports und Dienste

### Hintergrund

Ein Server kann viele verschiedene Dienste gleichzeitig anbieten — z.B. eine Webseite
und einen Dateiserver. **Ports** sind wie Türnummern eines Gebäudes: Jeder Dienst
hat seine eigene. Ein Client muss wissen, an welche Tür er klopfen soll.

Bekannte Standard-Ports:
| Port | Dienst | Protokoll |
|------|--------|-----------|
| 80   | HTTP — unverschlüsselte Webseiten | TCP |
| 443  | HTTPS — verschlüsselte Webseiten | TCP |
| 22   | SSH — verschlüsselter Fernzugriff | TCP |
| 53   | DNS — Namensauflösung | UDP/TCP |
| 25   | SMTP — E-Mail-Versand | TCP |

---

### Aufgabe 4.1 — Offene Ports anzeigen

```bash
ss -tulnp
```

Bedeutung der Optionen:
- `-t` — TCP-Verbindungen
- `-u` — UDP-Verbindungen
- `-l` — nur lauschende (listening) Ports, also Dienste die auf Verbindungen warten
- `-n` — Portnummern statt Namen anzeigen
- `-p` — zugehörige Programme anzeigen

Die Ausgabe könnte so aussehen:

```
Netid  State    Local Address:Port   Peer Address:Port  Process
udp    UNCONN   0.0.0.0:68           0.0.0.0:*          dhclient
tcp    LISTEN   0.0.0.0:22           0.0.0.0:*          sshd
```

- `LISTEN` — der Dienst wartet auf eingehende Verbindungen.
- `0.0.0.0:22` — lauscht auf Port 22, auf allen Netzwerkinterfaces.
- `UNCONN` (UDP) — UDP hat keine Verbindungen, der Dienst wartet trotzdem auf Pakete.

**Fragen:**
- Welche Ports sind auf deinem System offen?
- Welche Programme lauschen dahinter?

**Aufgabe:** `ss` kann auch aktive Verbindungen (nicht nur lauschende) zeigen.
Entferne das `-l` aus dem Befehl und führe `ss -tunp` aus, während du gleichzeitig
in einem anderen Terminal `ping google.com` laufen lässt. Siehst du einen Unterschied
in der Ausgabe? Was zeigt die Spalte `Peer Address`?

---

### Aufgabe 4.2 — Ports scannen mit nmap

```bash
nmap localhost
```

`nmap` scannt alle Standard-Ports und listet auf, welche offen sind:

```
Starting Nmap ...
Nmap scan report for localhost (127.0.0.1)
PORT   STATE  SERVICE
22/tcp open   ssh

Nmap done: 1 IP address (1 host up) scanned
```

> **Wichtig:** `nmap` auf fremde Systeme ohne ausdrückliche Erlaubnis einzusetzen
> ist in Deutschland nach § 202c StGB strafbar. Hier scannst du ausschließlich
> dein eigenes System (`localhost`).

**Frage:** Stimmen die offenen Ports mit der Ausgabe von `ss` aus Aufgabe 4.1 überein?

**Aufgabe:** Scanne statt `localhost` die IP-Adresse deines Gateways (aus Block 5, Aufgabe 5.1).
Welche Ports sind dort offen? Was sagen dir diese Ports über die Funktion des Geräts?

---

### Aufgabe 4.3 — Dienste und ihre Versionen erkennen

```bash
nmap -sV localhost
```

Mit `-sV` versucht `nmap` zusätzlich, die Versionen der laufenden Dienste zu erkennen:

```
PORT   STATE  SERVICE  VERSION
22/tcp open   ssh      OpenSSH 8.9 (protocol 2.0)
```

Diese Information ist für Administratoren wichtig: Veraltete Software-Versionen
können bekannte Sicherheitslücken enthalten.

**Frage:** Welche Version des SSH-Dienstes läuft auf deinem System?

**Aufgabe:** `nmap` kann auch einen bestimmten Port gezielt prüfen — ohne alle
Standard-Ports zu scannen. Schau in der `nmap`-Hilfe (`nmap --help`) nach der Option,
die nur Port 22 scannt, und führe den Befehl gegen `localhost` aus.

---

## Block 5: Routing — Wie Pakete ihren Weg finden

### Hintergrund

Wenn dein Computer ein Datenpaket verschickt, muss er entscheiden, wohin es soll.
Die **Routing-Tabelle** enthält Regeln dafür.

Das wichtigste Konzept ist das **Default Gateway** — der Router, an den alle Pakete
geschickt werden, die nicht im gleichen lokalen Netz sind. In einem Heimnetz ist das
meist dein WLAN-Router.

---

### Aufgabe 5.1 — Routing-Tabelle anzeigen

```bash
ip route
```

Die Ausgabe sieht so aus:

```
default via 172.17.0.1 dev eth0
172.17.0.0/16 dev eth0 proto kernel scope link src 172.17.0.2
```

- `default via 172.17.0.1` — das **Default Gateway**: alle Pakete ohne spezifischere
  Regel gehen an diese Adresse (den Router).
- `172.17.0.0/16 dev eth0` — Pakete in diesem Adressbereich (`172.17.x.x`) werden
  direkt über `eth0` verschickt, ohne Umweg über den Router.
- `src 172.17.0.2` — das ist die eigene IP-Adresse dieses Interfaces.

**Fragen:**
- Welche IP-Adresse hat dein Default Gateway?
- Welche Pakete werden direkt verschickt, ohne den Router?

**Aufgabe:** Passe `ip route get` so an, dass du die Route zu deinem Gateway selbst abfragst
(statt zu `8.8.8.8`). Was ist der Unterschied in der Ausgabe — gibt es ein `via`?
Was bedeutet es, wenn `via` fehlt?

---

### Aufgabe 5.2 — Route zu einem Ziel abfragen

```bash
ip route get 8.8.8.8
```

Die Ausgabe zeigt den konkreten Weg, den ein Paket zu `8.8.8.8` nehmen würde:

```
8.8.8.8 via 172.17.0.1 dev eth0 src 172.17.0.2 uid 1000
```

- `via 172.17.0.1` — das Paket wird über das Gateway geschickt.
- `dev eth0` — über dieses Interface.
- `src 172.17.0.2` — als Absenderadresse wird diese IP verwendet.

**Frage:** Vergleiche die Gateway-Adresse mit dem ersten Hop aus `traceroute` in
Aufgabe 2.3. Was stellst du fest?

**Aufgabe:** Frage die Route zu einer IP-Adresse ab, die im gleichen lokalen Netz liegt
(also mit dem gleichen Adresspräfix wie deine eigene IP, z.B. `172.17.0.1`).
Vergleiche die Ausgabe mit der Route zu `8.8.8.8`. Was ist der entscheidende Unterschied?

---

### Aufgabe 5.3 — Wer ist eine IP-Adresse?

```bash
whois 93.184.216.34
```

`whois` fragt eine Datenbank ab und zeigt Informationen über den Besitzer einer
IP-Adresse oder Domain an. Du siehst unter anderem:

- **OrgName / org** — Name der Organisation, der die IP gehört
- **Country** — das Land, in dem die IP registriert ist
- **NetRange** — der gesamte IP-Adressbereich dieser Organisation

`93.184.216.34` ist die IP-Adresse von `example.com`.

**Fragen:**
- Welcher Organisation gehört diese IP-Adresse?
- In welchem Land ist sie registriert?
- Führe auch `whois 8.8.8.8` aus — wem gehört Googles DNS-Server?

**Aufgabe:** Finde mit `nslookup` zunächst die IP-Adresse einer deutschen Nachrichtenseite
(z.B. `spiegel.de`). Führe dann `whois` auf diese IP aus. Steht der Server wirklich
in Deutschland, oder ist er woanders gehostet?

---

## Zusammenfassung

Du hast heute folgende Werkzeuge kennengelernt:

| Befehl | Was er macht |
|--------|-------------|
| `ip addr` | Eigene IP-Adressen und Interfaces anzeigen |
| `ip link` | MAC-Adressen anzeigen |
| `ip route` | Routing-Tabelle anzeigen |
| `ip route get <IP>` | Konkreten Weg zu einer Ziel-IP anzeigen |
| `ping` | Erreichbarkeit und Latenz prüfen |
| `traceroute` | Jeden Hop auf dem Weg zum Ziel sehen |
| `nslookup` | Domain in IP-Adresse auflösen |
| `dig` | Detaillierte DNS-Abfragen mit TTL und Eintragstyp |
| `host` | IP-Adresse in Domain auflösen (Reverse-Lookup) |
| `ss -tulnp` | Offene Ports und lauschende Dienste anzeigen |
| `nmap` | Ports eines Systems scannen |
| `whois` | Besitzer einer IP-Adresse oder Domain abfragen |
