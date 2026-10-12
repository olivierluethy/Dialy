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
    termsOfUse: 'Nutzungsbedingungen',
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
    terms: 'Nutzungsbedingungen',
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
      'Das vollständige Tagebuch mit Blutzucker-Verlauf und Übersichten ist Teil von Dialy Premium.',
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
    title: 'Sport erfassen',
    activity: 'Sportart',
    duration: 'Dauer (Minuten)',
    bgBefore: 'Blutzucker vor Sport',
    curve: 'Typische Tendenz (allgemeines Beispiel)',
    disclaimer:
      '⚠️ Allgemeine Illustration, nicht für dich berechnet: Sie zeigt nur, in welche Richtung sich der Blutzucker bei dieser Sportart oft bewegt. Keine Vorhersage und keine Empfehlung – Dialy berechnet keine Insulindosen und keine Kohlenhydratmengen.',
    carbsBefore: 'Kohlenhydrate vor Sport (Notiz)',
    carbsAfter: 'Kohlenhydrate nach Sport (Notiz)',
    beforePrefix: 'Vor Sport',
    afterPrefix: 'Nach',
    afterHint:
      'Nach dem Sport bleibt die Insulinempfindlichkeit erhöht, während die Glykogenspeicher wieder aufgefüllt werden.',
    pump: 'Anpassung an der Pumpe (Notiz)',
    reduction: 'Reduktion',
    for: 'für',
    pumpHint:
      'Nur eine Notiz zu deiner eigenen Pumpeneinstellung. Dialy gibt keine Empfehlung ab und berechnet nichts.',
    saved: 'Im Tagebuch gespeichert ✓',
    save: 'Sport speichern',
  },

  chart: {
    timeAxis: 'Zeit in Minuten',
    noScale: 'Ohne Massstab – gestrichelt: Ausgangslage',
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
    consentMissing: 'Bitte akzeptiere die Nutzungsbedingungen und stimme der Verarbeitung deiner Gesundheitsdaten zu.',
    consent:
      'Ich akzeptiere die Nutzungsbedingungen und stimme zu, dass meine Eingaben (inkl. Gesundheitsdaten wie Blutzuckerwerte) gemäss Datenschutzerklärung zur Bereitstellung des Tagebuchs verarbeitet werden. Es findet keine Werbe- oder Analysenutzung statt.',
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
    premiumSub: 'Vollständiges Tagebuch & Blutzucker-Verlauf.',
    viewPremium: 'Premium ansehen',
    devHint: 'Dev: Diese Karte lange drücken, um Premium zum Testen umzuschalten.',
    legal: 'Rechtliches & Datenschutz',
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
      'Blutzucker-Verlauf & Übersichten',
      'Geräteübergreifende Synchronisation',
    ],
    renewal:
      'Das Abo verlängert sich monatlich automatisch und kann jederzeit bis 24 Stunden vor Ablauf in den Einstellungen deines App-Store- bzw. Google-Play-Kontos gekündigt werden.',
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
        b: 'Dialy ist ein Begleiter für den Alltag mit Diabetes. Die App dokumentiert Werte, die du selbst eingibst, rechnet Kohlenhydrate zusammen und zeigt beim Sport eine allgemeine, nicht persönliche Illustration. Dialy ist kein Medizinprodukt, berechnet keine Insulindosen und gibt keine Therapie- oder Dosierungsempfehlungen.',
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

  terms: {
    title: 'Nutzungsbedingungen',
    version: 'Stand: 12. Oktober 2026',
    sections: [
      {
        h: '1. Anbieter',
        b: 'Dialy wird angeboten von [Name / Firma], [Strasse Nr.], [PLZ Ort], Schweiz, E-Mail: [kontakt@dialy.example]. (Platzhalter – vor der Veröffentlichung ergänzen.)',
      },
      {
        h: '2. Geltung',
        b: 'Diese Nutzungsbedingungen gelten für die Nutzung der App Dialy. Mit dem Erstellen eines Kontos oder dem Abschluss von Premium akzeptierst du sie. Ohne Konto gelten sie für die frei zugänglichen Funktionen sinngemäss. Ergänzend gilt unsere Datenschutzerklärung.',
      },
      {
        h: '3. Was Dialy ist – und was nicht',
        b: 'Dialy ist ein Alltagsbegleiter für Menschen mit Diabetes: Die App zeigt Nährwerte von Lebensmitteln, rechnet Kohlenhydrate einer Mahlzeit zusammen, führt ein Tagebuch über Werte, die du selbst eingibst, und bietet allgemeine Informationsartikel.\n\nDialy ist kein Medizinprodukt im Sinne der Medizinprodukteverordnung (MepV) bzw. der EU-Verordnung 2017/745. Dialy stellt keine Diagnosen, gibt keine Therapie- oder Behandlungsempfehlungen, berechnet keine Insulindosen, keine Korrekturen, keine zu essenden Kohlenhydratmengen und keine Pumpeneinstellungen, sagt deinen Blutzucker nicht voraus und warnt nicht vor Unter- oder Überzuckerungen. Die Kurve auf der Sport-Seite ist eine allgemeine Illustration und wird nicht für dich berechnet. Felder zu Kohlenhydraten oder zur Pumpe sind reine Notizen über das, was du selbst entschieden hast.\n\nEntscheide über deine Therapie immer selbst bzw. zusammen mit deinem Diabetes-Team. Dialy ersetzt weder ärztliche Beratung noch Blutzuckermessungen. In einem Notfall wende dich an den Notruf 144.',
      },
      {
        h: '4. Nährwertangaben',
        b: 'Die Nährwerte stammen aus öffentlichen Datenbanken (u. a. Schweizer Nährwertdatenbank des BLV, Bundeslebensmittelschlüssel, Open Food Facts) und von Herstellern. Sie sind Durchschnitts- bzw. Richtwerte, können unvollständig, veraltet oder falsch sein und weichen je nach Produkt, Rezept und Zubereitung ab. Portionsangaben sind Schätzungen. Massgebend sind immer die Angaben auf der Verpackung. Wir übernehmen keine Gewähr für die Richtigkeit.',
      },
      {
        h: '5. Konto',
        b: 'Für das Tagebuch brauchst du ein Konto. Du musst mindestens 16 Jahre alt sein. Jüngere dürfen Dialy nur mit Einverständnis der Eltern bzw. der gesetzlichen Vertretung nutzen. Ein Konto ist persönlich. Halte dein Passwort geheim und informiere uns, wenn du einen Missbrauch vermutest.',
      },
      {
        h: '6. Kostenlose Nutzung und Premium',
        b: 'Der KH-Rechner, der Ratgeber und die Sport-Seite sind kostenlos. Premium kostet CHF 3.00 pro Monat (Preise inkl. MWST, Änderungen vorbehalten) und schaltet zusätzliche Funktionen frei, die in der App beschrieben sind.\n\nPremium wird als Abonnement über den App Store von Apple oder Google Play abgeschlossen und abgerechnet; dafür gelten zusätzlich deren Bedingungen. Das Abo verlängert sich jeden Monat automatisch, wenn du es nicht spätestens 24 Stunden vor Ablauf in den Einstellungen deines Store-Kontos kündigst. Eine Kündigung wirkt auf das Ende der laufenden Periode. Rückerstattungen richten sich nach den Regeln von Apple bzw. Google. Preisänderungen kündigen wir rechtzeitig an; sie gelten erst ab der nächsten Periode und nur, wenn du nicht kündigst.',
      },
      {
        h: '7. Verfügbarkeit',
        b: 'Wir bemühen uns um einen zuverlässigen Betrieb, können aber keine ununterbrochene Verfügbarkeit garantieren. Funktionen können geändert, erweitert oder eingestellt werden. Deine Einträge werden auf dem Gerät gespeichert und mit Konto auf unserem Server gesichert; bewahre wichtige Werte zusätzlich dort auf, wo dein Diabetes-Team sie braucht.',
      },
      {
        h: '8. Haftung',
        b: 'Du nutzt Dialy auf eigene Verantwortung. Wir haften nicht für Entscheidungen über Ernährung, Insulin oder Therapie, die du auf Grundlage der App triffst, und nicht für ungenaue Nährwerte oder Datenverluste. Soweit gesetzlich zulässig, ist unsere Haftung auf Vorsatz und grobe Fahrlässigkeit beschränkt. Zwingende gesetzliche Haftung, etwa für Personenschäden oder nach dem Produkthaftpflichtgesetz, bleibt vorbehalten.',
      },
      {
        h: '9. Rechte',
        b: 'Die App, ihre Texte und ihr Design gehören dem Anbieter bzw. den jeweiligen Rechteinhabern. Du erhältst ein einfaches, nicht übertragbares Recht, Dialy für private Zwecke zu nutzen. Für die Nährwertdaten gelten die Lizenzen der Quellen (siehe Datenschutzerklärung, Abschnitt «Quellen»).',
      },
      {
        h: '10. Kündigung und Löschung',
        b: 'Du kannst Dialy jederzeit nicht mehr nutzen und deine Daten in den Einstellungen unter «Daten löschen» entfernen. Ein laufendes Premium-Abo kündigst du separat im App Store bzw. bei Google Play. Wir können Konten bei Verstössen gegen diese Bedingungen sperren oder löschen.',
      },
      {
        h: '11. Änderungen',
        b: 'Wir können diese Nutzungsbedingungen anpassen, etwa bei neuen Funktionen oder geänderten Gesetzen. Über wesentliche Änderungen informieren wir dich in der App rechtzeitig vorher. Bist du nicht einverstanden, kannst du die Nutzung beenden und dein Konto löschen.',
      },
      {
        h: '12. Anwendbares Recht und Gerichtsstand',
        b: 'Es gilt Schweizer Recht. Gerichtsstand ist der Sitz des Anbieters. Wohnst du als Konsumentin oder Konsument in einem anderen Land, bleiben dir die zwingenden Schutzvorschriften und Gerichtsstände deines Wohnsitzstaates erhalten.',
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
