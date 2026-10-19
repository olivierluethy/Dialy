import type { Dict } from '@/i18n/locales/de';

/** French (Swiss) UI copy. Same shape as de.ts. */
const fr: Dict = {
  common: {
    cancel: 'Annuler',
    save: 'Enregistrer',
    ok: 'OK',
    close: 'Fermer',
    back: 'Retour',
    retry: 'Réessayer',
    delete: 'Supprimer',
    next: 'Continuer',
    later: 'Plus tard',
    or: 'ou',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'nom@exemple.ch',
    passwordLabel: 'Mot de passe',
    confirmPasswordLabel: 'Confirmer le mot de passe',
    minChars: (n) => `au moins ${n} caractères`,
    privacyPolicy: 'Déclaration de confidentialité',
    termsOfUse: 'Conditions d’utilisation',
    appearance: 'Affichage',
    language: 'Langue',
    diabetesType: 'Type de diabète',
    requiredHint: '* Champ obligatoire',
    notAvailable: 'n.d.',
  },

  units: {
    carbs: 'glucides',
    minutes: 'min',
    hoursShort: 'h',
  },

  date: {
    months: [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
    ],
    weekdays: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    weekdaysShort: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    long: (day, month, year) => `${day === 1 ? '1er' : day} ${month} ${year}`,
    withWeekday: (weekday, day, month, year) =>
      `${weekday} ${day === 1 ? '1er' : day} ${month} ${year}`,
    datePlaceholder: 'JJ.MM.AAAA',
    timePlaceholder: 'HH:MM',
  },

  nav: {
    ratgeber: 'Conseils',
    khrechner: 'Calcul des glucides',
    tagebuch: 'Journal',
    blutzucker: 'Glycémie',
    sport: 'Sport',
    login: 'Se connecter',
    settings: 'Compte',
    contact: 'Contact',
    glucoseImport: 'Données de glycémie',
    premium: 'Premium',
    privacy: 'Confidentialité',
    terms: 'Conditions d’utilisation',
    article: 'Article',
    register: 'S’inscrire',
    forgotPassword: 'Mot de passe oublié',
    brandA11y: 'Dialy – vers les conseils',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    toLight: 'Passer au mode clair',
    toDark: 'Passer au mode sombre',
    groupDiabetes: 'Diabète',
    groupSettings: 'Paramètres',
    groupInfo: 'Informations',
  },

  theme: {
    dark: 'Sombre',
    light: 'Clair',
    system: 'Système',
  },

  diabetesType: {
    t1: 'Type 1',
    t2: 'Type 2',
  },

  gate: {
    saveMeal: 'Enregistrer un repas dans le journal nécessite un compte avec un abonnement.',
    saveSport: 'Enregistrer du sport dans le journal nécessite un compte avec un abonnement.',
    diaryNeedsAccount:
      'Le journal nécessite un compte avec un abonnement. Ainsi, tes entrées restent en sécurité et disponibles sur tous tes appareils.',
    diaryNeedsPremium:
      'Le journal fait partie de Dialy Premium. Avec l’abonnement, tu enregistres tes repas et ton sport et tu vois ton historique.',
    loginCta: 'Se connecter',
    premiumCta: 'Voir Premium',
  },

  khrechner: {
    title: 'Calcul des glucides',
    totalA11y: (carbs) => `Sous-total ${carbs}, afficher les aliments`,
    saveMealA11y: 'Enregistrer le repas dans le journal',
    clearA11y: 'Remettre le sous-total à zéro',
    searchPlaceholder: 'Rechercher un aliment…',
    all: 'Tous',
    category: 'Catégorie',
    noResults: 'Aucun résultat',
    noFoodsYet:
      'Les aliments sont téléchargés depuis Internet au premier démarrage. Connecte-toi à Internet – ensuite, le calculateur de glucides fonctionne aussi hors ligne.',
    resultCount: (n) => (n === 1 ? '1 aliment' : `${n} aliments`),
    showMore: (n, of) => `Afficher ${n} de plus sur ${of}`,
    closeFoodA11y: 'Fermer l’aliment',
    clearSearchA11y: 'Effacer la recherche',
    portionSize: 'Taille de la portion',
    grams: 'grammes',
    nutrients: 'Valeurs nutritives',
    carbs: 'Glucides',
    sugar: 'Sucres',
    gi: 'Index glycémique',
    fat: 'Lipides',
    thisPortion: (carbs) => `Cette portion : ${carbs}`,
    addToMeal: 'Ajouter au repas',
    mealTitle: 'Repas',
    total: 'Total',
    subscriptionRequired: 'Abonnement requis',
    saved: 'Enregistré',
    savedMessage: (n) =>
      n === 1
        ? '1 aliment a été ajouté au journal.'
        : `${n} aliments ont été ajoutés au journal.`,
    toDiary: 'Vers le journal',
    saveFailed: 'Échec de l’enregistrement',
    saveFailedMessage:
      'Tous les aliments n’ont pas pu être enregistrés. Les autres sont encore dans le repas – réessaie.',
    source: (text) => `Source : ${text}`,
    sourceManufacturer: 'indications du fabricant (état octobre 2026)',
  },

  foodCategories: {
    'Brote, Flocken und Frühstückscerealien': 'Pain & céréales',
    'Getreideprodukte, Hülsenfrüchte und Kartoffeln': 'Féculents & pommes de terre',
    Früchte: 'Fruits',
    Gemüse: 'Légumes',
    'Milch und Milchprodukte': 'Produits laitiers',
    Süssigkeiten: 'Sucreries',
    Gerichte: 'Plats',
    'Alkoholfreie Getränke': 'Boissons',
    'Salzige Snacks': 'Snacks',
    'Nüsse, Samen und Ölfrüchte': 'Noix & graines',
    'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten':
      'Alternatives végétales',
    'Fleisch und Innereien': 'Viande',
    'Fleisch- und Wurstwaren': 'Charcuterie',
    Fisch: 'Poisson',
    Eier: 'Œufs',
    'Fette und Öle': 'Graisses & huiles',
    'Alkoholhaltige Getränke': 'Alcool',
    Speziallebensmittel: 'Aliments spéciaux',
    Verschiedenes: 'Divers',
  },

  portions: {
    usual: (amount) => `Portion habituelle (${amount})`,
    package: (amount) => `Portion selon l’emballage (${amount})`,
    labels: {
      '½ Scheibe': '½ tranche',
      '1 Scheibe': '1 tranche',
      '2 Scheiben': '2 tranches',
      '1 Brötchen': '1 petit pain',
      '3 EL': '3 c. à soupe',
      '1 Portion': '1 portion',
      '½ Portion': '½ portion',
      'grosse Portion': 'grande portion',
      'kleine Portion': 'petite portion',
      'kleine Schale': 'petit bol',
      '1 Schale': '1 bol',
      '1 kleine': '1 petite',
      '½ Apfel': '½ pomme',
      '1 Apfel': '1 pomme',
      '½ Banane': '½ banane',
      '1 Banane': '1 banane',
      Handvoll: 'poignée',
      '1 Orange': '1 orange',
      '½ Becher': '½ pot',
      '1 Becher': '1 pot',
      '1 Glas': '1 verre',
      '1 Tasse': '1 tasse',
      '1 Stück': '1 morceau',
      '2 Stücke': '2 morceaux',
      '1 Ei': '1 œuf',
      '2 Eier': '2 œufs',
      '1 Gipfeli': '1 croissant',
      '1 Reihe': '1 rangée',
      '½ Tafel': '½ tablette',
      '1 Dose': '1 canette',
      '1 Plättchen': '1 pastille',
      '3 Plättchen': '3 pastilles',
      '1 Glas (2 dl)': '1 verre (2 dl)',
      '1 Dose (250 ml)': '1 canette (250 ml)',
      '1 Dose (330 ml)': '1 canette (330 ml)',
      '1 Dose (355 ml)': '1 canette (355 ml)',
      '1 Flasche (5 dl)': '1 bouteille (5 dl)',
    },
  },

  tagebuch: {
    title: 'Journal',
    done: 'Terminé',
    select: 'Sélectionner',
    multiSelect: 'Sélection multiple',
    prevHour: 'Une heure plus tôt',
    nextHour: 'Une heure plus tard',
    prevDay: 'Jour précédent',
    nextDay: 'Jour suivant',
    viewList: 'Liste',
    viewCalendar: 'Calendrier',
    noEntriesDay: 'Aucune entrée ce jour.',
    prevMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    locked: 'Journal verrouillé',
    tapToMark: 'Touche des entrées pour les sélectionner.',
    selectedCount: (n) =>
      n === 1 ? '1 entrée sélectionnée' : `${n} entrées sélectionnées`,
    changeDateTime: 'Modifier date et heure',
    empty:
      'Pas encore d’entrées. Ajoute quelque chose dans le calcul des glucides ou le planificateur de sport.',
    carbTotal: 'Glucides total',
    sameDateTime: (n) => `${n} entrées recevront la même date et la même heure.`,
    markHint: 'Sélectionner',
    editHint: 'Modifier l’entrée',
    bgCurveSaved: 'Courbe de glycémie enregistrée',
    invalidDateTime: 'Saisis la date au format JJ.MM.AAAA et l’heure au format HH:MM.',
    editDateTimeTitle: 'Modifier date et heure',
    editEntryTitle: 'Modifier l’entrée',
    date: 'Date',
    time: 'Heure',
    today: 'Aujourd’hui',
    yesterday: 'Hier',
    comment: 'Commentaire',
    commentPlaceholder: 'p. ex. avant le sport, hypo ensuite …',
    deleteEntryTitle: 'Supprimer l’entrée',
    deleteEntryConfirm: (name: string) => `Supprimer « ${name} » du journal ?`,
    deleteEntryA11y: (name: string) => `Supprimer ${name}`,
    editEntryA11y: (name: string) => `Modifier ${name}`,
    deleteEntriesConfirm: (n: number) => `Supprimer ${n} entrées du journal ?`,
  },

  blutzucker: {
    title: 'Ma glycémie',
    prevDay: 'Jour précédent',
    nextDay: 'Jour suivant',
    backToToday: 'Revenir à aujourd’hui',
    average: 'Moyenne',
    timeInRange: 'Temps dans la cible (3.9 à 10.0)',
    lowest: 'Valeur la plus basse',
    highest: 'Valeur la plus haute',
    atTime: (time: string) => `à ${time}`,
    delayHint:
      'Les dernières heures peuvent manquer : selon le fournisseur, les données CGM ne sont disponibles qu’avec quelques heures de retard.',
    chartTitle: 'Courbe de glycémie',
    legendGlucose: (unit: string) => `Glucose (${unit})`,
    legendTarget: 'Plage cible',
    noReadingsDay: 'Aucune valeur de glycémie pour ce jour.',
    mealsTitle: 'Repas',
    totalCarbs: (g: number) => `Total ${g} g de glucides`,
    noMeals: 'Aucun repas enregistré ce jour.',
    peakTooltip: (value: string, time: string) => `Pic ${value} à ${time}`,
    footnote: (unit: string) =>
      `Pic et hausse en ${unit}, mesurés dans les 2.5 heures après le repas. Les valeurs supérieures à 10.0 sont mises en évidence.`,
    disclaimer:
      'À titre informatif uniquement. Dialy ne donne aucune recommandation thérapeutique (p. ex. doses d’insuline) et ne remplace pas un lecteur.',
    manageData: 'Gérer les données de glycémie',
    emptyTitle: 'Pas encore de données de glycémie',
    emptyText:
      'Connecte une source CGM ou importe un export LibreView pour voir ta courbe avec tes repas.',
    importCta: 'Importer des données',
    locked: 'Glycémie verrouillée',
  },

  glucose: {
    needAccount: 'Connecte-toi pour importer des données de glycémie.',
    intro:
      'Importe tes valeurs de glucose depuis un capteur CGM et vois-les avec tes repas. Les valeurs sont stockées en mg/dL et affichées dans l’unité choisie.',
    unit: 'Unité',
    consentTitle: 'Consentement',
    consent:
      'Je consens à ce que mes valeurs de glucose (données de santé sensibles) soient importées et conservées par Dialy.',
    sources: 'Sources',
    dexcomSoon: 'Connexion directe via ton compte Dexcom (OAuth). Bientôt disponible.',
    comingSoon: 'Bientôt',
    healthHelp: (platform: string) =>
      `Dexcom et Libre écrivent leurs valeurs dans ${platform}. Dialy demande l’autorisation de lecture et les importe — sans mot de passe.`,
    healthConnect: 'Connecter et importer',
    healthUnavailable: 'Disponible uniquement dans l’app Dialy installée (pas en aperçu/navigateur).',
    healthDenied: 'Autorisation de lecture non accordée. Tu peux l’accorder dans les réglages système sous Health/Health Connect.',
    libreHelp: 'Exporte tes données dans LibreView (données de glucose en CSV) et colle le contenu ici.',
    csvPlaceholder: 'Colle le CSV LibreView ici …',
    importCsv: 'Importer le CSV',
    demoTitle: 'Données de démo',
    demoHelp: 'Génère une courbe journalière d’exemple pour aujourd’hui, selon tes repas du jour.',
    demoCta: 'Générer des données de démo pour aujourd’hui',
    stored: 'Données enregistrées',
    storedCount: (n: number) => `${n} valeurs de glycémie enregistrées.`,
    disconnectDelete: 'Déconnecter et supprimer toutes les données de glycémie',
    disclaimer:
      'Dialy affiche les valeurs à titre informatif et ne donne aucune recommandation thérapeutique. Tes valeurs sont transmises et stockées de manière chiffrée.',
    csvError: (key: string) => {
      switch (key) {
        case 'empty':
          return 'Le fichier est vide.';
        case 'noHeader':
          return 'Aucune ligne d’en-tête avec un horodatage trouvée. Est-ce un export LibreView ?';
        case 'noGlucoseColumn':
          return 'Aucune colonne de glucose (mg/dL ou mmol/L) trouvée.';
        case 'noReadings':
          return 'Aucune mesure valide trouvée.';
        default:
          return 'Le fichier n’a pas pu être lu.';
      }
    },
    importedTitle: 'Import terminé',
    importedMessage: (inserted: number, duplicates: number) =>
      `${inserted} nouvelles valeurs importées${duplicates > 0 ? `, ${duplicates} doublons ignorés` : ''}.`,
    importFailed: 'Échec de l’import',
    deleteTitle: 'Supprimer les données de glycémie',
    deleteConfirm: 'Supprimer définitivement toutes les valeurs de glycémie importées ?',
    deletedTitle: 'Supprimé',
    deletedMessage: (n: number) => `${n} valeurs de glycémie ont été supprimées.`,
  },

  activities: {
    wandern: 'Randonnée',
    laufen: 'Course',
    rad: 'Vélo',
    schwimmen: 'Natation',
    kraft: 'Musculation',
  },

  sport: {
    title: 'Saisir le sport',
    activity: 'Activité',
    duration: 'Durée (minutes)',
    bgBefore: 'Glycémie avant le sport',
    curve: 'Tendance typique (exemple général)',
    disclaimer:
      'Illustration générale, pas calculée pour toi : elle montre seulement dans quel sens la glycémie évolue souvent avec cette activité. Ni prévision ni recommandation – Dialy ne calcule ni dose d’insuline ni quantité de glucides.',
    carbsBefore: 'Glucides avant le sport (note)',
    carbsAfter: 'Glucides après le sport (note)',
    beforePrefix: 'Avant le sport',
    afterPrefix: 'Après',
    afterHint:
      'Après le sport, la sensibilité à l’insuline reste accrue pendant que les réserves de glycogène se reconstituent.',
    pump: 'Réglage de la pompe (note)',
    reduction: 'Réduction',
    for: 'pendant',
    pumpHint:
      'Simple note sur le réglage de ta propre pompe. Dialy ne donne aucune recommandation et ne calcule rien.',
    saved: 'Enregistré dans le journal',
    save: 'Enregistrer le sport',
  },

  chart: {
    timeAxis: 'Temps en minutes',
    noScale: 'Sans échelle – en pointillé : niveau de départ',
  },

  ratgeber: {
    title: 'Conseils',
    empty: 'Pas encore d’articles.',
    notFound: 'Article introuvable.',
    germanOnly: 'Les articles ne sont pour l’instant disponibles qu’en allemand.',
    errorOffline: 'Les conseils ne sont disponibles qu’avec une connexion Internet.',
    errorNotConfigured:
      'Les conseils nécessitent une connexion au serveur Dialy, qui n’est pas configuré ici.',
    errorUnavailable: 'Les articles n’ont pas pu être chargés pour le moment.',
    categories: {
      Sport: 'Sport',
      Nacht: 'Nuit',
      Insulin: 'Insuline',
      Technologie: 'Technologie',
      Ernährung: 'Alimentation',
      Medikamente: 'Médicaments',
      Alltag: 'Quotidien',
      Sicherheit: 'Sécurité',
    },
  },

  login: {
    welcome: 'Bienvenue',
    forgot: 'Mot de passe oublié ?',
    signIn: 'Se connecter',
    createAccount: 'Créer un compte',
  },

  register: {
    title: 'Créer un compte',
    subtitle: 'Gratuit. Le journal nécessite en plus Dialy Premium.',
    mismatch: 'Les mots de passe ne correspondent pas.',
    consentMissing: 'Merci d’accepter les conditions d’utilisation et le traitement de tes données de santé.',
    consent:
      'J’accepte les conditions d’utilisation et que mes saisies (y compris des données de santé comme les valeurs de glycémie) soient traitées conformément à la déclaration de confidentialité pour fournir le journal. Elles ne sont pas utilisées à des fins publicitaires ou d’analyse.',
    submit: 'S’inscrire',
  },

  forgot: {
    title: 'Mot de passe oublié',
    unavailable:
      'Sans serveur, le mot de passe ne peut pas être réinitialisé : les comptes locaux n’ont pas d’adresse e-mail confirmée. Crée un nouveau compte si nécessaire.',
    sent:
      'Si un compte existe avec cette adresse e-mail, nous t’avons envoyé un lien. Ouvre-le sur cet appareil pour définir un nouveau mot de passe.',
    intro:
      'Saisis l’adresse e-mail de ton compte. Nous t’enverrons un lien pour définir un nouveau mot de passe.',
    send: 'Envoyer le lien',
  },

  newPassword: {
    invalidLink: 'Lien non valable',
    title: 'Nouveau mot de passe',
    tooShort: (n) => `Le mot de passe doit comporter au moins ${n} caractères.`,
    changed: 'Ton mot de passe a été modifié et ta session est ouverte.',
    intro: 'Définis un nouveau mot de passe pour ton compte.',
    label: 'Nouveau mot de passe',
    save: 'Enregistrer le mot de passe',
  },

  account: {
    signedIn: 'Session ouverte',
    premium: 'Premium',
    freeAccount: 'Compte gratuit',
    premiumTitle: 'Dialy Premium (CHF 3.00 / mois)',
    premiumSub: 'Journal complet & historique de la glycémie.',
    viewPremium: 'Voir Premium',
    devHint: 'Dev : appui long sur cette carte pour activer/désactiver Premium pour les tests.',
    legal: 'Mentions légales & confidentialité',
    glucoseData: 'Glycémie et CGM',
    deleteData: 'Supprimer les données',
    deleteConfirm:
      'Veux-tu vraiment supprimer définitivement toutes tes entrées (repas, sport, glycémie) ?',
    partlyDeleted: 'Partiellement supprimé',
    deleted: 'Supprimé',
    partlyDeletedMessage:
      'Les données locales ont été supprimées. La suppression sur le serveur suivra lors de la prochaine synchronisation.',
    deletedMessage: 'Toutes tes entrées ont été supprimées.',
    deleteAccount: 'Supprimer le compte',
    deleteAccountConfirm:
      'Veux-tu vraiment supprimer définitivement ton compte et toutes tes données ? Un abonnement Premium en cours se résilie séparément dans l’App Store ou sur Google Play.',
    deleteAccountFailed: 'Compte non supprimé',
    accountDeleted: 'Compte supprimé',
    accountDeletedMessage: 'Ton compte et toutes tes données ont été supprimés.',
    sync: 'Synchronisation',
    signOut: 'Se déconnecter',
    syncLocalOnly:
      'Mode hors ligne : aucun serveur n’est configuré. Toutes les données restent sur l’appareil.',
    syncing: 'Synchronisation …',
    offlinePending: (n) =>
      n === 1
        ? 'Pas de connexion – 1 modification est en attente et sera envoyée automatiquement.'
        : `Pas de connexion – ${n} modifications sont en attente et seront envoyées automatiquement.`,
    offlineSaved: 'Pas de connexion – tes entrées sont enregistrées sur l’appareil.',
    syncFailed: 'Échec de la synchronisation – nouvel essai automatique.',
    pending: (n) =>
      n === 1
        ? '1 modification attend la synchronisation.'
        : `${n} modifications attendent la synchronisation.`,
    allSynced: (since) => `Tout est synchronisé · ${since}`,
    notSynced: 'Pas encore synchronisé.',
    justNow: 'à l’instant',
    minutesAgo: (n) => `il y a ${n} min`,
    today: 'aujourd’hui',
  },

  paywall: {
    price: 'CHF 3.00 / mois',
    features: [
      'Journal complet avec historique',
      'Historique & aperçus de la glycémie',
      'Synchronisation entre appareils',
    ],
    renewal:
      'L’abonnement se renouvelle automatiquement chaque mois et peut être résilié à tout moment jusqu’à 24 heures avant son échéance dans les réglages de ton compte App Store ou Google Play.',
    mockNote:
      'Remarque : dans cette version, le paiement n’est qu’un aperçu. Aucun véritable système de paiement n’est configuré.',
    active: 'Premium est actif',
    unlock: 'Activer Premium (démo)',
  },

  privacy: {
    title: 'Déclaration de confidentialité',
    sections: [
      {
        h: 'Aperçu',
        b: 'Dialy est un compagnon pour le quotidien avec le diabète. L’app consigne les valeurs que tu saisis toi-même additionne les glucides et montre pour le sport une illustration générale, non personnalisée. Dialy n’est pas un dispositif médical, ne calcule pas de doses d’insuline et ne donne aucune recommandation de traitement ou de dosage.',
      },
      {
        h: 'Quelles données nous traitons',
        b: 'Les repas, activités physiques et valeurs de glycémie que tu saisis. Ces données de santé sont considérées comme particulièrement sensibles (RGPD art. 9 / nLPD art. 5). Elles sont utilisées exclusivement pour fournir le journal.',
      },
      {
        h: 'Aucune utilisation publicitaire ou analytique',
        b: 'Tes données de santé ne sont pas utilisées à des fins de publicité, de marketing ou d’exploration de données, et ne sont pas vendues à des tiers.',
      },
      {
        h: 'Stockage',
        b: 'Tes données sont enregistrées localement sur ton appareil. Avec un compte, elles sont synchronisées de manière chiffrée avec notre serveur afin d’être disponibles sur plusieurs appareils. L’accès est limité à ton compte par une sécurité au niveau des lignes (row-level security).',
      },
      {
        h: 'Formulaire de contact',
        b: 'Les messages du formulaire de contact (proposer un aliment ou signaler une erreur) sont enregistrés sur notre serveur afin d’améliorer les données alimentaires. Si ta session est ouverte, le message est lié à ton compte pour que nous puissions te répondre en cas de questions.',
      },
      {
        h: 'Tes droits',
        b: 'Tu peux supprimer complètement tes données à tout moment dans les paramètres du compte, sous « Supprimer les données ». La suppression est également transmise au serveur.',
      },
      {
        h: 'Sources',
        b: 'Valeurs nutritives de la plupart des aliments du calcul des glucides : Base de données suisse des valeurs nutritives, Office fédéral de la sécurité alimentaire et des affaires vétérinaires (OSAV), naehrwertdaten.ch. Tailles de portion habituelles : OSAV, enquête nationale sur l’alimentation menuCH 2014-15. Autres aliments et plats : Max Rubner-Institut (2025), Bundeslebensmittelschlüssel (BLS) version 4.0, licence CC BY 4.0. Boissons de marque (p. ex. Rivella, Coca-Cola) : indications des fabricants pour la Suisse, état octobre 2026. Produits de marque : Open Food Facts (openfoodfacts.org), Open Database License (ODbL) – saisis par des bénévoles ; les indications figurant sur l’emballage font foi.',
      },
      {
        h: 'Contact',
        b: 'Pour toute question sur la protection des données, écris-nous à datenschutz@dialy.example. (provisoire)',
      },
    ],
  },

  terms: {
    title: 'Conditions d’utilisation',
    version: 'Version du 12 octobre 2026',
    sections: [
      {
        h: '1. Fournisseur',
        b: 'Dialy est proposée par [nom / entreprise], [rue n°], [NPA localité], Suisse, e-mail : [kontakt@dialy.example]. (Espace réservé – à compléter avant la publication.)',
      },
      {
        h: '2. Champ d’application',
        b: 'Les présentes conditions d’utilisation s’appliquent à l’utilisation de l’app Dialy. En créant un compte ou en souscrivant Premium, tu les acceptes. Sans compte, elles s’appliquent par analogie aux fonctions librement accessibles. Notre déclaration de confidentialité s’applique en complément.',
      },
      {
        h: '3. Ce que Dialy est – et ce qu’elle n’est pas',
        b: 'Dialy est un compagnon du quotidien pour les personnes diabétiques : l’app affiche les valeurs nutritives des aliments, additionne les glucides d’un repas, tient un journal des valeurs que tu saisis toi-même et propose des articles d’information générale.\n\nDialy n’est pas un dispositif médical au sens de l’ordonnance sur les dispositifs médicaux (ODim) ni du règlement (UE) 2017/745. Dialy ne pose aucun diagnostic, ne donne aucune recommandation de thérapie ou de traitement, ne calcule ni doses d’insuline, ni corrections, ni quantités de glucides à manger, ni réglages de pompe, ne prédit pas ta glycémie et n’avertit pas en cas d’hypo- ou d’hyperglycémie. La courbe de la page sport est une illustration générale et n’est pas calculée pour toi. Les champs concernant les glucides ou la pompe sont de simples notes sur ce que tu as décidé toi-même.\n\nPrends toujours les décisions concernant ta thérapie toi-même ou avec ton équipe diabète. Dialy ne remplace ni un avis médical ni les mesures de glycémie. En cas d’urgence, appelle le 144.',
      },
      {
        h: '4. Valeurs nutritives',
        b: 'Les valeurs nutritives proviennent de bases de données publiques (notamment la Base de données suisse des valeurs nutritives de l’OSAV, le Bundeslebensmittelschlüssel et Open Food Facts) et des fabricants. Ce sont des valeurs moyennes ou indicatives, qui peuvent être incomplètes, dépassées ou erronées et varier selon le produit, la recette et la préparation. Les portions sont des estimations. Les indications figurant sur l’emballage font toujours foi. Nous n’assumons aucune garantie quant à leur exactitude.',
      },
      {
        h: '5. Compte',
        b: 'Il te faut un compte pour le journal. Tu dois avoir au moins 16 ans. Les plus jeunes ne peuvent utiliser Dialy qu’avec l’accord de leurs parents ou de leur représentant légal. Un compte est personnel. Garde ton mot de passe secret et informe-nous si tu soupçonnes un abus.',
      },
      {
        h: '6. Utilisation gratuite et Premium',
        b: 'Le calculateur de glucides, les conseils et la page sport sont gratuits. Premium coûte CHF 3.00 par mois (prix TVA incluse, sous réserve de modifications) et débloque des fonctions supplémentaires décrites dans l’app.\n\nPremium est souscrit et facturé sous forme d’abonnement via l’App Store d’Apple ou Google Play ; leurs conditions s’appliquent en plus. L’abonnement se renouvelle automatiquement chaque mois si tu ne le résilies pas au plus tard 24 heures avant son échéance dans les réglages de ton compte du store. Une résiliation prend effet à la fin de la période en cours. Les remboursements sont régis par les règles d’Apple ou de Google. Nous annonçons les changements de prix à temps ; ils ne s’appliquent qu’à partir de la période suivante et seulement si tu ne résilies pas.',
      },
      {
        h: '7. Disponibilité',
        b: 'Nous nous efforçons d’assurer un fonctionnement fiable, mais ne pouvons garantir une disponibilité ininterrompue. Des fonctions peuvent être modifiées, étendues ou supprimées. Tes entrées sont enregistrées sur l’appareil et, avec un compte, sauvegardées sur notre serveur ; conserve en plus les valeurs importantes là où ton équipe diabète en a besoin.',
      },
      {
        h: '8. Responsabilité',
        b: 'Tu utilises Dialy sous ta propre responsabilité. Nous ne répondons pas des décisions concernant l’alimentation, l’insuline ou la thérapie que tu prends sur la base de l’app, ni des valeurs nutritives inexactes ou des pertes de données. Dans la mesure permise par la loi, notre responsabilité est limitée au dol et à la négligence grave. La responsabilité légale impérative, par exemple pour les dommages corporels ou selon la loi sur la responsabilité du fait des produits, est réservée.',
      },
      {
        h: '9. Droits',
        b: 'L’app, ses textes et son design appartiennent au fournisseur ou aux titulaires de droits respectifs. Tu obtiens un droit simple et non transférable d’utiliser Dialy à des fins privées. Les licences des sources s’appliquent aux données nutritionnelles (voir la déclaration de confidentialité, section « Sources »).',
      },
      {
        h: '10. Résiliation et suppression',
        b: 'Tu peux cesser d’utiliser Dialy à tout moment et supprimer tes données dans les réglages sous « Supprimer les données ». Un abonnement Premium en cours se résilie séparément dans l’App Store ou sur Google Play. Nous pouvons bloquer ou supprimer des comptes en cas de violation des présentes conditions.',
      },
      {
        h: '11. Modifications',
        b: 'Nous pouvons adapter les présentes conditions d’utilisation, par exemple en cas de nouvelles fonctions ou de modifications légales. Nous t’informons à l’avance dans l’app des modifications importantes. Si tu n’es pas d’accord, tu peux cesser d’utiliser l’app et supprimer ton compte.',
      },
      {
        h: '12. Droit applicable et for',
        b: 'Le droit suisse est applicable. Le for est au siège du fournisseur. Si tu vis dans un autre pays en tant que consommatrice ou consommateur, tu conserves les dispositions protectrices impératives et les fors de ton pays de domicile.',
      },
    ],
  },

  contact: {
    intro:
      'Un aliment manque, une valeur est fausse ou tu as une autre demande ? Écris-nous – nous examinons chaque message.',
    kindNew: 'Nouvel aliment',
    kindFix: 'Signaler une erreur',
    kindOther: 'Autre',
    foodName: 'Nom de l’aliment *',
    foodNamePlaceholder: 'p. ex. petit pain complet à l’épeautre',
    valuesLabel: 'Valeurs nutritives pour 100 g (si connues)',
    carbs: 'Glucides (g)',
    sugar: 'Sucres (g)',
    fat: 'Lipides (g)',
    valuesInvalid: 'Indique les valeurs nutritives sous forme de nombre entre 0 et 100.',
    remark: 'Remarque / source',
    remarkPlaceholder: 'p. ex. valeurs de l’emballage',
    subject: 'Objet *',
    subjectPlaceholder: 'p. ex. question sur le journal',
    message: 'Message *',
    messagePlaceholder: 'Que souhaites-tu nous dire ?',
    whichFood: 'Quel aliment est faux ? *',
    foodValues: (carbs, sugar, fat) =>
      `${carbs} g glucides · ${sugar} g sucres · ${fat} g lipides pour 100 g`,
    otherFoodA11y: 'Choisir un autre aliment',
    correction: 'Correction proposée *',
    correctionPlaceholder: 'p. ex. 48 g de glucides pour 100 g selon l’emballage',
    send: 'Envoyer',
    thanks: 'Merci !',
    sentMessage: 'Ton message nous est bien parvenu. Merci pour ton aide !',
    notSent: 'Non envoyé',
    writeTo: (email) => `Tu peux aussi nous écrire à ${email}.`,
    errorOffline:
      'Pas de connexion Internet. Réessaie plus tard – tes saisies sont conservées.',
    errorNotConfigured:
      'Le formulaire de contact nécessite une connexion au serveur Dialy, qui n’est pas configuré ici.',
    errorUnavailable:
      'Le message n’a pas pu être envoyé pour le moment. Réessaie plus tard.',
  },

  auth: {
    alreadyRegisteredSignIn: 'Cette adresse e-mail est déjà enregistrée. Connecte-toi.',
    confirmEmail: (email) =>
      `Presque terminé ! Nous t’avons envoyé un e-mail à ${email}. Confirme ton adresse avec le lien qu’il contient, puis connecte-toi.`,
    linkExpired: 'Le lien a expiré ou a déjà été utilisé. Demandes-en un nouveau.',
    localResetUnavailable:
      'Sans serveur, le mot de passe ne peut pas être réinitialisé : les comptes locaux n’ont pas d’adresse e-mail confirmée. Crée un nouveau compte si nécessaire.',
    offline:
      'Pas de connexion Internet. La connexion et l’inscription nécessitent Internet – tout le reste fonctionne aussi hors ligne.',
    invalidLogin: 'L’e-mail ou le mot de passe est incorrect.',
    alreadyRegistered: 'Cette adresse e-mail est déjà enregistrée.',
    emailNotConfirmed:
      'Confirme d’abord ton adresse e-mail (lien dans l’e-mail de confirmation), puis connecte-toi.',
    samePassword: 'Le nouveau mot de passe doit être différent de l’ancien.',
    rateLimit: 'Trop de tentatives. Attends un moment et réessaie.',
    weakPassword: 'Le mot de passe ne remplit pas les exigences (au moins 6 caractères).',
    invalidEmail: 'Saisis une adresse e-mail valable.',
    generic: 'Une erreur s’est produite. Réessaie.',
  },
};

export default fr;
