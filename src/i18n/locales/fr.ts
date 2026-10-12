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
    appearance: 'Affichage',
    language: 'Langue',
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
    sport: 'Sport',
    login: 'Se connecter',
    settings: 'Réglages',
    contact: 'Contact',
    premium: 'Premium',
    privacy: 'Confidentialité',
    article: 'Article',
    register: 'S’inscrire',
    forgotPassword: 'Mot de passe oublié',
    brandA11y: 'Dialy – vers les conseils',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    toLight: 'Passer au mode clair',
    toDark: 'Passer au mode sombre',
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
    saveMeal: 'Enregistrer un repas dans le journal nécessite un compte.',
    saveSport: 'Enregistrer du sport dans le journal nécessite un compte.',
    diaryNeedsAccount:
      'Le journal nécessite un compte (gratuit). Ainsi, tes entrées restent en sécurité et disponibles sur tous tes appareils.',
    diaryNeedsPremium:
      'Le journal complet avec l’historique et l’analyse de la glycémie fait partie de Dialy Premium.',
    registerCta: 'S’inscrire gratuitement →',
  },

  khrechner: {
    title: 'Calcul des glucides',
    totalA11y: (carbs) => `Sous-total ${carbs}, afficher les aliments`,
    saveMealA11y: 'Enregistrer le repas dans le journal',
    clearA11y: 'Remettre le sous-total à zéro',
    searchPlaceholder: 'Rechercher un aliment…',
    all: 'Tous',
    noResults: 'Aucun résultat',
    resultCount: (n) => (n === 1 ? '1 aliment' : `${n} aliments`),
    showMore: (n) => `Afficher plus (${n})`,
    closeFoodA11y: 'Fermer l’aliment',
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
    accountRequired: 'Compte requis',
    freeAccountSavesMeals: 'Avec un compte gratuit, tes repas sont enregistrés dans le journal.',
    createAccount: 'Créer un compte',
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
    locked: 'Journal verrouillé',
    registerFree: 'S’inscrire gratuitement',
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
  },

  activities: {
    wandern: 'Randonnée',
    laufen: 'Course',
    rad: 'Vélo',
    schwimmen: 'Natation',
    kraft: 'Musculation',
  },

  sport: {
    title: 'Planifier le sport',
    activity: 'Activité',
    duration: 'Durée (minutes)',
    bgBefore: 'Glycémie avant le sport',
    curve: 'Évolution estimée de la glycémie',
    disclaimer:
      '⚠️ Estimation, pas une recommandation médicale. Dialy ne calcule aucune dose d’insuline.',
    carbsBefore: 'Glucides avant le sport',
    carbsAfter: 'Glucides après le sport',
    beforePrefix: 'Avant le sport',
    afterPrefix: 'Après',
    afterHint:
      'Après le sport, la sensibilité à l’insuline reste accrue pendant que les réserves de glycogène se reconstituent.',
    pump: 'Réduire le débit de base (pompe)',
    reduction: 'Réduction',
    for: 'pendant',
    pumpHint:
      'Simple note sur le réglage de ta propre pompe. Dialy ne donne aucune recommandation et ne calcule rien.',
    saved: 'Enregistré dans le journal ✓',
    save: 'Enregistrer le sport',
  },

  chart: {
    empty: 'Saisis des valeurs pour voir l’évolution.',
    sportStart: 'Début du sport',
    timeAxis: 'Temps en minutes',
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
    subtitle: 'Gratuit. Débloque le journal.',
    mismatch: 'Les mots de passe ne correspondent pas.',
    consentMissing: 'Merci d’accepter le traitement de tes données de santé.',
    consent:
      'J’accepte que mes saisies (y compris des données de santé comme les valeurs de glycémie) soient traitées pour fournir le journal. Elles ne sont pas utilisées à des fins publicitaires ou d’analyse.',
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
    premiumSub: 'Journal complet & analyse de la glycémie.',
    viewPremium: 'Voir Premium',
    devHint: 'Dev : appui long sur cette carte pour activer/désactiver Premium pour les tests.',
    privacy: 'Confidentialité',
    deleteData: 'Supprimer les données',
    deleteConfirm:
      'Veux-tu vraiment supprimer définitivement toutes tes entrées (repas, sport, glycémie) ?',
    partlyDeleted: 'Partiellement supprimé',
    deleted: 'Supprimé',
    partlyDeletedMessage:
      'Les données locales ont été supprimées. La suppression sur le serveur suivra lors de la prochaine synchronisation.',
    deletedMessage: 'Toutes tes entrées ont été supprimées.',
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
      'Suivi & analyse de la glycémie',
      'Synchronisation entre appareils',
    ],
    mockNote:
      'Remarque : dans cette version, le paiement n’est qu’un aperçu. Aucun véritable système de paiement n’est configuré.',
    active: 'Premium est actif ✓',
    unlock: 'Activer Premium (démo)',
  },

  privacy: {
    title: 'Déclaration de confidentialité',
    sections: [
      {
        h: 'Aperçu',
        b: 'Dialy est un compagnon pour le quotidien avec le diabète. L’app consigne les valeurs que tu saisis toi-même et estime les glucides ainsi qu’une tendance illustrative de la glycémie. Dialy n’est pas un dispositif médical et ne donne aucune recommandation de traitement ou de dosage.',
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
