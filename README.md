# Dialy — Diabetes-Begleiter

Dialy ist ein Alltagsbegleiter für Menschen mit Typ‑1‑ (und Typ‑2‑) Diabetes.
Er hilft bei drei Dingen: Kohlenhydrate einer Mahlzeit schätzen, Sport und
seine Wirkung auf den Blutzucker planen, und ein Tagebuch aus Mahlzeiten und
Blutzuckerwerten führen.

> **Dialy ist kein Medizinprodukt.** Die App berechnet **keine Insulindosen**
> und gibt **keine Therapieempfehlungen**. Sie dokumentiert nur selbst
> eingegebene Werte und schätzt Kohlenhydrate sowie einen *illustrativen*
> Blutzucker‑Trend.

Built with **React Native + TypeScript** on **Expo (managed workflow)**. Runs on
**iOS** and **Android**, fully **offline-first**, **dark-mode only**.

---

# 📲 Getting started (read this first)

Because Dialy is a **mobile** app, you run it on a phone or an emulator/simulator
— not in a browser. There are two ways to see it running:

| Method | Needs | Best for |
|---|---|---|
| **A. Expo Go on a real phone** | Just your phone + the Expo Go app | ✅ Fastest, works on **any** computer (Windows/Mac/Linux) |
| **B. Emulator / Simulator** | Android Studio (all OS) or Xcode (Mac only) | No phone needed; iOS Simulator only on macOS |

**If you just want to see it quickly: use Method A with your phone.** It takes
about 2 minutes and is identical on Windows, macOS and Linux.

> **iOS Simulator requires a Mac.** There is no way around this — Apple only
> ships the iOS Simulator with Xcode on macOS. On Windows/Linux, run iOS via
> **Expo Go on a real iPhone** (Method A) instead.

---

## 0. Prerequisites (all operating systems)

You need **Node.js 18 or newer** and **Git**. Check what you have:

```bash
node --version   # should print v18.x or higher
git --version
```

If Node is missing or too old, install it (per-OS steps below), then continue.

### Install Node.js & Git

<details>
<summary><b>🪟 Windows</b></summary>

1. Download the **LTS** installer from <https://nodejs.org> and run it
   (accept the defaults). This installs both `node` and `npm`.
2. Install **Git** from <https://git-scm.com/download/win> (accept the defaults).
3. Close and reopen your terminal (use **PowerShell** or **Windows Terminal**),
   then verify:
   ```powershell
   node --version
   git --version
   ```

> Tip: alternatively `winget install OpenJS.NodeJS.LTS` and
> `winget install Git.Git`.
</details>

<details>
<summary><b>🍎 macOS</b></summary>

Using [Homebrew](https://brew.sh) (recommended):
```bash
brew install node git
```
Or download the macOS installer from <https://nodejs.org>. Verify:
```bash
node --version
git --version
```
</details>

<details>
<summary><b>🐧 Linux</b></summary>

Debian/Ubuntu:
```bash
# Node.js LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs git
```
Fedora:
```bash
sudo dnf install -y nodejs git
```
Arch:
```bash
sudo pacman -S nodejs npm git
```
Verify:
```bash
node --version
git --version
```
</details>

---

## 1. Get the code & install dependencies (all operating systems)

```bash
git clone https://github.com/olivierluethy/Dialy.git
cd Dialy
npm install
```

`npm install` downloads everything the app needs (~1–2 minutes). You only do
this once (and again whenever dependencies change).

---

## 2. Start the development server (all operating systems)

```bash
npx expo start
```

This starts the **Metro bundler** and prints a **QR code** plus a menu of
shortcut keys. **Leave this terminal running** — it serves the JavaScript to
your device. Press `Ctrl + C` to stop it later.

Now pick **Method A** (real phone) or **Method B** (emulator/simulator) below.

---

## 3A. Run on a real phone with Expo Go (Windows / macOS / Linux)

This is the easiest path and works the same on every operating system.

1. Install **Expo Go** on your phone:
   - **iPhone:** App Store → search "Expo Go".
   - **Android:** Google Play → search "Expo Go".
2. Make sure your **phone and computer are on the same Wi‑Fi network**.
3. With `npx expo start` running, scan the **QR code** in the terminal:
   - **iPhone:** open the **Camera** app, point it at the QR code, tap the
     banner that appears → it opens in Expo Go.
   - **Android:** open **Expo Go** → "Scan QR code" → scan it.
4. The app downloads and launches. Edit a file and save → it **hot-reloads**
   on the phone automatically.

**Wi‑Fi blocking the connection?** Some home/office/guest networks block
device‑to‑device traffic. Use a tunnel instead:
```bash
npx expo start --tunnel
```
(The first time, it may ask to install `@expo/ngrok` — say yes.) Then scan the
QR code again.

---

## 3B. Run on an emulator / simulator

### 🤖 Android emulator (Windows / macOS / Linux)

1. Install **[Android Studio](https://developer.android.com/studio)**.
2. Open Android Studio → **More Actions → Virtual Device Manager** → **Create
   Device** → pick e.g. *Pixel 7*, choose a recent system image (download it),
   finish, then **press ▶** to boot the emulator. Leave it running.
3. Make sure the Android SDK command-line tools are on your `PATH`:

   <details><summary>🪟 Windows (PowerShell, set once)</summary>

   ```powershell
   setx ANDROID_HOME "$env:LOCALAPPDATA\Android\Sdk"
   # Then add these to PATH (Settings → Environment Variables), or:
   setx PATH "$env:PATH;$env:LOCALAPPDATA\Android\Sdk\platform-tools"
   ```
   Reopen the terminal afterwards.
   </details>

   <details><summary>🍎 macOS / 🐧 Linux (add to ~/.zshrc or ~/.bashrc)</summary>

   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk         # macOS: $HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
   ```
   Reload with `source ~/.bashrc` (or `~/.zshrc`).
   </details>

   Verify the emulator is detected: `adb devices` should list it.
4. With `npx expo start` running, **press `a`** in that terminal. Expo installs
   Expo Go into the emulator and launches Dialy.

### 🍎 iOS Simulator (macOS only)

1. Install **Xcode** from the Mac App Store (large download).
2. Open Xcode once to finish component installation, then install the command
   line tools:
   ```bash
   xcode-select --install
   ```
3. With `npx expo start` running, **press `i`**. Expo boots the iOS Simulator,
   installs Expo Go, and launches Dialy.

> On Windows/Linux there is no iOS Simulator — use **Method A** with a real
> iPhone for iOS.

---

## 4. Quick per-OS cheat sheet

**🪟 Windows**
```powershell
# 1) install Node LTS + Git (see above), then:
git clone https://github.com/olivierluethy/Dialy.git
cd Dialy
npm install
npx expo start
# scan QR with Expo Go (iPhone/Android), or press "a" for Android emulator
```

**🍎 macOS**
```bash
brew install node git
git clone https://github.com/olivierluethy/Dialy.git
cd Dialy
npm install
npx expo start
# press "i" (iOS Simulator) or "a" (Android emulator), or scan the QR code
```

**🐧 Linux**
```bash
# install Node LTS + Git (see above), then:
git clone https://github.com/olivierluethy/Dialy.git
cd Dialy
npm install
npx expo start
# scan QR with Expo Go, or press "a" for Android emulator (no iOS Simulator on Linux)
```

---

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| QR code won't connect / "Something went wrong" | Same Wi‑Fi? Try `npx expo start --tunnel`. |
| `command not found: npx` / `node` | Node isn't installed or terminal wasn't reopened after install. Re-check step 0. |
| Metro cache acting up after edits | Restart with `npx expo start -c` (clears the cache). |
| Pressing `a` does nothing | The Android emulator isn't running, or `adb devices` doesn't list it. Boot the AVD first; check `ANDROID_HOME`/PATH. |
| Pressing `i` fails (Mac) | Run `xcode-select --install` and open Xcode once to finish setup. |
| Port 8081 already in use | Stop the other Metro instance, or run `npx expo start --port 8082`. |
| Want to verify it compiles without a device | `npm run typecheck` (type check) and `npx expo-doctor` (health check). |
| **Web: blank/white page**, console shows `MIME type ("application/json") mismatch` | The web bundle failed to build and Metro returned a JSON error. Read the terminal / the JSON body for the real cause. Known ones are already handled in `metro.config.js` (see **Web-Unterstützung** below); if new, restart with `npx expo start -c`. |
| **Web: white page**, console shows `Cannot find native module 'ExpoSQLite'` | `expo-sqlite` has no web build. Handled by `src/db/database.web.ts` (sql.js). Make sure it exists and that `npm install` ran. |
| **Web: white page** with a `requireNativeComponent` / `BVLinearGradient` error | A bare native module leaked into the web bundle. `react-native-linear-gradient` is aliased to `expo-linear-gradient` in `metro.config.js` — restart with `-c`. |

---

# Project details

## Tech-Stack

- **React Native + TypeScript** über **Expo (managed workflow)**
- **React Navigation v7** — Bottom-Tabs (5) + Stacks
- **Zustand** — globaler State (Diabetes-Typ, Session, Premium-Flag)
- **react-native-gifted-charts** — Blutzucker-Verlaufschart (siehe Hinweis unten)
- **expo-sqlite** mit dünner Repository-Schicht — lokale Datenbank (siehe Hinweis)
- **Supabase** (PostgreSQL, Auth, Auto-REST) — Sync-Ziel
- **Supabase Edge Functions** — Sync-Trigger (gestubbt)
- **Firebase Cloud Messaging**, **HealthKit/Health Connect**, **Sentry** — hinter Feature-Flags

### Technische Entscheidungen (und warum)

- **Chart-Bibliothek:** `react-native-gifted-charts` statt Victory Native XL.
  Gifted-charts baut auf `react-native-svg` auf und läuft sofort in Expo Go;
  Victory Native XL benötigt Skia und einen eigenen Dev-Build.
- **Lokale DB:** `expo-sqlite` statt WatermelonDB. WatermelonDB benötigt ein
  natives Modul, das im managed Expo-Workflow (Expo Go) nicht ohne Eject baut.
  Das §7‑Datenmodell und der Sync-Vertrag sind in einer kleinen
  Repository-/Sync-Schicht darauf umgesetzt — der Vertrag hält unabhängig von
  der Storage-Engine.

---

## Web-Unterstützung (Browser)

Die App läuft nativ (iOS/Android via Expo Go) **und** im Browser
(`npm run web` bzw. `npx expo start` → Taste `w`). Drei native Bausteine haben
im Web keinen Gegenpart und würden sonst zu einer **weissen Seite** führen (der
Fehler passiert bei der Modul-Auswertung, _bevor_ React etwas rendert). Alle
drei sind zentral in `metro.config.js` + einer plattform-spezifischen Datei
gelöst — der native Pfad bleibt unverändert:

| Problem im Web | Ursache | Lösung |
|---|---|---|
| Bundle-Build bricht ab (`@opentelemetry/api` nicht auflösbar) | `@supabase/supabase-js` macht im Browser-Build ein optionales `import('@opentelemetry/api')`; Metro versucht es statisch aufzulösen | `metro.config.js` mappt das Modul auf ein leeres Modul (`{ type: 'empty' }`) — Supabase fängt das Fehlen selbst ab |
| `requireNativeComponent is not a function` / `BVLinearGradient` | `react-native-gifted-charts` zieht `react-native-linear-gradient` (bare native module) rein; dessen Web-Pfad ruft `requireNativeComponent` beim Import auf | `metro.config.js` aliased `react-native-linear-gradient` → **`expo-linear-gradient`** (funktioniert auf Web + iOS + Android + Expo Go) |
| `Cannot find native module 'ExpoSQLite'` | `expo-sqlite` liefert in SDK 52 **kein** Web-Build | `src/db/database.web.ts` — Metro wählt es im Web automatisch (`.web.ts`) und implementiert dieselbe async-API mit **sql.js** (SQLite als WebAssembly). Persistenz via IndexedDB; Fallback: In-Memory pro Session. Nativ bleibt `database.ts` (echtes `expo-sqlite`) die Quelle der Wahrheit. |

Nach Änderungen an `metro.config.js` immer mit `npx expo start -c`
(Cache leeren) neu starten.

---

## Konfiguration (alles optional)

Ohne Konfiguration läuft die App komplett offline (Auth & Sync deaktiviert).
Beim ersten Start wird die lokale Datenbank mit Lebensmitteln, Artikeln (Typ 1
& Typ 2) und ein paar Beispiel-Tagebuchtagen befüllt — alle Screens sehen also
sofort gefüllt aus.

Zum Aktivieren von Konto/Sync `.env.example` nach `.env` kopieren und ausfüllen:

```bash
cp .env.example .env
```

| Variable | Zweck |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase Projekt-URL (Settings → API) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon**-Key (öffentlich, client-sicher) |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry DSN (leer = No-op) |
| `EXPO_PUBLIC_FEATURE_FCM` | `true` aktiviert FCM-Sync-Trigger (sonst Sync-on-Foreground) |
| `EXPO_PUBLIC_FEATURE_HEALTH` | `true` aktiviert die Health-Import-Schnittstelle |

> ⚠️ **Niemals** den Supabase Service-Role-Key oder DB-Zugangsdaten in den
> Client legen. Nur der **anon**-Key gehört hierher. Row-Level-Security (siehe
> `supabase/migrations/0002_rls.sql`) stellt sicher, dass jeder Nutzer nur
> seine eigenen Zeilen liest/schreibt.

### Supabase einrichten (optional)

```bash
# Schema + RLS anwenden (Supabase CLI)
supabase db push
# bzw. die SQL-Dateien manuell im SQL-Editor ausführen:
#   supabase/migrations/0001_init.sql
#   supabase/migrations/0002_rls.sql
```

---

## Premium im Dev-Build testen

Es gibt **kein** echtes Bezahl-/IAP-SDK in diesem Build. Premium ist ein
umschaltbares Flag:

- **Konto-Tab → Premium-Karte lange drücken** (≈0,5 s) schaltet Premium um, oder
- über die **Mock-Paywall** „Premium freischalten (Demo)“.

So lässt sich die komplette Premium-UI (volles Tagebuch / BZ-Auswertung) ohne
echten Kauf testen.

---

## Optionale / gestubbte Bausteine (Follow-up)

Diese sind strukturiert vorhanden, aber hinter Flags deaktiviert, damit die App
ohne externe Konfiguration läuft. Im Code als `TODO(native)` markiert.

- **Health-Import (CGM):** `src/services/health.ts` — Abstraktion mit
  Manuell-Fallback (immer verfügbar). Der native HealthKit /
  Health-Connect-Bridge braucht einen Dev/EAS-Build (nicht Expo Go) und
  `EXPO_PUBLIC_FEATURE_HEALTH=true`.
- **FCM (Push/Sync-Trigger):** `src/services/fcm.ts` + Edge-Function
  `supabase/functions/notify-sync`. Ohne Firebase ist FCM ein No-op; der Client
  synchronisiert beim App-Vordergrund und über „Jetzt synchronisieren“.
- **Sentry:** `src/services/sentry.ts` — No-op ohne DSN.

---

## Offline-First & Sync (Kurzfassung)

- Die **lokale SQLite-DB ist die Quelle der Wahrheit** für die UI.
- Schreibvorgänge landen zuerst lokal und werden in `sync_queue` vorgemerkt.
- **Konfliktauflösung: Last-Write-Wins** über `updated_at`.
- **Löschungen sind weich** (`deleted_at`), nie physisch — so kann eine
  gelöschte Zeile auf einem anderen Gerät nicht wieder auftauchen.
- **Sync-Trigger:** rund um FCM gebaut (kein Polling); lokal Fallback auf
  Sync-on-Foreground + manuelles „Jetzt synchronisieren“.

---

## Bewusste Entscheidungen

- **Dark-Mode only.** Es gibt kein helles Theme, keinen Umschalter und kein
  Folgen der System-Darstellung.
- **Kein Medizinprodukt.** Keine Insulindosis-Berechnung, keine
  Therapieempfehlung — eine bewusste rechtliche Grenze (hält Dialy ausserhalb
  EU‑MDR / Schweizer Medizinprodukte-Regulierung). Das „Insulinrate reduzieren
  (Pumpe)“-Feld im Sport-Screen ist eine **reine Notiz** zur eigenen
  Pumpeneinstellung, keine Empfehlung.
- **Nicht veröffentlicht.** Dieser Build ist nur für lokale Tests. Keine
  Store-Submission, kein Release-Signing, kein `eas submit`.
- **Swiss German.** Alle Texte nutzen „ss“ statt „ß“.

---

## Projektstruktur

```
Dialy/
├─ App.tsx                      # Root: Navigation + Bootstrap, Dark-Theme
├─ app.config.ts                # Expo-Konfig (dark-only, extra/env, Flags)
├─ src/
│  ├─ theme/theme.ts            # Design-Tokens (Dark, authoritativ)
│  ├─ state/                    # Zustand-Store + Bootstrap-Hook
│  ├─ policy/gating.ts          # Konto/Premium-Gating (Single Source of Truth)
│  ├─ db/                       # expo-sqlite, Repositories, Seed
│  ├─ sync/                     # Supabase-Client + Sync-Engine (§7-Vertrag)
│  ├─ services/                 # auth, health, fcm, sentry (geflaggt)
│  ├─ components/               # UI-Bausteine (Screen, Button, Chart, …)
│  ├─ navigation/               # Tabs + Stacks
│  ├─ screens/                  # Ratgeber, KH-Rechner, Tagebuch, Sport, Login
│  ├─ data/                     # Seed: Lebensmittel + Artikel
│  └─ utils/                    # Format, IDs, Sport-Kurven-Heuristik
└─ supabase/
   ├─ migrations/               # Schema + RLS (SQL)
   └─ functions/notify-sync/    # Edge-Function-Stub (Sync-Trigger)
```

---

## Scripts

```bash
npm start            # = npx expo start
npm run android      # start + open Android
npm run ios          # start + open iOS (macOS only)
npm run typecheck    # TypeScript type check (tsc --noEmit)
```
