[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/SV3WmZIB)
# Netzwerke & Kryptographie — Praktisches Projekt

Dieses Repository enthält Materialien für den praktischen Unterrichtsteil
zum Thema **Computernetzwerke und Kryptographie** (Gymnasiale Oberstufe).

---

## Projektstruktur

```
05-networking/
├── .devcontainer/
│   ├── devcontainer.json             # DevContainer-Konfiguration
│   └── Dockerfile                    # Ubuntu 22.04 + Netzwerk-Tools + Node.js
├── worksheets/
│   ├── 01-netzwerk-inspektion.md    # Arbeitsblatt 1
│   ├── 02-http-und-apis.md          # Arbeitsblatt 2
│   ├── 03-verschluesselung.md       # Arbeitsblatt 3
│   └── 04-vigenere-xor.md           # Arbeitsblatt 4
├── crypto/
│   ├── caesar.js                     # Node.js-Skript AB3 (mit Lücken für SuS)
│   ├── vigenere.js                   # Node.js-Skript AB4 — Vigenère (mit Lücken)
│   └── xor.js                        # Node.js-Skript AB4 — XOR (mit Lücken)
├── solutions/                        # Musterlösungen (nur für Lehrkraft)
│   ├── 01-loesungen.md
│   ├── 02-loesungen.md
│   ├── 03-loesungen.md
│   ├── 04-loesungen.md
│   ├── caesar-loesung.js            # Vollständiges Skript AB3
│   ├── vigenere-loesung.js          # Vollständiges Skript AB4 — Vigenère
│   └── xor-loesung.js               # Vollständiges Skript AB4 — XOR
└── README.md
```

---

## Einrichtung

### Option A: GitHub Codespaces (empfohlen, nichts installieren nötig)

1. Repository auf GitHub öffnen
2. Grünen `Code`-Button klicken → `Codespaces` → `Create codespace on main`
3. Warten bis der Container gestartet ist (~1-2 Minuten)
4. Fertig — alle Tools sind verfügbar

### Option B: VS Code lokal

Voraussetzungen: [VS Code](https://code.visualstudio.com/) und
[Docker Desktop](https://www.docker.com/products/docker-desktop/)

1. Repository klonen: `git clone <repo-url>`
2. In VS Code öffnen
3. Benachrichtigung `Reopen in Container` bestätigen
   (oder: `Strg+Shift+P` → `Dev Containers: Reopen in Container`)
4. Warten bis der Container gebaut ist (~2-3 Minuten beim ersten Mal)

---

## Enthaltene Tools

| Tool | Befehl | Zweck |
|------|--------|-------|
| iproute2 | `ip addr`, `ip route` | IP-Adressen, Routing |
| iputils | `ping` | Erreichbarkeit prüfen |
| traceroute | `traceroute` | Netzwerkweg verfolgen |
| dnsutils | `nslookup`, `dig`, `host` | DNS-Abfragen |
| net-tools | `netstat`, `ifconfig` | Klassische Netzwerk-Tools |
| curl | `curl` | HTTP-Anfragen |
| nmap | `nmap` | Port-Scanner |
| whois | `whois` | Domain-Informationen |
| Node.js | `node`, `npm` | JavaScript (Krypto-Teil) |

---

## Arbeitsmaterialien

| Datei | Thema | Zeit | Status |
|-------|-------|------|--------|
| `worksheets/01-netzwerk-inspektion.md` | IP, Ping, DNS, Ports, Routing | 45 min | fertig |
| `worksheets/02-http-und-apis.md` | HTTP, curl, GET/POST/PUT/DELETE | 45 min | fertig |
| `worksheets/03-verschluesselung.md` | Caesar, ROT13 in Node.js | 45 min | fertig |
| `worksheets/04-vigenere-xor.md` | Vigenère, XOR, Brute-Force | 45 min | fertig |

---

## Hinweise für Lehrkräfte

- Musterlösungen liegen in `solutions/` — bitte nicht mit Schüler*innen teilen
- `nmap` auf fremde Systeme ist ohne Erlaubnis **illegal** — bitte im Unterricht betonen
- Der DevContainer läuft als Nicht-root-Benutzer (`student`), hat aber `sudo`-Rechte
- Für den Krypto-Teil ist Node.js bereits vorinstalliert
