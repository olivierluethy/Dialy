import type { Dict } from '@/i18n/locales/de';

/** English UI copy (British spelling). Same shape as de.ts. */
const en: Dict = {
  common: {
    cancel: 'Cancel',
    save: 'Save',
    ok: 'OK',
    close: 'Close',
    back: 'Back',
    retry: 'Try again',
    delete: 'Delete',
    next: 'Continue',
    later: 'Later',
    or: 'or',
    emailLabel: 'Email address',
    emailPlaceholder: 'name@example.ch',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm password',
    minChars: (n) => `at least ${n} characters`,
    privacyPolicy: 'Privacy policy',
    termsOfUse: 'Terms of use',
    appearance: 'Appearance',
    language: 'Language',
    requiredHint: '* Required',
    notAvailable: 'n/a',
  },

  units: {
    carbs: 'carbs',
    minutes: 'min',
    hoursShort: 'h',
  },

  date: {
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    long: (day, month, year) => `${day} ${month} ${year}`,
    withWeekday: (weekday, day, month, year) => `${weekday}, ${day} ${month} ${year}`,
    datePlaceholder: 'DD.MM.YYYY',
    timePlaceholder: 'HH:MM',
  },

  nav: {
    ratgeber: 'Guide',
    khrechner: 'Carb Counter',
    tagebuch: 'Diary',
    sport: 'Sport',
    login: 'Sign in',
    settings: 'Settings',
    contact: 'Contact',
    premium: 'Premium',
    privacy: 'Privacy',
    terms: 'Terms of use',
    article: 'Article',
    register: 'Sign up',
    forgotPassword: 'Forgot password',
    brandA11y: 'Dialy – go to the guide',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
  },

  theme: {
    dark: 'Dark',
    light: 'Light',
    system: 'System',
  },

  diabetesType: {
    t1: 'Type 1',
    t2: 'Type 2',
  },

  gate: {
    saveMeal: 'Saving a meal to the diary requires an account.',
    saveSport: 'Saving sport to the diary requires an account.',
    diaryNeedsAccount:
      'The diary requires an account with a subscription. That way your entries stay safe and available on all your devices.',
    diaryNeedsPremium:
      'The full diary with blood glucose history and overviews is part of Dialy Premium.',
    registerCta: 'Sign up for free →',
  },

  khrechner: {
    title: 'Carb Counter',
    totalA11y: (carbs) => `Subtotal ${carbs}, show foods`,
    saveMealA11y: 'Save meal to the diary',
    clearA11y: 'Reset subtotal to zero',
    searchPlaceholder: 'Search foods…',
    all: 'All',
    noResults: 'No results',
    resultCount: (n) => (n === 1 ? '1 food' : `${n} foods`),
    showMore: (n) => `Show more (${n})`,
    closeFoodA11y: 'Close food',
    portionSize: 'Portion size',
    grams: 'grams',
    nutrients: 'Nutrients',
    carbs: 'Carbohydrates',
    sugar: 'Sugar',
    gi: 'Glycaemic index',
    fat: 'Fat',
    thisPortion: (carbs) => `This portion: ${carbs}`,
    addToMeal: 'Add to meal',
    mealTitle: 'Meal',
    total: 'Total',
    accountRequired: 'Account required',
    freeAccountSavesMeals: 'With a free account, your meals are saved in the diary.',
    createAccount: 'Create account',
    saved: 'Saved',
    savedMessage: (n) =>
      n === 1 ? '1 food was added to the diary.' : `${n} foods were added to the diary.`,
    toDiary: 'Go to diary',
    saveFailed: 'Saving failed',
    saveFailedMessage:
      'Not all foods could be saved. The rest are still in the meal – please try again.',
    source: (text) => `Source: ${text}`,
    sourceManufacturer: 'manufacturer information (as of October 2026)',
  },

  foodCategories: {
    'Brote, Flocken und Frühstückscerealien': 'Bread & cereals',
    'Getreideprodukte, Hülsenfrüchte und Kartoffeln': 'Grains & potatoes',
    Früchte: 'Fruit',
    Gemüse: 'Vegetables',
    'Milch und Milchprodukte': 'Dairy',
    Süssigkeiten: 'Sweets',
    Gerichte: 'Dishes',
    'Alkoholfreie Getränke': 'Drinks',
    'Salzige Snacks': 'Snacks',
    'Nüsse, Samen und Ölfrüchte': 'Nuts & seeds',
    'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten':
      'Plant-based alternatives',
    'Fleisch und Innereien': 'Meat',
    'Fleisch- und Wurstwaren': 'Cold cuts',
    Fisch: 'Fish',
    Eier: 'Eggs',
    'Fette und Öle': 'Fats & oils',
    'Alkoholhaltige Getränke': 'Alcohol',
    Speziallebensmittel: 'Special foods',
    Verschiedenes: 'Miscellaneous',
  },

  portions: {
    usual: (amount) => `Usual portion (${amount})`,
    package: (amount) => `Portion per package (${amount})`,
    labels: {
      '½ Scheibe': '½ slice',
      '1 Scheibe': '1 slice',
      '2 Scheiben': '2 slices',
      '1 Brötchen': '1 roll',
      '3 EL': '3 tbsp',
      '1 Portion': '1 portion',
      '½ Portion': '½ portion',
      'grosse Portion': 'large portion',
      'kleine Portion': 'small portion',
      'kleine Schale': 'small bowl',
      '1 Schale': '1 bowl',
      '1 kleine': '1 small',
      '½ Apfel': '½ apple',
      '1 Apfel': '1 apple',
      '½ Banane': '½ banana',
      '1 Banane': '1 banana',
      Handvoll: 'handful',
      '1 Orange': '1 orange',
      '½ Becher': '½ pot',
      '1 Becher': '1 pot',
      '1 Glas': '1 glass',
      '1 Tasse': '1 cup',
      '1 Stück': '1 piece',
      '2 Stücke': '2 pieces',
      '1 Ei': '1 egg',
      '2 Eier': '2 eggs',
      '1 Gipfeli': '1 croissant',
      '1 Reihe': '1 row',
      '½ Tafel': '½ bar',
      '1 Dose': '1 can',
      '1 Plättchen': '1 tablet',
      '3 Plättchen': '3 tablets',
      '1 Glas (2 dl)': '1 glass (2 dl)',
      '1 Dose (250 ml)': '1 can (250 ml)',
      '1 Dose (330 ml)': '1 can (330 ml)',
      '1 Dose (355 ml)': '1 can (355 ml)',
      '1 Flasche (5 dl)': '1 bottle (5 dl)',
    },
  },

  tagebuch: {
    title: 'Diary',
    done: 'Done',
    select: 'Select',
    locked: 'Diary locked',
    tapToMark: 'Tap entries to select them.',
    selectedCount: (n) => `${n} ${n === 1 ? 'entry' : 'entries'} selected`,
    changeDateTime: 'Change date & time',
    empty: 'No entries yet. Add something in the carb counter or the sport planner.',
    carbTotal: 'Total carbs',
    sameDateTime: (n) => `${n} entries will get the same date and time.`,
    markHint: 'Select',
    editHint: 'Edit entry',
    bgCurveSaved: 'Blood glucose curve saved',
    invalidDateTime: 'Please enter the date as DD.MM.YYYY and the time as HH:MM.',
    editDateTimeTitle: 'Change date & time',
    editEntryTitle: 'Edit entry',
    date: 'Date',
    time: 'Time',
    today: 'Today',
    yesterday: 'Yesterday',
    comment: 'Comment',
    commentPlaceholder: 'e.g. before sport, hypo afterwards …',
  },

  activities: {
    wandern: 'Hiking',
    laufen: 'Running',
    rad: 'Cycling',
    schwimmen: 'Swimming',
    kraft: 'Strength',
  },

  sport: {
    title: 'Log sport',
    activity: 'Activity',
    duration: 'Duration (minutes)',
    bgBefore: 'Blood glucose before',
    curve: 'Typical tendency (general example)',
    disclaimer:
      '⚠️ General illustration, not calculated for you: it only shows which way blood glucose often moves with this activity. No prediction and no recommendation – Dialy does not calculate insulin doses or carbohydrate amounts.',
    carbsBefore: 'Carbohydrates before sport (note)',
    carbsAfter: 'Carbohydrates after sport (note)',
    beforePrefix: 'Before sport',
    afterPrefix: 'After',
    afterHint:
      'After sport, insulin sensitivity stays higher while the glycogen stores are being refilled.',
    pump: 'Pump adjustment (note)',
    reduction: 'Reduction',
    for: 'for',
    pumpHint:
      'Only a note about your own pump setting. Dialy makes no recommendation and calculates nothing.',
    saved: 'Saved to diary ✓',
    save: 'Save sport',
  },

  chart: {
    timeAxis: 'Time in minutes',
    noScale: 'No scale – dashed: starting level',
  },

  ratgeber: {
    title: 'Guide',
    empty: 'No articles yet.',
    notFound: 'Article not found.',
    germanOnly: 'The articles are currently only available in German.',
    errorOffline: 'The guide is only available with an internet connection.',
    errorNotConfigured:
      'The guide needs a connection to the Dialy server, which is not set up here.',
    errorUnavailable: 'The articles could not be loaded right now.',
    categories: {
      Sport: 'Sport',
      Nacht: 'Night',
      Insulin: 'Insulin',
      Technologie: 'Technology',
      Ernährung: 'Nutrition',
      Medikamente: 'Medication',
      Alltag: 'Everyday life',
      Sicherheit: 'Safety',
    },
  },

  login: {
    welcome: 'Welcome',
    forgot: 'Forgot password?',
    signIn: 'Sign in',
    createAccount: 'Create account',
  },

  register: {
    title: 'Create account',
    subtitle: 'Free. Unlocks the diary.',
    mismatch: 'The passwords do not match.',
    consentMissing: 'Please accept the terms of use and agree to the processing of your health data.',
    consent:
      'I accept the terms of use and agree that my entries (including health data such as blood glucose values) are processed to provide the diary as described in the privacy policy. They are not used for advertising or analytics.',
    submit: 'Sign up',
  },

  forgot: {
    title: 'Forgot password',
    unavailable:
      'Without a server the password cannot be reset: local accounts have no confirmed email address. Create a new account if needed.',
    sent:
      'If an account with this email address exists, we have sent you a link. Open it on this device to set a new password.',
    intro:
      'Enter the email address of your account. We will send you a link to set a new password.',
    send: 'Send link',
  },

  newPassword: {
    invalidLink: 'Invalid link',
    title: 'New password',
    tooShort: (n) => `The password needs at least ${n} characters.`,
    changed: 'Your password has been changed. You are signed in.',
    intro: 'Set a new password for your account.',
    label: 'New password',
    save: 'Save password',
  },

  account: {
    signedIn: 'Signed in',
    premium: 'Premium',
    freeAccount: 'Free account',
    premiumTitle: 'Dialy Premium (CHF 3.00 / month)',
    premiumSub: 'Full diary & blood glucose history.',
    viewPremium: 'View Premium',
    devHint: 'Dev: long-press this card to toggle Premium for testing.',
    legal: 'Legal & privacy',
    deleteData: 'Delete data',
    deleteConfirm:
      'Do you really want to permanently delete all your entries (meals, sport, blood glucose)?',
    partlyDeleted: 'Partly deleted',
    deleted: 'Deleted',
    partlyDeletedMessage:
      'Local data has been deleted. Deletion on the server follows with the next sync.',
    deletedMessage: 'All your entries have been deleted.',
    sync: 'Sync',
    signOut: 'Sign out',
    syncLocalOnly:
      'Offline mode: no server is configured. All data stays locally on the device.',
    syncing: 'Syncing …',
    offlinePending: (n) =>
      n === 1
        ? 'No connection – 1 change is waiting and will be sent automatically.'
        : `No connection – ${n} changes are waiting and will be sent automatically.`,
    offlineSaved: 'No connection – your entries are saved on the device.',
    syncFailed: 'Sync failed – it will be retried automatically.',
    pending: (n) =>
      n === 1 ? '1 change is waiting to be synced.' : `${n} changes are waiting to be synced.`,
    allSynced: (since) => `Everything synced · ${since}`,
    notSynced: 'Not synced yet.',
    justNow: 'just now',
    minutesAgo: (n) => `${n} min ago`,
    today: 'today',
  },

  paywall: {
    price: 'CHF 3.00 / month',
    features: ['Full diary with history', 'Blood glucose history & overviews', 'Sync across devices'],
    renewal:
      'The subscription renews automatically every month and can be cancelled at any time up to 24 hours before it ends in your App Store or Google Play account settings.',
    mockNote:
      'Note: in this build, payment is only a preview. No real payment system is set up.',
    active: 'Premium is active ✓',
    unlock: 'Unlock Premium (demo)',
  },

  privacy: {
    title: 'Privacy policy',
    sections: [
      {
        h: 'Overview',
        b: 'Dialy is a companion for everyday life with diabetes. The app records values you enter yourself adds up carbohydrates and shows a general, non-personal illustration for sport. Dialy is not a medical device, does not calculate insulin doses and gives no therapy or dosage recommendations.',
      },
      {
        h: 'What data we process',
        b: 'Meals, physical activities and blood glucose values that you enter. This health data is considered particularly sensitive (GDPR Art. 9 / revFADP Art. 5). It is used exclusively to provide the diary.',
      },
      {
        h: 'No advertising or analytics',
        b: 'Your health data is not used for advertising, marketing or data mining and is not sold to third parties.',
      },
      {
        h: 'Storage',
        b: 'Your data is stored locally on your device. With an account, it is synchronised encrypted with our server so that it is available on several devices. Access is restricted to your account by row-level security.',
      },
      {
        h: 'Contact form',
        b: 'Messages from the contact form (suggesting a food or reporting an error) are stored on our server to improve the food data. If you are signed in, the message is linked to your account so that we can reply to questions.',
      },
      {
        h: 'Your rights',
        b: 'You can remove your data completely at any time in the account settings under “Delete data”. The deletion is also passed on to the server.',
      },
      {
        h: 'Sources',
        b: 'Nutrient values of most foods in the carb counter: Swiss Food Composition Database, Federal Food Safety and Veterinary Office (FSVO), naehrwertdaten.ch. Usual portion sizes: FSVO, national nutrition survey menuCH 2014-15. Further foods and dishes: Max Rubner-Institut (2025), German Nutrient Database (BLS) version 4.0, licence CC BY 4.0. Branded drinks (e.g. Rivella, Coca-Cola): manufacturer information for Switzerland, as of October 2026. Branded products: Open Food Facts (openfoodfacts.org), Open Database License (ODbL) – collected by volunteers; the information on the package takes precedence.',
      },
      {
        h: 'Contact',
        b: 'For questions about data protection, contact us at datenschutz@dialy.example. (placeholder)',
      },
    ],
  },

  terms: {
    title: 'Terms of use',
    version: 'Version: 12 October 2026',
    sections: [
      {
        h: '1. Provider',
        b: 'Dialy is provided by [name / company], [street no.], [postcode town], Switzerland, email: [kontakt@dialy.example]. (Placeholder – to be completed before publication.)',
      },
      {
        h: '2. Scope',
        b: 'These terms of use apply to the use of the Dialy app. By creating an account or purchasing Premium you accept them. Without an account they apply accordingly to the freely accessible features. Our privacy policy also applies.',
      },
      {
        h: '3. What Dialy is – and what it is not',
        b: 'Dialy is an everyday companion for people with diabetes: the app shows the nutritional values of foods, adds up the carbohydrates of a meal, keeps a diary of values you enter yourself and offers general information articles.\n\nDialy is not a medical device within the meaning of the Swiss Medical Devices Ordinance (MedDO) or EU Regulation 2017/745. Dialy does not make diagnoses, does not give therapy or treatment recommendations, does not calculate insulin doses, corrections, amounts of carbohydrates to eat or pump settings, does not predict your blood glucose and does not warn of hypo- or hyperglycaemia. The curve on the sport page is a general illustration and is not calculated for you. Fields for carbohydrates or the pump are only notes about what you decided yourself.\n\nAlways make decisions about your therapy yourself or together with your diabetes team. Dialy replaces neither medical advice nor blood glucose measurements. In an emergency call 144 (Switzerland) or 112.',
      },
      {
        h: '4. Nutritional values',
        b: 'The nutritional values come from public databases (including the Swiss Food Composition Database of the FSVO, the German Federal Food Key and Open Food Facts) and from manufacturers. They are averages or guide values, may be incomplete, outdated or wrong and differ depending on the product, recipe and preparation. Portion sizes are estimates. The information on the packaging always takes precedence. We give no guarantee of accuracy.',
      },
      {
        h: '5. Account',
        b: 'You need an account for the diary. You must be at least 16 years old. Younger people may only use Dialy with the consent of their parents or legal guardian. An account is personal. Keep your password secret and let us know if you suspect misuse.',
      },
      {
        h: '6. Free use and Premium',
        b: 'The carb calculator, the guide and the sport page are free. Premium costs CHF 3.00 per month (prices incl. VAT, subject to change) and unlocks additional features described in the app.\n\nPremium is purchased and billed as a subscription through the Apple App Store or Google Play; their terms also apply. The subscription renews automatically every month unless you cancel it in your store account settings at least 24 hours before it ends. A cancellation takes effect at the end of the current period. Refunds are governed by the rules of Apple or Google. We announce price changes in good time; they only apply from the next period and only if you do not cancel.',
      },
      {
        h: '7. Availability',
        b: 'We strive for reliable operation but cannot guarantee uninterrupted availability. Features may be changed, extended or discontinued. Your entries are stored on the device and, with an account, backed up on our server; also keep important values where your diabetes team needs them.',
      },
      {
        h: '8. Liability',
        b: 'You use Dialy at your own responsibility. We are not liable for decisions about diet, insulin or therapy that you make on the basis of the app, nor for inaccurate nutritional values or data loss. To the extent permitted by law, our liability is limited to intent and gross negligence. Mandatory statutory liability, for example for personal injury or under product liability law, remains unaffected.',
      },
      {
        h: '9. Rights',
        b: 'The app, its texts and its design belong to the provider or the respective rights holders. You receive a simple, non-transferable right to use Dialy for private purposes. The licences of the sources apply to the nutritional data (see privacy policy, section “Sources”).',
      },
      {
        h: '10. Termination and deletion',
        b: 'You can stop using Dialy at any time and remove your data in the settings under “Delete data”. You cancel a running Premium subscription separately in the App Store or Google Play. We may suspend or delete accounts in the event of violations of these terms.',
      },
      {
        h: '11. Changes',
        b: 'We may amend these terms of use, for example for new features or changes in the law. We will inform you about material changes in the app in good time beforehand. If you do not agree, you can stop using the app and delete your account.',
      },
      {
        h: '12. Applicable law and jurisdiction',
        b: 'Swiss law applies. The place of jurisdiction is the provider’s registered office. If you live in another country as a consumer, you retain the mandatory protective provisions and places of jurisdiction of your country of residence.',
      },
    ],
  },

  contact: {
    intro:
      'Is a food missing, is a value wrong or do you have another request? Write to us – we check every message.',
    kindNew: 'New food',
    kindFix: 'Report an error',
    kindOther: 'Other',
    foodName: 'Name of the food *',
    foodNamePlaceholder: 'e.g. wholegrain spelt roll',
    valuesLabel: 'Nutrients per 100 g (if known)',
    carbs: 'Carbs (g)',
    sugar: 'Sugar (g)',
    fat: 'Fat (g)',
    valuesInvalid: 'Please enter nutrients as a number between 0 and 100.',
    remark: 'Remark / source',
    remarkPlaceholder: 'e.g. values from the package',
    subject: 'Subject *',
    subjectPlaceholder: 'e.g. question about the diary',
    message: 'Message *',
    messagePlaceholder: 'What would you like to tell us?',
    whichFood: 'Which food is wrong? *',
    foodValues: (carbs, sugar, fat) =>
      `${carbs} g carbs · ${sugar} g sugar · ${fat} g fat per 100 g`,
    otherFoodA11y: 'Choose another food',
    correction: 'Suggested correction *',
    correctionPlaceholder: 'e.g. 48 g carbs per 100 g according to the package',
    send: 'Send',
    thanks: 'Thank you!',
    sentMessage: 'Your message has reached us. Thank you for your help!',
    notSent: 'Not sent',
    writeTo: (email) => `You can also write to us at ${email}.`,
    errorOffline:
      'No internet connection. Please try again later – your input is kept.',
    errorNotConfigured:
      'The contact form needs a connection to the Dialy server, which is not set up here.',
    errorUnavailable: 'The message could not be sent right now. Please try again later.',
  },

  auth: {
    alreadyRegisteredSignIn: 'This email is already registered. Please sign in.',
    confirmEmail: (email) =>
      `Almost done! We have sent an email to ${email}. Please confirm your address using the link in it and then sign in.`,
    linkExpired: 'The link has expired or has already been used. Please request a new one.',
    localResetUnavailable:
      'Without a server the password cannot be reset: local accounts have no confirmed email address. Create a new account if needed.',
    offline:
      'No internet connection. Signing in and signing up need internet – everything else also works offline.',
    invalidLogin: 'Email or password is incorrect.',
    alreadyRegistered: 'This email is already registered.',
    emailNotConfirmed:
      'Please confirm your email address first (link in the confirmation email) and then sign in.',
    samePassword: 'The new password must be different from the old one.',
    rateLimit: 'Too many attempts. Please wait a moment and try again.',
    weakPassword: 'The password does not meet the requirements (at least 6 characters).',
    invalidEmail: 'Please enter a valid email address.',
    generic: 'Something went wrong. Please try again.',
  },
};

export default en;
