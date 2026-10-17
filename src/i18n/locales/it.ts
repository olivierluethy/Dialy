import type { Dict } from '@/i18n/locales/de';

/** Italian (Swiss) UI copy. Same shape as de.ts. */
const it: Dict = {
  common: {
    cancel: 'Annulla',
    save: 'Salva',
    ok: 'OK',
    close: 'Chiudi',
    back: 'Indietro',
    retry: 'Riprova',
    delete: 'Elimina',
    next: 'Continua',
    later: 'Più tardi',
    or: 'oppure',
    emailLabel: 'Indirizzo e-mail',
    emailPlaceholder: 'nome@esempio.ch',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Conferma password',
    minChars: (n) => `almeno ${n} caratteri`,
    privacyPolicy: 'Informativa sulla privacy',
    termsOfUse: 'Condizioni d’uso',
    appearance: 'Aspetto',
    language: 'Lingua',
    diabetesType: 'Tipo di diabete',
    requiredHint: '* Campo obbligatorio',
    notAvailable: 'n.d.',
  },

  units: {
    carbs: 'carboidrati',
    minutes: 'min',
    hoursShort: 'h',
  },

  date: {
    months: [
      'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
      'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
    ],
    weekdays: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
    weekdaysShort: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
    long: (day, month, year) => `${day} ${month} ${year}`,
    withWeekday: (weekday, day, month, year) => `${weekday} ${day} ${month} ${year}`,
    datePlaceholder: 'GG.MM.AAAA',
    timePlaceholder: 'HH:MM',
  },

  nav: {
    ratgeber: 'Consigli',
    khrechner: 'Conta carboidrati',
    tagebuch: 'Diario',
    blutzucker: 'Glicemia',
    sport: 'Sport',
    login: 'Accedi',
    settings: 'Impostazioni',
    contact: 'Contatto',
    glucoseImport: 'Dati glicemia',
    premium: 'Premium',
    privacy: 'Privacy',
    terms: 'Condizioni d’uso',
    article: 'Articolo',
    register: 'Registrati',
    forgotPassword: 'Password dimenticata',
    brandA11y: 'Dialy – vai ai consigli',
    openMenu: 'Apri menu',
    closeMenu: 'Chiudi menu',
    toLight: 'Passa alla modalità chiara',
    toDark: 'Passa alla modalità scura',
  },

  theme: {
    dark: 'Scuro',
    light: 'Chiaro',
    system: 'Sistema',
  },

  diabetesType: {
    t1: 'Tipo 1',
    t2: 'Tipo 2',
  },

  gate: {
    saveMeal: 'Salvare un pasto nel diario richiede un account con un abbonamento.',
    saveSport: 'Salvare lo sport nel diario richiede un account con un abbonamento.',
    diaryNeedsAccount:
      'Il diario richiede un account con un abbonamento. Così le tue voci restano al sicuro e disponibili su tutti i dispositivi.',
    diaryNeedsPremium:
      'Il diario fa parte di Dialy Premium. Con l’abbonamento salvi pasti e sport e vedi il tuo andamento.',
    loginCta: 'Accedi →',
    premiumCta: 'Vedi Premium →',
  },

  khrechner: {
    title: 'Conta carboidrati',
    totalA11y: (carbs) => `Subtotale ${carbs}, mostra alimenti`,
    saveMealA11y: 'Salva il pasto nel diario',
    clearA11y: 'Azzera il subtotale',
    searchPlaceholder: 'Cerca alimenti…',
    all: 'Tutti',
    noResults: 'Nessun risultato',
    noFoodsYet:
      'Gli alimenti vengono scaricati da Internet al primo avvio. Collegati a Internet – poi il calcolatore di carboidrati funziona anche offline.',
    resultCount: (n) => (n === 1 ? '1 alimento' : `${n} alimenti`),
    showMore: (n, of) => `Mostra altri ${n} di ${of}`,
    closeFoodA11y: 'Chiudi alimento',
    clearSearchA11y: 'Cancella ricerca',
    portionSize: 'Porzione',
    grams: 'grammi',
    nutrients: 'Valori nutrizionali',
    carbs: 'Carboidrati',
    sugar: 'Zuccheri',
    gi: 'Indice glicemico',
    fat: 'Grassi',
    thisPortion: (carbs) => `Questa porzione: ${carbs}`,
    addToMeal: 'Aggiungi al pasto',
    mealTitle: 'Pasto',
    total: 'Totale',
    subscriptionRequired: 'Abbonamento necessario',
    saved: 'Salvato',
    savedMessage: (n) =>
      n === 1 ? '1 alimento è stato aggiunto al diario.' : `${n} alimenti sono stati aggiunti al diario.`,
    toDiary: 'Vai al diario',
    saveFailed: 'Salvataggio non riuscito',
    saveFailedMessage:
      'Non è stato possibile salvare tutti gli alimenti. Gli altri sono ancora nel pasto – riprova.',
    source: (text) => `Fonte: ${text}`,
    sourceManufacturer: 'dati del produttore (stato ottobre 2026)',
  },

  foodCategories: {
    'Brote, Flocken und Frühstückscerealien': 'Pane & cereali',
    'Getreideprodukte, Hülsenfrüchte und Kartoffeln': 'Cereali & patate',
    Früchte: 'Frutta',
    Gemüse: 'Verdura',
    'Milch und Milchprodukte': 'Latticini',
    Süssigkeiten: 'Dolciumi',
    Gerichte: 'Piatti',
    'Alkoholfreie Getränke': 'Bevande',
    'Salzige Snacks': 'Snack',
    'Nüsse, Samen und Ölfrüchte': 'Noci & semi',
    'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten':
      'Alternative vegetali',
    'Fleisch und Innereien': 'Carne',
    'Fleisch- und Wurstwaren': 'Salumi',
    Fisch: 'Pesce',
    Eier: 'Uova',
    'Fette und Öle': 'Grassi & oli',
    'Alkoholhaltige Getränke': 'Alcolici',
    Speziallebensmittel: 'Alimenti speciali',
    Verschiedenes: 'Varie',
  },

  portions: {
    usual: (amount) => `Porzione abituale (${amount})`,
    package: (amount) => `Porzione da confezione (${amount})`,
    labels: {
      '½ Scheibe': '½ fetta',
      '1 Scheibe': '1 fetta',
      '2 Scheiben': '2 fette',
      '1 Brötchen': '1 panino',
      '3 EL': '3 cucchiai',
      '1 Portion': '1 porzione',
      '½ Portion': '½ porzione',
      'grosse Portion': 'porzione grande',
      'kleine Portion': 'porzione piccola',
      'kleine Schale': 'ciotola piccola',
      '1 Schale': '1 ciotola',
      '1 kleine': '1 piccola',
      '½ Apfel': '½ mela',
      '1 Apfel': '1 mela',
      '½ Banane': '½ banana',
      '1 Banane': '1 banana',
      Handvoll: 'manciata',
      '1 Orange': '1 arancia',
      '½ Becher': '½ vasetto',
      '1 Becher': '1 vasetto',
      '1 Glas': '1 bicchiere',
      '1 Tasse': '1 tazza',
      '1 Stück': '1 pezzo',
      '2 Stücke': '2 pezzi',
      '1 Ei': '1 uovo',
      '2 Eier': '2 uova',
      '1 Gipfeli': '1 cornetto',
      '1 Reihe': '1 fila',
      '½ Tafel': '½ tavoletta',
      '1 Dose': '1 lattina',
      '1 Plättchen': '1 pastiglia',
      '3 Plättchen': '3 pastiglie',
      '1 Glas (2 dl)': '1 bicchiere (2 dl)',
      '1 Dose (250 ml)': '1 lattina (250 ml)',
      '1 Dose (330 ml)': '1 lattina (330 ml)',
      '1 Dose (355 ml)': '1 lattina (355 ml)',
      '1 Flasche (5 dl)': '1 bottiglia (5 dl)',
    },
  },

  tagebuch: {
    title: 'Diario',
    done: 'Fine',
    select: 'Seleziona',
    viewList: 'Elenco',
    viewCalendar: 'Calendario',
    noEntriesDay: 'Nessuna voce in questo giorno.',
    prevMonth: 'Mese precedente',
    nextMonth: 'Mese successivo',
    locked: 'Diario bloccato',
    tapToMark: 'Tocca le voci per selezionarle.',
    selectedCount: (n) => (n === 1 ? '1 voce selezionata' : `${n} voci selezionate`),
    changeDateTime: 'Modifica data e ora',
    empty: 'Ancora nessuna voce. Aggiungi qualcosa nel conta carboidrati o nel pianificatore sport.',
    carbTotal: 'Carboidrati tot.',
    sameDateTime: (n) => `${n} voci riceveranno la stessa data e la stessa ora.`,
    markHint: 'Seleziona',
    editHint: 'Modifica voce',
    bgCurveSaved: 'Andamento della glicemia salvato',
    invalidDateTime: 'Inserisci la data come GG.MM.AAAA e l’ora come HH:MM.',
    editDateTimeTitle: 'Modifica data e ora',
    editEntryTitle: 'Modifica voce',
    date: 'Data',
    time: 'Ora',
    today: 'Oggi',
    yesterday: 'Ieri',
    comment: 'Commento',
    commentPlaceholder: 'p. es. prima dello sport, ipo dopo …',
    deleteEntryTitle: 'Elimina voce',
    deleteEntryConfirm: (name: string) => `Eliminare «${name}» dal diario?`,
    deleteEntryA11y: (name: string) => `Elimina ${name}`,
    editEntryA11y: (name: string) => `Modifica ${name}`,
    deleteEntriesConfirm: (n: number) => `Eliminare ${n} alimenti dal diario?`,
  },

  blutzucker: {
    title: 'La mia glicemia',
    prevDay: 'Giorno precedente',
    nextDay: 'Giorno successivo',
    backToToday: 'Torna a oggi',
    average: 'Media',
    timeInRange: 'Tempo nel target (3.9 a 10.0)',
    lowest: 'Valore più basso',
    highest: 'Valore più alto',
    atTime: (time: string) => `alle ${time}`,
    delayHint:
      'Le ultime ore potrebbero mancare: a seconda del fornitore, i dati CGM sono disponibili solo con qualche ora di ritardo.',
    chartTitle: 'Andamento glicemico',
    legendGlucose: (unit: string) => `Glucosio (${unit})`,
    legendTarget: 'Intervallo target',
    noReadingsDay: 'Nessun valore glicemico per questo giorno.',
    mealsTitle: 'Pasti',
    totalCarbs: (g: number) => `Totale ${g} g di carboidrati`,
    noMeals: 'Nessun pasto registrato in questo giorno.',
    peakTooltip: (value: string, time: string) => `Picco ${value} alle ${time}`,
    footnote: (unit: string) =>
      `Picco e aumento in ${unit}, misurati entro 2.5 ore dopo il pasto. I valori superiori a 10.0 sono evidenziati.`,
    disclaimer:
      '⚠️ Solo a scopo informativo. Dialy non fornisce raccomandazioni terapeutiche (es. dosi di insulina) e non sostituisce un misuratore.',
    manageData: 'Gestisci i dati della glicemia',
    emptyTitle: 'Ancora nessun dato glicemico',
    emptyText:
      'Collega una sorgente CGM o carica un export LibreView per vedere la tua curva insieme ai pasti.',
    importCta: 'Importa dati',
    locked: 'Glicemia bloccata',
  },

  glucose: {
    needAccount: 'Accedi per importare i dati della glicemia.',
    intro:
      'Importa i valori di glucosio da un sensore CGM e vedili insieme ai tuoi pasti. I valori sono salvati in mg/dL e mostrati nell’unità scelta.',
    unit: 'Unità',
    consentTitle: 'Consenso',
    consent:
      'Acconsento all’importazione e alla conservazione dei miei valori di glucosio (dati sanitari sensibili) in Dialy.',
    sources: 'Sorgenti',
    dexcomSoon: 'Connessione diretta tramite il tuo account Dexcom (OAuth). Presto disponibile.',
    comingSoon: 'Presto',
    healthHelp: (platform: string) =>
      `Dexcom e Libre scrivono i loro valori in ${platform}. Dialy chiede l’autorizzazione di lettura e li importa — senza password.`,
    healthConnect: 'Connetti e importa',
    healthUnavailable: 'Disponibile solo nell’app Dialy installata (non nell’anteprima/browser).',
    healthDenied: 'Autorizzazione di lettura non concessa. Puoi concederla nelle impostazioni di sistema in Health/Health Connect.',
    libreHelp: 'Esporta i dati in LibreView (dati di glucosio come CSV) e incolla qui il contenuto.',
    csvPlaceholder: 'Incolla qui il CSV di LibreView …',
    importCsv: 'Importa CSV',
    demoTitle: 'Dati demo',
    demoHelp: 'Genera una curva giornaliera di esempio per oggi, in base ai pasti di oggi.',
    demoCta: 'Genera dati demo per oggi',
    stored: 'Dati salvati',
    storedCount: (n: number) => `${n} valori glicemici salvati.`,
    disconnectDelete: 'Disconnetti ed elimina tutti i dati della glicemia',
    disclaimer:
      '⚠️ Dialy mostra i valori solo a scopo informativo e non fornisce raccomandazioni terapeutiche. I tuoi valori sono trasmessi e salvati in forma cifrata.',
    csvError: (key: string) => {
      switch (key) {
        case 'empty':
          return 'Il file è vuoto.';
        case 'noHeader':
          return 'Nessuna riga di intestazione con una marca temporale trovata. È un export LibreView?';
        case 'noGlucoseColumn':
          return 'Nessuna colonna di glucosio (mg/dL o mmol/L) trovata.';
        case 'noReadings':
          return 'Nessuna misurazione valida trovata.';
        default:
          return 'Impossibile leggere il file.';
      }
    },
    importedTitle: 'Importazione completata',
    importedMessage: (inserted: number, duplicates: number) =>
      `${inserted} nuovi valori importati${duplicates > 0 ? `, ${duplicates} duplicati ignorati` : ''}.`,
    importFailed: 'Importazione non riuscita',
    deleteTitle: 'Elimina i dati della glicemia',
    deleteConfirm: 'Eliminare definitivamente tutti i valori glicemici importati?',
    deletedTitle: 'Eliminato',
    deletedMessage: (n: number) => `${n} valori glicemici sono stati eliminati.`,
  },

  activities: {
    wandern: 'Escursione',
    laufen: 'Corsa',
    rad: 'Bici',
    schwimmen: 'Nuoto',
    kraft: 'Forza',
  },

  sport: {
    title: 'Registra sport',
    activity: 'Attività',
    duration: 'Durata (minuti)',
    bgBefore: 'Glicemia prima dello sport',
    curve: 'Tendenza tipica (esempio generale)',
    disclaimer:
      '⚠️ Illustrazione generale, non calcolata per te: mostra solo in che direzione si muove spesso la glicemia con questa attività. Nessuna previsione e nessuna raccomandazione – Dialy non calcola dosi di insulina né quantità di carboidrati.',
    carbsBefore: 'Carboidrati prima dello sport (nota)',
    carbsAfter: 'Carboidrati dopo lo sport (nota)',
    beforePrefix: 'Prima dello sport',
    afterPrefix: 'Dopo',
    afterHint:
      'Dopo lo sport la sensibilità all’insulina resta elevata mentre le riserve di glicogeno vengono ricostituite.',
    pump: 'Regolazione del microinfusore (nota)',
    reduction: 'Riduzione',
    for: 'per',
    pumpHint:
      'Solo una nota sull’impostazione del tuo microinfusore. Dialy non dà raccomandazioni e non calcola nulla.',
    saved: 'Salvato nel diario ✓',
    save: 'Salva sport',
  },

  chart: {
    timeAxis: 'Tempo in minuti',
    noScale: 'Senza scala – tratteggiato: livello di partenza',
  },

  ratgeber: {
    title: 'Consigli',
    empty: 'Ancora nessun articolo.',
    notFound: 'Articolo non trovato.',
    germanOnly: 'Per ora gli articoli sono disponibili solo in tedesco.',
    errorOffline: 'I consigli sono disponibili solo con una connessione Internet.',
    errorNotConfigured:
      'I consigli richiedono una connessione al server Dialy, che qui non è configurato.',
    errorUnavailable: 'Al momento non è stato possibile caricare gli articoli.',
    categories: {
      Sport: 'Sport',
      Nacht: 'Notte',
      Insulin: 'Insulina',
      Technologie: 'Tecnologia',
      Ernährung: 'Alimentazione',
      Medikamente: 'Farmaci',
      Alltag: 'Quotidianità',
      Sicherheit: 'Sicurezza',
    },
  },

  login: {
    welcome: 'Benvenuti',
    forgot: 'Password dimenticata?',
    signIn: 'Accedi',
    createAccount: 'Crea account',
  },

  register: {
    title: 'Crea account',
    subtitle: 'Gratuito. Per il diario serve anche Dialy Premium.',
    mismatch: 'Le password non coincidono.',
    consentMissing: 'Accetta le condizioni d’uso e acconsenti al trattamento dei tuoi dati sanitari.',
    consent:
      'Accetto le condizioni d’uso e acconsento al trattamento dei miei dati (compresi dati sanitari come i valori glicemici) secondo l’informativa sulla privacy per fornire il diario. Non vengono usati per pubblicità o analisi.',
    submit: 'Registrati',
  },

  forgot: {
    title: 'Password dimenticata',
    unavailable:
      'Senza server la password non può essere reimpostata: gli account locali non hanno un indirizzo e-mail confermato. Se necessario, crea un nuovo account.',
    sent:
      'Se esiste un account con questo indirizzo e-mail, ti abbiamo inviato un link. Aprilo su questo dispositivo per impostare una nuova password.',
    intro:
      'Inserisci l’indirizzo e-mail del tuo account. Ti invieremo un link per impostare una nuova password.',
    send: 'Invia link',
  },

  newPassword: {
    invalidLink: 'Link non valido',
    title: 'Nuova password',
    tooShort: (n) => `La password deve avere almeno ${n} caratteri.`,
    changed: 'La tua password è stata modificata e hai effettuato l’accesso.',
    intro: 'Imposta una nuova password per il tuo account.',
    label: 'Nuova password',
    save: 'Salva password',
  },

  account: {
    signedIn: 'Accesso effettuato',
    premium: 'Premium',
    freeAccount: 'Account gratuito',
    premiumTitle: 'Dialy Premium (CHF 3.00 / mese)',
    premiumSub: 'Diario completo & andamento della glicemia.',
    viewPremium: 'Vedi Premium',
    devHint: 'Dev: tieni premuta questa scheda per attivare/disattivare Premium per i test.',
    legal: 'Note legali & privacy',
    glucoseData: 'Glicemia e CGM',
    deleteData: 'Elimina dati',
    deleteConfirm:
      'Vuoi davvero eliminare definitivamente tutte le tue voci (pasti, sport, glicemia)?',
    partlyDeleted: 'Eliminato in parte',
    deleted: 'Eliminato',
    partlyDeletedMessage:
      'I dati locali sono stati eliminati. L’eliminazione sul server seguirà alla prossima sincronizzazione.',
    deletedMessage: 'Tutte le tue voci sono state eliminate.',
    deleteAccount: 'Elimina account',
    deleteAccountConfirm:
      'Vuoi davvero eliminare definitivamente il tuo account e tutti i tuoi dati? Un abbonamento Premium in corso va disdetto separatamente nell’App Store o su Google Play.',
    deleteAccountFailed: 'Account non eliminato',
    accountDeleted: 'Account eliminato',
    accountDeletedMessage: 'Il tuo account e tutti i tuoi dati sono stati eliminati.',
    sync: 'Sincronizzazione',
    signOut: 'Esci',
    syncLocalOnly:
      'Modalità offline: nessun server configurato. Tutti i dati restano sul dispositivo.',
    syncing: 'Sincronizzazione …',
    offlinePending: (n) =>
      n === 1
        ? 'Nessuna connessione – 1 modifica è in attesa e verrà inviata automaticamente.'
        : `Nessuna connessione – ${n} modifiche sono in attesa e verranno inviate automaticamente.`,
    offlineSaved: 'Nessuna connessione – le tue voci sono salvate sul dispositivo.',
    syncFailed: 'Sincronizzazione non riuscita – nuovo tentativo automatico.',
    pending: (n) =>
      n === 1
        ? '1 modifica è in attesa di sincronizzazione.'
        : `${n} modifiche sono in attesa di sincronizzazione.`,
    allSynced: (since) => `Tutto sincronizzato · ${since}`,
    notSynced: 'Non ancora sincronizzato.',
    justNow: 'proprio ora',
    minutesAgo: (n) => `${n} min fa`,
    today: 'oggi',
  },

  paywall: {
    price: 'CHF 3.00 / mese',
    features: [
      'Diario completo con cronologia',
      'Andamento & panoramiche della glicemia',
      'Sincronizzazione tra dispositivi',
    ],
    renewal:
      'L’abbonamento si rinnova automaticamente ogni mese e può essere disdetto in qualsiasi momento fino a 24 ore prima della scadenza nelle impostazioni del tuo account App Store o Google Play.',
    mockNote:
      'Nota: in questa versione il pagamento è solo un’anteprima. Non è configurato alcun sistema di pagamento reale.',
    active: 'Premium è attivo ✓',
    unlock: 'Attiva Premium (demo)',
  },

  privacy: {
    title: 'Informativa sulla privacy',
    sections: [
      {
        h: 'Panoramica',
        b: 'Dialy è un compagno per la vita quotidiana con il diabete. L’app registra i valori che inserisci tu stesso somma i carboidrati e mostra per lo sport un’illustrazione generale, non personalizzata. Dialy non è un dispositivo medico, non calcola dosi di insulina e non fornisce raccomandazioni terapeutiche o di dosaggio.',
      },
      {
        h: 'Quali dati trattiamo',
        b: 'Pasti, attività fisiche e valori glicemici che inserisci. Questi dati sanitari sono considerati particolarmente degni di protezione (GDPR art. 9 / nLPD art. 5). Vengono utilizzati esclusivamente per fornire il diario.',
      },
      {
        h: 'Nessun uso pubblicitario o analitico',
        b: 'I tuoi dati sanitari non vengono utilizzati per pubblicità, marketing o data mining e non vengono venduti a terzi.',
      },
      {
        h: 'Archiviazione',
        b: 'I tuoi dati vengono salvati localmente sul tuo dispositivo. Con un account vengono sincronizzati in forma cifrata con il nostro server, in modo da essere disponibili su più dispositivi. L’accesso è limitato al tuo account tramite row-level security.',
      },
      {
        h: 'Modulo di contatto',
        b: 'I messaggi del modulo di contatto (proporre un alimento o segnalare un errore) vengono salvati sul nostro server per migliorare i dati sugli alimenti. Se hai effettuato l’accesso, il messaggio viene collegato al tuo account affinché possiamo risponderti in caso di domande.',
      },
      {
        h: 'I tuoi diritti',
        b: 'Puoi eliminare completamente i tuoi dati in qualsiasi momento nelle impostazioni dell’account, alla voce «Elimina dati». L’eliminazione viene trasmessa anche al server.',
      },
      {
        h: 'Fonti',
        b: 'Valori nutrizionali della maggior parte degli alimenti nel conta carboidrati: Banca dati svizzera dei valori nutritivi, Ufficio federale della sicurezza alimentare e di veterinaria (USAV), naehrwertdaten.ch. Porzioni abituali: USAV, indagine nazionale sull’alimentazione menuCH 2014-15. Altri alimenti e piatti: Max Rubner-Institut (2025), Bundeslebensmittelschlüssel (BLS) versione 4.0, licenza CC BY 4.0. Bevande di marca (p. es. Rivella, Coca-Cola): dati dei produttori per la Svizzera, stato ottobre 2026. Prodotti di marca: Open Food Facts (openfoodfacts.org), Open Database License (ODbL) – raccolti da volontari; fanno fede le indicazioni sulla confezione.',
      },
      {
        h: 'Contatto',
        b: 'Per domande sulla protezione dei dati scrivici a datenschutz@dialy.example. (segnaposto)',
      },
    ],
  },

  terms: {
    title: 'Condizioni d’uso',
    version: 'Versione del 12 ottobre 2026',
    sections: [
      {
        h: '1. Fornitore',
        b: 'Dialy è offerta da [nome / ditta], [via n.], [NPA località], Svizzera, e-mail: [kontakt@dialy.example]. (Segnaposto – da completare prima della pubblicazione.)',
      },
      {
        h: '2. Campo d’applicazione',
        b: 'Le presenti condizioni d’uso si applicano all’utilizzo dell’app Dialy. Creando un account o sottoscrivendo Premium le accetti. Senza account si applicano per analogia alle funzioni liberamente accessibili. Si applica inoltre la nostra informativa sulla privacy.',
      },
      {
        h: '3. Che cosa è Dialy – e che cosa non è',
        b: 'Dialy è un compagno quotidiano per le persone con diabete: l’app mostra i valori nutritivi degli alimenti, somma i carboidrati di un pasto, tiene un diario dei valori che inserisci tu stesso e offre articoli informativi generali.\n\nDialy non è un dispositivo medico ai sensi dell’ordinanza relativa ai dispositivi medici (ODmed) né del regolamento (UE) 2017/745. Dialy non formula diagnosi, non dà raccomandazioni di terapia o di trattamento, non calcola dosi di insulina, correzioni, quantità di carboidrati da mangiare né impostazioni del microinfusore, non prevede la tua glicemia e non avverte in caso di ipo- o iperglicemia. La curva della pagina sport è un’illustrazione generale e non viene calcolata per te. I campi relativi ai carboidrati o al microinfusore sono semplici note su ciò che hai deciso tu stesso.\n\nPrendi sempre le decisioni sulla tua terapia da solo o insieme al tuo team diabetologico. Dialy non sostituisce né la consulenza medica né le misurazioni della glicemia. In caso di emergenza chiama il 144.',
      },
      {
        h: '4. Valori nutritivi',
        b: 'I valori nutritivi provengono da banche dati pubbliche (tra cui la Banca dati svizzera dei valori nutritivi dell’USAV, il Bundeslebensmittelschlüssel e Open Food Facts) e dai produttori. Sono valori medi o indicativi, possono essere incompleti, obsoleti o errati e variare a seconda del prodotto, della ricetta e della preparazione. Le porzioni sono stime. Fanno sempre fede le indicazioni sulla confezione. Non garantiamo la loro esattezza.',
      },
      {
        h: '5. Account',
        b: 'Per il diario ti serve un account. Devi avere almeno 16 anni. I più giovani possono usare Dialy solo con il consenso dei genitori o del rappresentante legale. Un account è personale. Tieni segreta la tua password e informaci se sospetti un abuso.',
      },
      {
        h: '6. Uso gratuito e Premium',
        b: 'Il calcolatore di carboidrati, la guida e la pagina sport sono gratuiti. Premium costa CHF 3.00 al mese (prezzi IVA inclusa, con riserva di modifiche) e sblocca funzioni aggiuntive descritte nell’app.\n\nPremium viene sottoscritto e fatturato come abbonamento tramite l’App Store di Apple o Google Play; si applicano inoltre le loro condizioni. L’abbonamento si rinnova automaticamente ogni mese se non lo disdici almeno 24 ore prima della scadenza nelle impostazioni del tuo account dello store. La disdetta ha effetto alla fine del periodo in corso. I rimborsi sono disciplinati dalle regole di Apple o di Google. Annunciamo per tempo le modifiche di prezzo; si applicano solo dal periodo successivo e solo se non disdici.',
      },
      {
        h: '7. Disponibilità',
        b: 'Ci impegniamo per un funzionamento affidabile, ma non possiamo garantire una disponibilità ininterrotta. Le funzioni possono essere modificate, ampliate o sospese. Le tue voci vengono salvate sul dispositivo e, con un account, sul nostro server; conserva inoltre i valori importanti là dove servono al tuo team diabetologico.',
      },
      {
        h: '8. Responsabilità',
        b: 'Usi Dialy sotto la tua responsabilità. Non rispondiamo delle decisioni su alimentazione, insulina o terapia che prendi sulla base dell’app, né di valori nutritivi inesatti o perdite di dati. Nella misura consentita dalla legge, la nostra responsabilità è limitata al dolo e alla colpa grave. È fatta salva la responsabilità legale imperativa, ad esempio per danni alla persona o secondo la legge sulla responsabilità per danno da prodotti.',
      },
      {
        h: '9. Diritti',
        b: 'L’app, i suoi testi e il suo design appartengono al fornitore o ai rispettivi titolari dei diritti. Ricevi un diritto semplice e non trasferibile di usare Dialy per scopi privati. Per i dati nutrizionali valgono le licenze delle fonti (vedi informativa sulla privacy, sezione «Fonti»).',
      },
      {
        h: '10. Disdetta e cancellazione',
        b: 'Puoi smettere di usare Dialy in qualsiasi momento e cancellare i tuoi dati nelle impostazioni alla voce «Cancella dati». Un abbonamento Premium in corso si disdice separatamente nell’App Store o su Google Play. Possiamo bloccare o cancellare account in caso di violazione delle presenti condizioni.',
      },
      {
        h: '11. Modifiche',
        b: 'Possiamo adeguare le presenti condizioni d’uso, ad esempio per nuove funzioni o modifiche di legge. Ti informiamo per tempo nell’app delle modifiche importanti. Se non sei d’accordo, puoi smettere di usare l’app e cancellare il tuo account.',
      },
      {
        h: '12. Diritto applicabile e foro',
        b: 'Si applica il diritto svizzero. Il foro è presso la sede del fornitore. Se vivi in un altro paese come consumatrice o consumatore, conservi le disposizioni di protezione imperative e i fori del tuo paese di domicilio.',
      },
    ],
  },

  contact: {
    intro:
      'Manca un alimento, un valore è sbagliato o hai un’altra richiesta? Scrivici – esaminiamo ogni segnalazione.',
    kindNew: 'Nuovo alimento',
    kindFix: 'Segnala errore',
    kindOther: 'Altro',
    foodName: 'Nome dell’alimento *',
    foodNamePlaceholder: 'p. es. panino integrale di farro',
    valuesLabel: 'Valori nutrizionali per 100 g (se noti)',
    carbs: 'Carboidrati (g)',
    sugar: 'Zuccheri (g)',
    fat: 'Grassi (g)',
    valuesInvalid: 'Indica i valori nutrizionali come numero tra 0 e 100.',
    remark: 'Osservazione / fonte',
    remarkPlaceholder: 'p. es. valori dalla confezione',
    subject: 'Oggetto *',
    subjectPlaceholder: 'p. es. domanda sul diario',
    message: 'Messaggio *',
    messagePlaceholder: 'Cosa vorresti comunicarci?',
    whichFood: 'Quale alimento è sbagliato? *',
    foodValues: (carbs, sugar, fat) =>
      `${carbs} g carboidrati · ${sugar} g zuccheri · ${fat} g grassi per 100 g`,
    otherFoodA11y: 'Scegli un altro alimento',
    correction: 'Correzione proposta *',
    correctionPlaceholder: 'p. es. 48 g di carboidrati per 100 g secondo la confezione',
    send: 'Invia',
    thanks: 'Grazie!',
    sentMessage: 'Il tuo messaggio ci è arrivato. Grazie per il tuo aiuto!',
    notSent: 'Non inviato',
    writeTo: (email) => `Puoi anche scriverci a ${email}.`,
    errorOffline:
      'Nessuna connessione Internet. Riprova più tardi – i tuoi dati inseriti vengono conservati.',
    errorNotConfigured:
      'Il modulo di contatto richiede una connessione al server Dialy, che qui non è configurato.',
    errorUnavailable: 'Al momento non è stato possibile inviare il messaggio. Riprova più tardi.',
  },

  auth: {
    alreadyRegisteredSignIn: 'Questo indirizzo e-mail è già registrato. Accedi.',
    confirmEmail: (email) =>
      `Quasi fatto! Ti abbiamo inviato un’e-mail a ${email}. Conferma il tuo indirizzo con il link contenuto e poi accedi.`,
    linkExpired: 'Il link è scaduto o è già stato usato. Richiedine uno nuovo.',
    localResetUnavailable:
      'Senza server la password non può essere reimpostata: gli account locali non hanno un indirizzo e-mail confermato. Se necessario, crea un nuovo account.',
    offline:
      'Nessuna connessione Internet. Accesso e registrazione richiedono Internet – tutto il resto funziona anche offline.',
    invalidLogin: 'E-mail o password errata.',
    alreadyRegistered: 'Questo indirizzo e-mail è già registrato.',
    emailNotConfirmed:
      'Conferma prima il tuo indirizzo e-mail (link nell’e-mail di conferma) e poi accedi.',
    samePassword: 'La nuova password deve essere diversa da quella precedente.',
    rateLimit: 'Troppi tentativi. Attendi un momento e riprova.',
    weakPassword: 'La password non soddisfa i requisiti (almeno 6 caratteri).',
    invalidEmail: 'Inserisci un indirizzo e-mail valido.',
    generic: 'Si è verificato un errore. Riprova.',
  },
};

export default it;
