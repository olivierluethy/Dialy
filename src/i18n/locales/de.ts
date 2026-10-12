/**
 * German (Swiss) UI copy — the reference dictionary. Every other language
 * must have exactly the same shape (type `Dict`). Always "ss", never "ß".
 */
const de = {
  common: {
    cancel: 'Abbrechen',
    save: 'Speichern',
    ok: 'OK',
    close: 'Schliessen',
    back: 'Zurück',
    retry: 'Erneut versuchen',
    delete: 'Löschen',
    next: 'Weiter',
    later: 'Später',
    or: 'oder',
    emailLabel: 'E-Mail-Adresse',
    emailPlaceholder: 'name@beispiel.ch',
    passwordLabel: 'Passwort',
    confirmPasswordLabel: 'Passwort bestätigen',
    minChars: (n: number) => `mind. ${n} Zeichen`,
    privacyPolicy: 'Datenschutzerklärung',
    appearance: 'Darstellung',
    language: 'Sprache',
    requiredHint: '* Pflichtfeld',
    notAvailable: 'k.A.',
  },

  units: {
    /** Short carbohydrate unit after "g": "18 g KH". */
    carbs: 'KH',
    minutes: 'min',
    hoursShort: 'Std.',
  },

  date: {
    months: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
    ],
    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    /** "16. Mai 2026" */
    long: (day: number, month: string, year: number) => `${day}. ${month} ${year}`,
    /** "Freitag, 16. Mai 2026" */
    withWeekday: (weekday: string, day: number, month: string, year: number) =>
      `${weekday}, ${day}. ${month} ${year}`,
    datePlaceholder: 'TT.MM.JJJJ',
    timePlaceholder: 'HH:MM',
  },

  nav: {
    ratgeber: 'Ratgeber',
    khrechner: 'KH-Rechner',
    tagebuch: 'Tagebuch',
    sport: 'Sport',
    login: 'Anmelden',
    settings: 'Einstellungen',
    contact: 'Kontakt',
    premium: 'Premium',
    privacy: 'Datenschutz',
    article: 'Artikel',
    register: 'Registrieren',
    forgotPassword: 'Passwort vergessen',
    brandA11y: 'Dialy – zum Ratgeber',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schliessen',
    toLight: 'Zum hellen Modus wechseln',
    toDark: 'Zum dunklen Modus wechseln',
  },

  theme: {
    dark: 'Dunkel',
    light: 'Hell',
    system: 'System',
  },

  diabetesType: {
    t1: 'Typ 1',
    t2: 'Typ 2',
  },

  gate: {
    saveMeal: 'Mahlzeit im Tagebuch speichern erfordert ein Konto.',
    saveSport: 'Sport im Tagebuch speichern erfordert ein Konto.',
    diaryNeedsAccount:
      'Das Tagebuch benötigt ein (kostenloses) Konto. So bleiben deine Einträge sicher und geräteübergreifend verfügbar.',
    diaryNeedsPremium:
      'Das vollständige Tagebuch mit Blutzucker-Verlauf und Auswertung ist Teil von Dialy Premium.',
    registerCta: 'Kostenlos registrieren →',
  },

  khrechner: {
    title: 'KH-Rechner',
    totalA11y: (carbs: string) => `Zwischentotal ${carbs}, Lebensmittel anzeigen`,
    saveMealA11y: 'Mahlzeit im Tagebuch speichern',
    clearA11y: 'Zwischentotal auf null setzen',
    searchPlaceholder: 'Lebensmittel suchen…',
    all: 'Alle',
    noResults: 'Keine Treffer',
    resultCount: (n: number) => `${n} Lebensmittel`,
    showMore: (n: number) => `Weitere anzeigen (${n})`,
    closeFoodA11y: 'Lebensmittel schliessen',
    portionSize: 'Portionsgrösse',
    grams: 'Gramm',
    nutrients: 'Nährwerte',
    carbs: 'Kohlenhydrate',
    sugar: 'Zucker',
    gi: 'Glyk. Index',
    fat: 'Fett',
    thisPortion: (carbs: string) => `Diese Portion: ${carbs}`,
    addToMeal: 'Zur Mahlzeit hinzufügen',
    mealTitle: 'Mahlzeit',
    total: 'Total',
    accountRequired: 'Konto erforderlich',
    freeAccountSavesMeals: 'Mit einem kostenlosen Konto werden deine Mahlzeiten im Tagebuch gespeichert.',
    createAccount: 'Konto erstellen',
    saved: 'Gespeichert',
    savedMessage: (n: number) =>
      n === 1
        ? '1 Lebensmittel wurde im Tagebuch eingetragen.'
        : `${n} Lebensmittel wurden im Tagebuch eingetragen.`,
    toDiary: 'Zum Tagebuch',
    saveFailed: 'Speichern fehlgeschlagen',
    saveFailedMessage:
      'Nicht alle Lebensmittel konnten gespeichert werden. Die übrigen sind noch in der Mahlzeit – bitte versuche es erneut.',
    source: (text: string) => `Quelle: ${text}`,
    sourceManufacturer: 'Herstellerangaben (Stand Oktober 2026)',
  },

  /** Short chip labels of the top-level food categories, keyed by stored name. */
  foodCategories: {
    'Brote, Flocken und Frühstückscerealien': 'Brot & Cerealien',
    'Getreideprodukte, Hülsenfrüchte und Kartoffeln': 'Getreide & Kartoffeln',
    Früchte: 'Früchte',
    Gemüse: 'Gemüse',
    'Milch und Milchprodukte': 'Milchprodukte',
    Süssigkeiten: 'Süssigkeiten',
    Gerichte: 'Gerichte',
    'Alkoholfreie Getränke': 'Getränke',
    'Salzige Snacks': 'Snacks',
    'Nüsse, Samen und Ölfrüchte': 'Nüsse & Samen',
    'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten':
      'Pflanzliche Alternativen',
    'Fleisch und Innereien': 'Fleisch',
    'Fleisch- und Wurstwaren': 'Wurstwaren',
    Fisch: 'Fisch',
    Eier: 'Eier',
    'Fette und Öle': 'Fette & Öle',
    'Alkoholhaltige Getränke': 'Alkohol',
    Speziallebensmittel: 'Speziallebensmittel',
    Verschiedenes: 'Verschiedenes',
  },

  /**
   * Portion labels. Stored labels are German; `labels` translates the fixed
   * ones (curated foods, brand drinks), the functions the generated ones.
   */
  portions: {
    usual: (amount: string) => `Übliche Portion (${amount})`,
    package: (amount: string) => `Portion laut Packung (${amount})`,
    labels: {} as Record<string, string>,
  },

  tagebuch: {
    title: 'Tagebuch',
    done: 'Fertig',
    select: 'Auswählen',
    locked: 'Tagebuch gesperrt',
    registerFree: 'Kostenlos registrieren',
    tapToMark: 'Einträge antippen, um sie zu markieren.',
    selectedCount: (n: number) => `${n} ${n === 1 ? 'Eintrag' : 'Einträge'} ausgewählt`,
    changeDateTime: 'Datum & Zeit ändern',
    empty: 'Noch keine Einträge. Füge im KH-Rechner oder im Sport-Planer etwas hinzu.',
    carbTotal: 'KH total',
    meals: 'Mahlzeiten',
    sport: 'Sport',
    sameDateTime: (n: number) => `${n} Einträge erhalten dasselbe Datum und dieselbe Uhrzeit.`,
    markHint: 'Markieren',
    editHint: 'Eintrag bearbeiten',
    bgCurveSaved: 'BZ-Verlauf gespeichert',
    invalidDateTime: 'Bitte Datum als TT.MM.JJJJ und Uhrzeit als HH:MM eingeben.',
    editDateTimeTitle: 'Datum & Uhrzeit ändern',
    editEntryTitle: 'Eintrag bearbeiten',
    date: 'Datum',
    time: 'Uhrzeit',
    today: 'Heute',
    yesterday: 'Gestern',
    comment: 'Kommentar',
    commentPlaceholder: 'z. B. vor dem Sport, Hypo danach …',
  },

  activities: {
    wandern: 'Wandern',
    laufen: 'Laufen',
    rad: 'Rad',
    schwimmen: 'Schwimmen',
    kraft: 'Kraft',
  },

  sport: {
    title: 'Sport planen',
    activity: 'Sportart',
    duration: 'Dauer (Minuten)',
    bgBefore: 'Blutzucker vor Sport',
    curve: 'Geschätzter BZ-Verlauf',
    disclaimer: '⚠️ Schätzung, keine medizinische Empfehlung. Dialy berechnet keine Insulindosen.',
    carbsBefore: 'Kohlenhydrate vor Sport',
    carbsAfter: 'Kohlenhydrate nach Sport',
    beforePrefix: 'Vor Sport',
    afterPrefix: 'Nach',
    afterHint:
      'Nach dem Sport bleibt die Insulinempfindlichkeit erhöht, während die Glykogenspeicher wieder aufgefüllt werden.',
    pump: 'Insulinrate reduzieren (Pumpe)',
    reduction: 'Reduktion',
    for: 'für',
    pumpHint:
      'Nur eine Notiz zu deiner eigenen Pumpeneinstellung. Dialy gibt keine Empfehlung ab und berechnet nichts.',
    saved: 'Im Tagebuch gespeichert ✓',
    save: 'Sport speichern',
  },

  chart: {
    empty: 'Gib Werte ein, um den Verlauf zu sehen.',
    sportStart: 'Sport-Start',
    timeAxis: 'Zeit in Minuten',
  },

  ratgeber: {
    title: 'Ratgeber',
    empty: 'Noch keine Artikel vorhanden.',
    notFound: 'Artikel nicht gefunden.',
    /** Shown above the list when the UI language isn't German. */
    germanOnly: '',
    errorOffline: 'Der Ratgeber ist nur mit Internetverbindung verfügbar.',
    errorNotConfigured:
      'Der Ratgeber braucht eine Verbindung zum Dialy-Server, der hier nicht eingerichtet ist.',
    errorUnavailable: 'Die Artikel konnten gerade nicht geladen werden.',
    /** Article categories as stored in Supabase -> label. */
    categories: {} as Record<string, string>,
  },

  login: {
    welcome: 'Willkommen',
    forgot: 'Passwort vergessen?',
    signIn: 'Anmelden',
    createAccount: 'Konto erstellen',
  },

  register: {
    title: 'Konto erstellen',
    subtitle: 'Kostenlos. Schaltet das Tagebuch frei.',
    mismatch: 'Die Passwörter stimmen nicht überein.',
    consentMissing: 'Bitte stimme der Verarbeitung deiner Gesundheitsdaten zu.',
    consent:
      'Ich stimme zu, dass meine Eingaben (inkl. Gesundheitsdaten wie Blutzuckerwerte) zur Bereitstellung des Tagebuchs verarbeitet werden. Es findet keine Werbe- oder Analysenutzung statt.',
    submit: 'Registrieren',
  },

  forgot: {
    title: 'Passwort vergessen',
    unavailable:
      'Ohne Server kann das Passwort nicht zurückgesetzt werden: Lokale Konten haben keine bestätigte E-Mail-Adresse. Erstelle bei Bedarf ein neues Konto.',
    sent:
      'Wenn ein Konto mit dieser E-Mail-Adresse existiert, haben wir dir einen Link geschickt. Öffne ihn auf diesem Gerät, um ein neues Passwort festzulegen.',
    intro:
      'Gib die E-Mail-Adresse deines Kontos ein. Wir schicken dir einen Link, mit dem du ein neues Passwort festlegen kannst.',
    send: 'Link senden',
  },

  newPassword: {
    invalidLink: 'Link ungültig',
    title: 'Neues Passwort',
    tooShort: (n: number) => `Das Passwort braucht mindestens ${n} Zeichen.`,
    changed: 'Dein Passwort wurde geändert. Du bist angemeldet.',
    intro: 'Lege ein neues Passwort für dein Konto fest.',
    label: 'Neues Passwort',
    save: 'Passwort speichern',
  },

  account: {
    signedIn: 'Angemeldet',
    premium: 'Premium',
    freeAccount: 'Kostenloses Konto',
    premiumTitle: 'Dialy Premium (CHF 3.00 / Monat)',
    premiumSub: 'Vollständiges Tagebuch & Blutzucker-Auswertung.',
    viewPremium: 'Premium ansehen',
    devHint: 'Dev: Diese Karte lange drücken, um Premium zum Testen umzuschalten.',
    privacy: 'Datenschutz',
    deleteData: 'Daten löschen',
    deleteConfirm:
      'Möchtest du wirklich alle deine Einträge (Mahlzeiten, Sport, Blutzucker) unwiderruflich löschen?',
    partlyDeleted: 'Teilweise gelöscht',
    deleted: 'Gelöscht',
    partlyDeletedMessage:
      'Lokale Daten wurden gelöscht. Die Server-Löschung folgt beim nächsten Sync.',
    deletedMessage: 'Alle deine Einträge wurden gelöscht.',
    sync: 'Synchronisierung',
    signOut: 'Abmelden',
    syncLocalOnly:
      'Offline-Modus: Es ist kein Server konfiguriert. Alle Daten bleiben lokal auf dem Gerät.',
    syncing: 'Synchronisiere …',
    offlinePending: (n: number) =>
      n === 1
        ? 'Keine Verbindung – 1 Änderung wartet und wird automatisch nachgeschickt.'
        : `Keine Verbindung – ${n} Änderungen warten und werden automatisch nachgeschickt.`,
    offlineSaved: 'Keine Verbindung – deine Einträge sind auf dem Gerät gespeichert.',
    syncFailed: 'Synchronisierung fehlgeschlagen – wird automatisch erneut versucht.',
    pending: (n: number) =>
      n === 1
        ? '1 Änderung wartet auf die Synchronisierung.'
        : `${n} Änderungen warten auf die Synchronisierung.`,
    allSynced: (since: string) => `Alles synchronisiert · ${since}`,
    notSynced: 'Noch nicht synchronisiert.',
    justNow: 'gerade eben',
    minutesAgo: (n: number) => `vor ${n} Min.`,
    today: 'heute',
  },

  paywall: {
    price: 'CHF 3.00 / Monat',
    features: [
      'Vollständiges Tagebuch mit Verlauf',
      'Blutzucker-Tracking & Auswertung',
      'Geräteübergreifende Synchronisation',
    ],
    mockNote:
      'Hinweis: In diesem Build ist die Bezahlung nur eine Vorschau. Es ist kein echtes Zahlungssystem hinterlegt.',
    active: 'Premium ist aktiv ✓',
    unlock: 'Premium freischalten (Demo)',
  },

  privacy: {
    title: 'Datenschutzerklärung',
    sections: [
      {
        h: 'Überblick',
        b: 'Dialy ist ein Begleiter für den Alltag mit Diabetes. Die App dokumentiert Werte, die du selbst eingibst, und schätzt Kohlenhydrate sowie einen illustrativen Blutzucker-Trend. Dialy ist kein Medizinprodukt und gibt keine Therapie- oder Dosierungsempfehlungen.',
      },
      {
        h: 'Welche Daten wir verarbeiten',
        b: 'Mahlzeiten, sportliche Aktivitäten und Blutzuckerwerte, die du eingibst. Diese Gesundheitsdaten gelten als besonders schützenswert (DSGVO Art. 9 / revDSG Art. 5). Sie werden ausschliesslich zur Bereitstellung des Tagebuchs verwendet.',
      },
      {
        h: 'Keine Werbe- oder Analysenutzung',
        b: 'Deine Gesundheitsdaten werden nicht für Werbung, Marketing oder Data-Mining verwendet und nicht an Dritte verkauft.',
      },
      {
        h: 'Speicherung',
        b: 'Deine Daten werden lokal auf deinem Gerät gespeichert. Mit einem Konto werden sie verschlüsselt mit unserem Server synchronisiert, damit sie auf mehreren Geräten verfügbar sind. Der Zugriff ist durch Row-Level-Security auf dein Konto beschränkt.',
      },
      {
        h: 'Kontaktformular',
        b: 'Nachrichten aus dem Kontaktformular (Lebensmittel vorschlagen oder Fehler melden) werden auf unserem Server gespeichert, um die Lebensmitteldaten zu verbessern. Bist du angemeldet, wird die Nachricht mit deinem Konto verknüpft, damit wir bei Rückfragen antworten können.',
      },
      {
        h: 'Deine Rechte',
        b: 'Du kannst deine Daten jederzeit in den Kontoeinstellungen unter «Daten löschen» vollständig entfernen. Die Löschung wird auch auf den Server übertragen.',
      },
      {
        h: 'Quellen',
        b: 'Nährwerte der meisten Lebensmittel im KH-Rechner: Schweizer Nährwertdatenbank, Bundesamt für Lebensmittelsicherheit und Veterinärwesen (BLV), naehrwertdaten.ch. Übliche Portionsgrössen: BLV, Nationale Ernährungserhebung menuCH 2014-15. Weitere Lebensmittel und Gerichte: Max Rubner-Institut (2025), Bundeslebensmittelschlüssel (BLS) Version 4.0, Lizenz CC BY 4.0. Markengetränke (z. B. Rivella, Coca-Cola): Angaben der Hersteller für die Schweiz, Stand Oktober 2026. Markenprodukte: Open Food Facts (openfoodfacts.org), Open Database License (ODbL) – von Freiwilligen erfasst, Angaben auf der Verpackung haben Vorrang.',
      },
      {
        h: 'Kontakt',
        b: 'Bei Fragen zum Datenschutz erreichst du uns unter datenschutz@dialy.example. (Platzhalter)',
      },
    ],
  },

  contact: {
    intro:
      'Fehlt ein Lebensmittel, stimmt ein Wert nicht oder hast du ein anderes Anliegen? Schreib uns – wir prüfen jeden Hinweis.',
    kindNew: 'Neues Lebensmittel',
    kindFix: 'Fehler melden',
    kindOther: 'Sonstiges',
    foodName: 'Name des Lebensmittels *',
    foodNamePlaceholder: 'z. B. Dinkel-Vollkornbrötli',
    valuesLabel: 'Nährwerte pro 100 g (falls bekannt)',
    carbs: 'KH (g)',
    sugar: 'Zucker (g)',
    fat: 'Fett (g)',
    valuesInvalid: 'Nährwerte bitte als Zahl zwischen 0 und 100 angeben.',
    remark: 'Bemerkung / Quelle',
    remarkPlaceholder: 'z. B. Werte von der Verpackung',
    subject: 'Betreff *',
    subjectPlaceholder: 'z. B. Frage zum Tagebuch',
    message: 'Nachricht *',
    messagePlaceholder: 'Was möchtest du uns mitteilen?',
    whichFood: 'Welches Lebensmittel ist falsch? *',
    foodValues: (carbs: number, sugar: number, fat: number) =>
      `${carbs} g KH · ${sugar} g Zucker · ${fat} g Fett pro 100 g`,
    otherFoodA11y: 'Anderes Lebensmittel wählen',
    correction: 'Korrekturvorschlag *',
    correctionPlaceholder: 'z. B. Laut Verpackung 48 g KH pro 100 g',
    send: 'Senden',
    thanks: 'Danke!',
    sentMessage: 'Deine Nachricht ist bei uns angekommen. Danke für deine Hilfe!',
    notSent: 'Nicht gesendet',
    writeTo: (email: string) => `Du kannst uns auch an ${email} schreiben.`,
    errorOffline:
      'Keine Internetverbindung. Bitte versuche es später noch einmal – deine Eingaben bleiben erhalten.',
    errorNotConfigured:
      'Das Kontaktformular braucht eine Verbindung zum Dialy-Server, der hier nicht eingerichtet ist.',
    errorUnavailable:
      'Die Nachricht konnte gerade nicht gesendet werden. Bitte versuche es später noch einmal.',
  },

  auth: {
    alreadyRegisteredSignIn: 'Diese E-Mail ist bereits registriert. Bitte melde dich an.',
    confirmEmail: (email: string) =>
      `Fast geschafft! Wir haben dir eine E-Mail an ${email} geschickt. Bitte bestätige deine Adresse über den Link darin und melde dich danach an.`,
    linkExpired:
      'Der Link ist abgelaufen oder wurde schon verwendet. Bitte fordere einen neuen an.',
    localResetUnavailable:
      'Ohne Server kann das Passwort nicht zurückgesetzt werden: Lokale Konten haben keine bestätigte E-Mail-Adresse. Erstelle bei Bedarf ein neues Konto.',
    offline:
      'Keine Internetverbindung. Anmelden und Registrieren brauchen Internet – alles andere funktioniert auch offline.',
    invalidLogin: 'E-Mail oder Passwort ist falsch.',
    alreadyRegistered: 'Diese E-Mail ist bereits registriert.',
    emailNotConfirmed:
      'Bitte bestätige zuerst deine E-Mail-Adresse (Link in der Bestätigungs-Mail) und melde dich dann an.',
    samePassword: 'Das neue Passwort muss sich vom bisherigen unterscheiden.',
    rateLimit: 'Zu viele Versuche. Bitte warte einen Moment und versuche es erneut.',
    weakPassword: 'Das Passwort erfüllt die Anforderungen nicht (mind. 6 Zeichen).',
    invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    generic: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
  },
};

export type Dict = typeof de;
export default de;
