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
    appearance: 'Aspetto',
    language: 'Lingua',
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
    long: (day, month, year) => `${day} ${month} ${year}`,
    withWeekday: (weekday, day, month, year) => `${weekday} ${day} ${month} ${year}`,
    datePlaceholder: 'GG.MM.AAAA',
    timePlaceholder: 'HH:MM',
  },

  nav: {
    ratgeber: 'Consigli',
    khrechner: 'Conta carboidrati',
    tagebuch: 'Diario',
    sport: 'Sport',
    login: 'Accedi',
    settings: 'Impostazioni',
    contact: 'Contatto',
    premium: 'Premium',
    privacy: 'Privacy',
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
    saveMeal: 'Salvare un pasto nel diario richiede un account.',
    saveSport: 'Salvare lo sport nel diario richiede un account.',
    diaryNeedsAccount:
      'Il diario richiede un account (gratuito). Così le tue voci restano al sicuro e disponibili su tutti i dispositivi.',
    diaryNeedsPremium:
      'Il diario completo con andamento e analisi della glicemia fa parte di Dialy Premium.',
    registerCta: 'Registrati gratuitamente →',
  },

  khrechner: {
    title: 'Conta carboidrati',
    totalA11y: (carbs) => `Subtotale ${carbs}, mostra alimenti`,
    saveMealA11y: 'Salva il pasto nel diario',
    clearA11y: 'Azzera il subtotale',
    searchPlaceholder: 'Cerca alimenti…',
    all: 'Tutti',
    noResults: 'Nessun risultato',
    resultCount: (n) => (n === 1 ? '1 alimento' : `${n} alimenti`),
    showMore: (n) => `Mostra altri (${n})`,
    closeFoodA11y: 'Chiudi alimento',
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
    accountRequired: 'Account necessario',
    freeAccountSavesMeals: 'Con un account gratuito i tuoi pasti vengono salvati nel diario.',
    createAccount: 'Crea account',
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
    locked: 'Diario bloccato',
    registerFree: 'Registrati gratuitamente',
    tapToMark: 'Tocca le voci per selezionarle.',
    selectedCount: (n) => (n === 1 ? '1 voce selezionata' : `${n} voci selezionate`),
    changeDateTime: 'Modifica data e ora',
    empty: 'Ancora nessuna voce. Aggiungi qualcosa nel conta carboidrati o nel pianificatore sport.',
    carbTotal: 'Carboidrati tot.',
    meals: 'Pasti',
    sport: 'Sport',
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
  },

  activities: {
    wandern: 'Escursione',
    laufen: 'Corsa',
    rad: 'Bici',
    schwimmen: 'Nuoto',
    kraft: 'Forza',
  },

  sport: {
    title: 'Pianifica sport',
    activity: 'Attività',
    duration: 'Durata (minuti)',
    bgBefore: 'Glicemia prima dello sport',
    curve: 'Andamento stimato della glicemia',
    disclaimer:
      '⚠️ Stima, non una raccomandazione medica. Dialy non calcola dosi di insulina.',
    carbsBefore: 'Carboidrati prima dello sport',
    carbsAfter: 'Carboidrati dopo lo sport',
    beforePrefix: 'Prima dello sport',
    afterPrefix: 'Dopo',
    afterHint:
      'Dopo lo sport la sensibilità all’insulina resta elevata mentre le riserve di glicogeno vengono ricostituite.',
    pump: 'Ridurre la basale (microinfusore)',
    reduction: 'Riduzione',
    for: 'per',
    pumpHint:
      'Solo una nota sull’impostazione del tuo microinfusore. Dialy non dà raccomandazioni e non calcola nulla.',
    saved: 'Salvato nel diario ✓',
    save: 'Salva sport',
  },

  chart: {
    empty: 'Inserisci dei valori per vedere l’andamento.',
    sportStart: 'Inizio sport',
    timeAxis: 'Tempo in minuti',
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
    subtitle: 'Gratuito. Sblocca il diario.',
    mismatch: 'Le password non coincidono.',
    consentMissing: 'Acconsenti al trattamento dei tuoi dati sanitari.',
    consent:
      'Acconsento al trattamento dei miei dati (compresi dati sanitari come i valori glicemici) per fornire il diario. Non vengono usati per pubblicità o analisi.',
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
    premiumSub: 'Diario completo & analisi della glicemia.',
    viewPremium: 'Vedi Premium',
    devHint: 'Dev: tieni premuta questa scheda per attivare/disattivare Premium per i test.',
    privacy: 'Privacy',
    deleteData: 'Elimina dati',
    deleteConfirm:
      'Vuoi davvero eliminare definitivamente tutte le tue voci (pasti, sport, glicemia)?',
    partlyDeleted: 'Eliminato in parte',
    deleted: 'Eliminato',
    partlyDeletedMessage:
      'I dati locali sono stati eliminati. L’eliminazione sul server seguirà alla prossima sincronizzazione.',
    deletedMessage: 'Tutte le tue voci sono state eliminate.',
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
      'Monitoraggio & analisi della glicemia',
      'Sincronizzazione tra dispositivi',
    ],
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
        b: 'Dialy è un compagno per la vita quotidiana con il diabete. L’app registra i valori che inserisci tu stesso e stima i carboidrati e un andamento illustrativo della glicemia. Dialy non è un dispositivo medico e non fornisce raccomandazioni terapeutiche o di dosaggio.',
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
