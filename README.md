# Dialy — Diabetes-Begleiter

Dialy ist ein Alltagsbegleiter für Menschen mit Typ‑1‑ (und Typ‑2‑) Diabetes.
Er hilft bei drei Dingen: Kohlenhydrate einer Mahlzeit schätzen, Sport und
seine Wirkung auf den Blutzucker planen, und ein Tagebuch aus Mahlzeiten und
Blutzuckerwerten führen.

> **Dialy ist kein Medizinprodukt.** Die App berechnet **keine Insulindosen**
> und gibt **keine Therapieempfehlungen**. Sie dokumentiert nur selbst
> eingegebene Werte und schätzt Kohlenhydrate sowie einen *illustrativen*
> Blutzucker‑Trend.

---

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

## Schnellstart

Voraussetzungen: Node 18+ und npm. Für Gerätetests die **Expo Go**-App.

```bash
cd Dialy
npm install
npx expo start
```

Dann:
- **iOS-Simulator:** im Expo-CLI `i` drücken (macOS + Xcode)
- **Android-Emulator:** `a` drücken (Android Studio)
- **Echtes Gerät:** QR-Code mit Expo Go scannen (gleiches WLAN)

Beim ersten Start wird die lokale Datenbank mit Lebensmitteln, Artikeln (Typ 1
& Typ 2) und ein paar Beispiel-Tagebuchtagen befüllt — alle Screens sehen also
sofort gefüllt aus. **Alle Kernfunktionen laufen vollständig offline.**

### TypeScript prüfen

```bash
npm run typecheck
```

---

## Konfiguration (alles optional)

Ohne Konfiguration läuft die App komplett offline (Auth & Sync deaktiviert).
Zum Aktivieren `.env.example` nach `.env` kopieren und ausfüllen:

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
  Folgen der System-Darstellung. Die Wireframes sind in Light gezeichnet —
  umgesetzt ist ausschliesslich das Dark-Theme aus `src/theme/theme.ts`.
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
