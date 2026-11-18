import type { Dict } from '@/i18n/locales/de';

/** Spanish UI copy. Same shape as de.ts. */
const es: Dict = {
  common: {
    cancel: 'Cancelar',
    save: 'Guardar',
    ok: 'OK',
    close: 'Cerrar',
    back: 'Atrás',
    retry: 'Reintentar',
    delete: 'Eliminar',
    next: 'Continuar',
    later: 'Más tarde',
    or: 'o',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'nombre@ejemplo.ch',
    passwordLabel: 'Contraseña',
    confirmPasswordLabel: 'Confirmar contraseña',
    minChars: (n) => `al menos ${n} caracteres`,
    privacyPolicy: 'Política de privacidad',
    termsOfUse: 'Condiciones de uso',
    appearance: 'Apariencia',
    language: 'Idioma',
    diabetesType: 'Tipo de diabetes',
    requiredHint: '* Campo obligatorio',
    notAvailable: 'n. d.',
  },

  units: {
    carbs: 'HC',
    minutes: 'min',
    hoursShort: 'h',
  },

  date: {
    months: [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ],
    weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    weekdaysShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    long: (day, month, year) => `${day} de ${month} de ${year}`,
    withWeekday: (weekday, day, month, year) => `${weekday}, ${day} de ${month} de ${year}`,
    datePlaceholder: 'DD.MM.AAAA',
    timePlaceholder: 'HH:MM',
  },

  nav: {
    ratgeber: 'Consejos',
    khrechner: 'Calculadora de HC',
    tagebuch: 'Diario',
    blutzucker: 'Glucemia',
    sport: 'Deporte',
    login: 'Iniciar sesión',
    settings: 'Cuenta',
    contact: 'Contacto',
    glucoseImport: 'Datos de glucemia',
    premium: 'Premium',
    privacy: 'Privacidad',
    terms: 'Condiciones de uso',
    article: 'Artículo',
    register: 'Registrarse',
    forgotPassword: 'Contraseña olvidada',
    brandA11y: 'Dialy – ir a los consejos',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    toLight: 'Cambiar al modo claro',
    toDark: 'Cambiar al modo oscuro',
    groupDiabetes: 'Diabetes',
    groupSettings: 'Ajustes',
    groupInfo: 'Información',
  },

  theme: {
    dark: 'Oscuro',
    light: 'Claro',
    system: 'Sistema',
  },

  diabetesType: {
    t1: 'Tipo 1',
    t2: 'Tipo 2',
  },

  gate: {
    saveMeal: 'Para guardar una comida en el diario necesitas una cuenta con suscripción.',
    saveSport: 'Para guardar deporte en el diario necesitas una cuenta con suscripción.',
    diaryNeedsAccount:
      'El diario requiere una cuenta con suscripción. Así tus entradas quedan seguras y disponibles en todos tus dispositivos.',
    diaryNeedsPremium:
      'El diario forma parte de Dialy Premium. Con la suscripción registras tus comidas y tu deporte y ves tu historial.',
    loginCta: 'Iniciar sesión',
    premiumCta: 'Ver Premium',
  },

  khrechner: {
    title: 'Calculadora de HC',
    totalA11y: (carbs) => `Subtotal ${carbs}, mostrar alimentos`,
    saveMealA11y: 'Guardar la comida en el diario',
    clearA11y: 'Poner el subtotal a cero',
    searchPlaceholder: 'Buscar alimento…',
    all: 'Todos',
    category: 'Categoría',
    noResults: 'Sin resultados',
    noFoodsYet:
      'Los alimentos se descargan de Internet al iniciar la app por primera vez. Conéctate a Internet; después, la calculadora de HC también funciona sin conexión.',
    resultCount: (n) => (n === 1 ? '1 alimento' : `${n} alimentos`),
    showMore: (n, of) => `Mostrar ${n} más de ${of}`,
    closeFoodA11y: 'Cerrar alimento',
    clearSearchA11y: 'Borrar búsqueda',
    portionSize: 'Tamaño de la porción',
    grams: 'gramos',
    nutrients: 'Valores nutricionales',
    carbs: 'Hidratos de carbono',
    sugar: 'Azúcares',
    gi: 'Índice glucémico',
    fat: 'Grasas',
    thisPortion: (carbs) => `Esta porción: ${carbs}`,
    addToMeal: 'Añadir a la comida',
    mealTitle: 'Comida',
    total: 'Total',
    subscriptionRequired: 'Se requiere suscripción',
    saved: 'Guardado',
    savedMessage: (n) =>
      n === 1
        ? 'Se ha añadido 1 alimento al diario.'
        : `Se han añadido ${n} alimentos al diario.`,
    toDiary: 'Ir al diario',
    saveFailed: 'No se pudo guardar',
    saveFailedMessage:
      'No se pudieron guardar todos los alimentos. Los demás siguen en la comida; inténtalo de nuevo.',
    source: (text) => `Fuente: ${text}`,
    sourceManufacturer: 'datos del fabricante (octubre de 2026)',
  },

  foodCategories: {
    'Brote, Flocken und Frühstückscerealien': 'Pan y cereales',
    'Getreideprodukte, Hülsenfrüchte und Kartoffeln': 'Féculas y patatas',
    Früchte: 'Frutas',
    Gemüse: 'Verduras',
    'Milch und Milchprodukte': 'Lácteos',
    Süssigkeiten: 'Dulces',
    Gerichte: 'Platos',
    'Alkoholfreie Getränke': 'Bebidas',
    'Salzige Snacks': 'Aperitivos',
    'Nüsse, Samen und Ölfrüchte': 'Frutos secos y semillas',
    'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten':
      'Alternativas vegetales',
    'Fleisch und Innereien': 'Carne',
    'Fleisch- und Wurstwaren': 'Embutidos',
    Fisch: 'Pescado',
    Eier: 'Huevos',
    'Fette und Öle': 'Grasas y aceites',
    'Alkoholhaltige Getränke': 'Alcohol',
    Speziallebensmittel: 'Alimentos especiales',
    Verschiedenes: 'Varios',
  },

  portions: {
    usual: (amount) => `Porción habitual (${amount})`,
    package: (amount) => `Porción según el envase (${amount})`,
    labels: {
      '½ Scheibe': '½ rebanada',
      '1 Scheibe': '1 rebanada',
      '2 Scheiben': '2 rebanadas',
      '1 Brötchen': '1 panecillo',
      '3 EL': '3 cucharadas',
      '1 Portion': '1 porción',
      '½ Portion': '½ porción',
      'grosse Portion': 'porción grande',
      'kleine Portion': 'porción pequeña',
      'kleine Schale': 'cuenco pequeño',
      '1 Schale': '1 cuenco',
      '1 kleine': '1 pequeña',
      '½ Apfel': '½ manzana',
      '1 Apfel': '1 manzana',
      '½ Banane': '½ plátano',
      '1 Banane': '1 plátano',
      Handvoll: 'puñado',
      '1 Orange': '1 naranja',
      '½ Becher': '½ vasito',
      '1 Becher': '1 vasito',
      '1 Glas': '1 vaso',
      '1 Tasse': '1 taza',
      '1 Stück': '1 unidad',
      '1 Stück, klein': '1 unidad, pequeña',
      '1 Stück, mittel': '1 unidad, mediana',
      '1 Stück, gross': '1 unidad, grande',
      '2 Stücke': '2 unidades',
      '1 Ei': '1 huevo',
      '2 Eier': '2 huevos',
      '1 Gipfeli': '1 cruasán',
      '1 Reihe': '1 fila',
      '½ Tafel': '½ tableta',
      '1 Dose': '1 lata',
      '1 Plättchen': '1 pastilla',
      '3 Plättchen': '3 pastillas',
      '1 Glas (2 dl)': '1 vaso (2 dl)',
      '1 Dose (250 ml)': '1 lata (250 ml)',
      '1 Dose (330 ml)': '1 lata (330 ml)',
      '1 Dose (355 ml)': '1 lata (355 ml)',
      '1 Flasche (5 dl)': '1 botella (5 dl)',
    },
  },

  tagebuch: {
    title: 'Diario',
    done: 'Listo',
    select: 'Seleccionar',
    multiSelect: 'Selección múltiple',
    prevHour: 'Una hora antes',
    nextHour: 'Una hora después',
    prevDay: 'Día anterior',
    nextDay: 'Día siguiente',
    viewList: 'Lista',
    viewCalendar: 'Calendario',
    noEntriesDay: 'No hay entradas este día.',
    prevMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    locked: 'Diario bloqueado',
    tapToMark: 'Toca las entradas para seleccionarlas.',
    selectedCount: (n) =>
      n === 1 ? '1 entrada seleccionada' : `${n} entradas seleccionadas`,
    changeDateTime: 'Cambiar fecha y hora',
    empty:
      'Todavía no hay entradas. Añade algo en la calculadora de HC o en el planificador de deporte.',
    carbTotal: 'Total de HC',
    sameDateTime: (n) => `${n} entradas recibirán la misma fecha y hora.`,
    markHint: 'Seleccionar',
    editHint: 'Editar entrada',
    bgCurveSaved: 'Curva de glucemia guardada',
    invalidDateTime: 'Introduce la fecha como DD.MM.AAAA y la hora como HH:MM.',
    editDateTimeTitle: 'Cambiar fecha y hora',
    editEntryTitle: 'Editar entrada',
    date: 'Fecha',
    time: 'Hora',
    today: 'Hoy',
    yesterday: 'Ayer',
    comment: 'Comentario',
    commentPlaceholder: 'p. ej. antes del deporte, hipo después …',
    deleteEntryTitle: 'Eliminar entrada',
    deleteEntryConfirm: (name: string) => `¿Eliminar «${name}» del diario?`,
    deleteEntryA11y: (name: string) => `Eliminar ${name}`,
    editEntryA11y: (name: string) => `Editar ${name}`,
    deleteEntriesConfirm: (n: number) => `¿Eliminar ${n} entradas del diario?`,
  },

  blutzucker: {
    title: 'Mi glucemia',
    prevDay: 'Día anterior',
    nextDay: 'Día siguiente',
    backToToday: 'Volver a hoy',
    average: 'Media',
    timeInRange: 'Tiempo en rango (3.9 a 10.0)',
    lowest: 'Valor más bajo',
    highest: 'Valor más alto',
    atTime: (time: string) => `a las ${time}`,
    delayHint:
      'Pueden faltar las últimas horas: según el proveedor, los datos del MCG solo están disponibles con unas horas de retraso.',
    chartTitle: 'Curva de glucemia',
    legendGlucose: (unit: string) => `Glucosa (${unit})`,
    legendTarget: 'Rango objetivo',
    noReadingsDay: 'No hay valores de glucemia para este día.',
    mealsTitle: 'Comidas',
    totalCarbs: (g: number) => `Total ${g} g de HC`,
    noMeals: 'No hay comidas registradas este día.',
    peakTooltip: (value: string, time: string) => `Pico ${value} a las ${time}`,
    footnote: (unit: string) =>
      `Pico y subida en ${unit}, medidos en las 2.5 horas siguientes a la comida. Los valores por encima de 10.0 aparecen resaltados.`,
    disclaimer:
      'Solo con fines informativos. Dialy no da recomendaciones de tratamiento (p. ej. dosis de insulina) y no sustituye a un medidor.',
    manageData: 'Gestionar datos de glucemia',
    emptyTitle: 'Aún no hay datos de glucemia',
    emptyText:
      'Conecta una fuente de MCG o importa una exportación de LibreView para ver tu curva junto a tus comidas.',
    importCta: 'Importar datos',
    locked: 'Glucemia bloqueada',
  },

  glucose: {
    needAccount: 'Inicia sesión para importar datos de glucemia.',
    intro:
      'Importa tus valores de glucosa desde un sensor MCG y velos junto a tus comidas. Los valores se guardan en mg/dL y se muestran en la unidad elegida.',
    unit: 'Unidad',
    consentTitle: 'Consentimiento',
    consent:
      'Acepto que Dialy importe y almacene mis valores de glucosa (datos de salud sensibles).',
    sources: 'Fuentes',
    dexcomSoon: 'Conexión directa a través de tu cuenta de Dexcom (OAuth). Próximamente.',
    comingSoon: 'Próximamente',
    healthHelp: (platform: string) =>
      `Dexcom y Libre escriben sus valores en ${platform}. Dialy pide permiso de lectura y los importa, sin contraseña.`,
    healthConnect: 'Conectar e importar',
    healthUnavailable: 'Solo disponible en la app Dialy instalada (no en la vista previa/navegador).',
    healthDenied: 'No se concedió el permiso de lectura. Puedes concederlo en los ajustes del sistema, en Salud/Health Connect.',
    libreHelp: 'Exporta tus datos en LibreView (datos de glucosa como CSV) y pega el contenido aquí.',
    csvPlaceholder: 'Pega aquí el CSV de LibreView …',
    importCsv: 'Importar CSV',
    demoTitle: 'Datos de demostración',
    demoHelp: 'Genera una curva diaria de ejemplo para hoy, basada en tus comidas de hoy.',
    demoCta: 'Generar datos de demostración para hoy',
    stored: 'Datos guardados',
    storedCount: (n: number) => `${n} valores de glucemia guardados.`,
    disconnectDelete: 'Desconectar y eliminar todos los datos de glucemia',
    disclaimer:
      'Dialy muestra los valores con fines informativos y no da recomendaciones de tratamiento. Tus valores se transmiten y almacenan cifrados.',
    csvError: (key: string) => {
      switch (key) {
        case 'empty':
          return 'El archivo está vacío.';
        case 'noHeader':
          return 'No se encontró ninguna fila de encabezado con marca de tiempo. ¿Es una exportación de LibreView?';
        case 'noGlucoseColumn':
          return 'No se encontró ninguna columna de glucosa (mg/dL o mmol/L).';
        case 'noReadings':
          return 'No se encontraron mediciones válidas.';
        default:
          return 'No se pudo leer el archivo.';
      }
    },
    importedTitle: 'Importación completada',
    importedMessage: (inserted: number, duplicates: number) =>
      `${inserted} valores nuevos importados${duplicates > 0 ? `, ${duplicates} duplicados omitidos` : ''}.`,
    importFailed: 'Error en la importación',
    deleteTitle: 'Eliminar datos de glucemia',
    deleteConfirm: '¿Eliminar definitivamente todos los valores de glucemia importados?',
    deletedTitle: 'Eliminado',
    deletedMessage: (n: number) => `Se han eliminado ${n} valores de glucemia.`,
  },

  activities: {
    wandern: 'Senderismo',
    laufen: 'Correr',
    rad: 'Ciclismo',
    schwimmen: 'Natación',
    kraft: 'Fuerza',
  },

  sport: {
    title: 'Registrar deporte',
    activity: 'Actividad',
    duration: 'Duración (minutos)',
    bgBefore: 'Glucemia antes del deporte',
    curve: 'Tendencia típica (ejemplo general)',
    disclaimer:
      'Ilustración general, no calculada para ti: solo muestra en qué dirección suele moverse la glucemia con esta actividad. No es una previsión ni una recomendación: Dialy no calcula dosis de insulina ni cantidades de HC.',
    carbsBefore: 'HC antes del deporte (nota)',
    carbsAfter: 'HC después del deporte (nota)',
    beforePrefix: 'Antes del deporte',
    afterPrefix: 'Después',
    afterHint:
      'Después del deporte, la sensibilidad a la insulina sigue aumentada mientras se reponen las reservas de glucógeno.',
    pump: 'Ajuste de la bomba (nota)',
    reduction: 'Reducción',
    for: 'durante',
    pumpHint:
      'Solo una nota sobre el ajuste de tu propia bomba. Dialy no da recomendaciones ni calcula nada.',
    saved: 'Guardado en el diario',
    save: 'Guardar deporte',
  },

  chart: {
    timeAxis: 'Tiempo en minutos',
    noScale: 'Sin escala – línea discontinua: nivel inicial',
  },

  ratgeber: {
    title: 'Consejos',
    empty: 'Todavía no hay artículos.',
    notFound: 'Artículo no encontrado.',
    germanOnly: 'Por ahora, los artículos solo están disponibles en alemán.',
    errorOffline: 'Los consejos solo están disponibles con conexión a Internet.',
    errorNotConfigured:
      'Los consejos necesitan una conexión con el servidor de Dialy, que aquí no está configurado.',
    errorUnavailable: 'No se pudieron cargar los artículos en este momento.',
    categories: {
      Sport: 'Deporte',
      Nacht: 'Noche',
      Insulin: 'Insulina',
      Technologie: 'Tecnología',
      Ernährung: 'Alimentación',
      Medikamente: 'Medicamentos',
      Alltag: 'Día a día',
      Sicherheit: 'Seguridad',
    },
  },

  login: {
    welcome: 'Bienvenido/a',
    forgot: '¿Has olvidado la contraseña?',
    signIn: 'Iniciar sesión',
    createAccount: 'Crear cuenta',
  },

  register: {
    title: 'Crear cuenta',
    subtitle: 'Gratis. El diario requiere además Dialy Premium.',
    mismatch: 'Las contraseñas no coinciden.',
    consentMissing: 'Acepta las condiciones de uso y el tratamiento de tus datos de salud.',
    consent:
      'Acepto las condiciones de uso y que mis entradas (incluidos datos de salud como los valores de glucemia) se traten conforme a la política de privacidad para ofrecer el diario. No se usan con fines publicitarios ni de análisis.',
    submit: 'Registrarse',
  },

  forgot: {
    title: 'Contraseña olvidada',
    unavailable:
      'Sin servidor no se puede restablecer la contraseña: las cuentas locales no tienen un correo electrónico confirmado. Si es necesario, crea una cuenta nueva.',
    sent:
      'Si existe una cuenta con este correo electrónico, te hemos enviado un enlace. Ábrelo en este dispositivo para establecer una contraseña nueva.',
    intro:
      'Introduce el correo electrónico de tu cuenta. Te enviaremos un enlace para establecer una contraseña nueva.',
    send: 'Enviar enlace',
  },

  newPassword: {
    invalidLink: 'Enlace no válido',
    title: 'Nueva contraseña',
    tooShort: (n) => `La contraseña debe tener al menos ${n} caracteres.`,
    changed: 'Tu contraseña se ha cambiado y has iniciado sesión.',
    intro: 'Establece una contraseña nueva para tu cuenta.',
    label: 'Nueva contraseña',
    save: 'Guardar contraseña',
  },

  account: {
    signedIn: 'Sesión iniciada',
    premium: 'Premium',
    freeAccount: 'Cuenta gratuita',
    premiumTitle: 'Dialy Premium (CHF 3.00 / mes)',
    premiumSub: 'Diario completo e historial de glucemia.',
    viewPremium: 'Ver Premium',
    devHint: 'Dev: mantén pulsada esta tarjeta para activar/desactivar Premium en pruebas.',
    legal: 'Aviso legal y privacidad',
    glucoseData: 'Glucemia y MCG',
    deleteData: 'Eliminar datos',
    deleteConfirm:
      '¿Seguro que quieres eliminar definitivamente todas tus entradas (comidas, deporte, glucemia)?',
    partlyDeleted: 'Eliminado parcialmente',
    deleted: 'Eliminado',
    partlyDeletedMessage:
      'Se han eliminado los datos locales. La eliminación en el servidor se hará en la próxima sincronización.',
    deletedMessage: 'Se han eliminado todas tus entradas.',
    deleteAccount: 'Eliminar cuenta',
    deleteAccountConfirm:
      '¿Seguro que quieres eliminar definitivamente tu cuenta y todos tus datos? Una suscripción Premium activa se cancela por separado en el App Store o en Google Play.',
    deleteAccountFailed: 'Cuenta no eliminada',
    accountDeleted: 'Cuenta eliminada',
    accountDeletedMessage: 'Se han eliminado tu cuenta y todos tus datos.',
    sync: 'Sincronización',
    signOut: 'Cerrar sesión',
    syncLocalOnly:
      'Modo sin conexión: no hay ningún servidor configurado. Todos los datos se quedan en el dispositivo.',
    syncing: 'Sincronizando …',
    offlinePending: (n) =>
      n === 1
        ? 'Sin conexión: 1 cambio está pendiente y se enviará automáticamente.'
        : `Sin conexión: ${n} cambios están pendientes y se enviarán automáticamente.`,
    offlineSaved: 'Sin conexión: tus entradas están guardadas en el dispositivo.',
    syncFailed: 'Error de sincronización; se reintentará automáticamente.',
    pending: (n) =>
      n === 1
        ? '1 cambio pendiente de sincronizar.'
        : `${n} cambios pendientes de sincronizar.`,
    allSynced: (since) => `Todo sincronizado · ${since}`,
    notSynced: 'Aún no sincronizado.',
    justNow: 'ahora mismo',
    minutesAgo: (n) => `hace ${n} min`,
    today: 'hoy',
  },

  paywall: {
    price: 'CHF 3.00 / mes',
    features: [
      'Diario completo con historial',
      'Historial y resumen de glucemia',
      'Sincronización entre dispositivos',
    ],
    renewal:
      'La suscripción se renueva automáticamente cada mes y puede cancelarse en cualquier momento hasta 24 horas antes de su vencimiento en los ajustes de tu cuenta del App Store o de Google Play.',
    mockNote:
      'Nota: en esta versión, el pago es solo una vista previa. No hay configurado ningún sistema de pago real.',
    active: 'Premium está activo',
    unlock: 'Activar Premium (demo)',
  },

  privacy: {
    title: 'Política de privacidad',
    sections: [
      {
        h: 'Resumen',
        b: 'Dialy es un acompañante para el día a día con diabetes. La app registra los valores que introduces tú, suma los hidratos de carbono y muestra para el deporte una ilustración general, no personalizada. Dialy no es un producto sanitario, no calcula dosis de insulina y no da recomendaciones de tratamiento ni de dosificación.',
      },
      {
        h: 'Qué datos tratamos',
        b: 'Las comidas, actividades deportivas y valores de glucemia que introduces. Estos datos de salud se consideran especialmente sensibles (art. 9 RGPD / art. 5 nLPD). Se utilizan exclusivamente para ofrecer el diario.',
      },
      {
        h: 'Sin uso publicitario ni analítico',
        b: 'Tus datos de salud no se utilizan con fines publicitarios, de marketing ni de minería de datos, y no se venden a terceros.',
      },
      {
        h: 'Almacenamiento',
        b: 'Tus datos se guardan localmente en tu dispositivo. Con una cuenta, se sincronizan cifrados con nuestro servidor para que estén disponibles en varios dispositivos. El acceso está limitado a tu cuenta mediante seguridad a nivel de fila (row-level security).',
      },
      {
        h: 'Formulario de contacto',
        b: 'Los mensajes del formulario de contacto (proponer un alimento o informar de un error) se guardan en nuestro servidor para mejorar los datos de los alimentos. Si has iniciado sesión, el mensaje se vincula a tu cuenta para que podamos responderte si tenemos preguntas.',
      },
      {
        h: 'Tus derechos',
        b: 'Puedes eliminar por completo tus datos en cualquier momento en los ajustes de la cuenta, en «Eliminar datos». La eliminación también se transmite al servidor.',
      },
      {
        h: 'Fuentes',
        b: 'Valores nutricionales de la mayoría de los alimentos de la calculadora de HC: Base de datos suiza de valores nutricionales, Oficina Federal de Seguridad Alimentaria y Veterinaria (OSAV), naehrwertdaten.ch. Tamaños de porción habituales: OSAV, encuesta nacional de nutrición menuCH 2014-15. Peso por unidad de frutas, verduras y huevos: U.S. Department of Agriculture, FoodData Central (fdc.nal.usda.gov), dominio público. Otros alimentos y platos: Max Rubner-Institut (2025), Bundeslebensmittelschlüssel (BLS) versión 4.0, licencia CC BY 4.0. Bebidas de marca (p. ej. Rivella, Coca-Cola): datos de los fabricantes para Suiza, octubre de 2026. Productos de marca: Open Food Facts (openfoodfacts.org), Open Database License (ODbL), introducidos por voluntarios; prevalecen los datos del envase.',
      },
      {
        h: 'Contacto',
        b: 'Para preguntas sobre protección de datos, escríbenos a datenschutz@dialy.example. (provisional)',
      },
    ],
  },

  terms: {
    title: 'Condiciones de uso',
    version: 'Versión del 12 de octubre de 2026',
    sections: [
      {
        h: '1. Proveedor',
        b: 'Dialy es ofrecida por [nombre / empresa], [calle n.º], [CP localidad], Suiza, correo electrónico: [kontakt@dialy.example]. (Marcador de posición: completar antes de la publicación).',
      },
      {
        h: '2. Ámbito de aplicación',
        b: 'Estas condiciones de uso se aplican al uso de la app Dialy. Al crear una cuenta o contratar Premium, las aceptas. Sin cuenta, se aplican por analogía a las funciones de libre acceso. Además, se aplica nuestra política de privacidad.',
      },
      {
        h: '3. Qué es Dialy y qué no es',
        b: 'Dialy es un acompañante para el día a día de las personas con diabetes: la app muestra los valores nutricionales de los alimentos, suma los hidratos de carbono de una comida, lleva un diario de los valores que introduces tú y ofrece artículos de información general.\n\nDialy no es un producto sanitario en el sentido de la Ordenanza suiza sobre productos sanitarios (OPSan) ni del Reglamento (UE) 2017/745. Dialy no hace diagnósticos, no da recomendaciones de terapia ni de tratamiento, no calcula dosis de insulina, correcciones, cantidades de hidratos de carbono a ingerir ni ajustes de la bomba, no predice tu glucemia y no avisa de hipoglucemias ni de hiperglucemias. La curva de la página de deporte es una ilustración general y no está calculada para ti. Los campos sobre hidratos de carbono o la bomba son solo notas sobre lo que has decidido tú.\n\nToma siempre las decisiones sobre tu terapia tú mismo/a o con tu equipo de diabetes. Dialy no sustituye el consejo médico ni las mediciones de glucemia. En caso de emergencia, llama al 144 (en Suiza) o al número de emergencias local.',
      },
      {
        h: '4. Valores nutricionales',
        b: 'Los valores nutricionales proceden de bases de datos públicas (en particular, la Base de datos suiza de valores nutricionales de la OSAV, el Bundeslebensmittelschlüssel y Open Food Facts) y de los fabricantes. Son valores medios u orientativos, pueden estar incompletos, desactualizados o ser erróneos y variar según el producto, la receta y la preparación. Las porciones son estimaciones. Prevalecen siempre los datos del envase. No garantizamos su exactitud.',
      },
      {
        h: '5. Cuenta',
        b: 'Para el diario necesitas una cuenta. Debes tener al menos 16 años. Las personas más jóvenes solo pueden usar Dialy con el consentimiento de sus padres o representantes legales. Una cuenta es personal. Mantén tu contraseña en secreto e infórmanos si sospechas de un uso indebido.',
      },
      {
        h: '6. Uso gratuito y Premium',
        b: 'La calculadora de HC, los consejos y la página de deporte son gratuitos. Premium cuesta CHF 3.00 al mes (precio con IVA incluido, sujeto a cambios) y desbloquea las funciones adicionales descritas en la app.\n\nPremium se contrata y factura como suscripción a través del App Store de Apple o de Google Play; además, se aplican sus condiciones. La suscripción se renueva automáticamente cada mes si no la cancelas a más tardar 24 horas antes de su vencimiento en los ajustes de tu cuenta de la tienda. La cancelación surte efecto al final del periodo en curso. Los reembolsos se rigen por las normas de Apple o Google. Anunciamos los cambios de precio con antelación; solo se aplican a partir del periodo siguiente y solo si no cancelas.',
      },
      {
        h: '7. Disponibilidad',
        b: 'Nos esforzamos por ofrecer un funcionamiento fiable, pero no podemos garantizar una disponibilidad ininterrumpida. Las funciones pueden modificarse, ampliarse o suprimirse. Tus entradas se guardan en el dispositivo y, con una cuenta, en nuestro servidor; guarda además los valores importantes donde los necesite tu equipo de diabetes.',
      },
      {
        h: '8. Responsabilidad',
        b: 'Usas Dialy bajo tu propia responsabilidad. No respondemos de las decisiones sobre alimentación, insulina o terapia que tomes basándote en la app, ni de valores nutricionales inexactos o pérdidas de datos. En la medida permitida por la ley, nuestra responsabilidad se limita al dolo y la negligencia grave. Queda reservada la responsabilidad legal imperativa, por ejemplo por daños personales o según la ley de responsabilidad por productos defectuosos.',
      },
      {
        h: '9. Derechos',
        b: 'La app, sus textos y su diseño pertenecen al proveedor o a los respectivos titulares de derechos. Obtienes un derecho simple e intransferible a usar Dialy con fines privados. A los datos nutricionales se aplican las licencias de las fuentes (véase la política de privacidad, apartado «Fuentes»).',
      },
      {
        h: '10. Rescisión y eliminación',
        b: 'Puedes dejar de usar Dialy en cualquier momento y eliminar tus datos en los ajustes, en «Eliminar datos». Una suscripción Premium activa se cancela por separado en el App Store o en Google Play. Podemos bloquear o eliminar cuentas en caso de infracción de estas condiciones.',
      },
      {
        h: '11. Modificaciones',
        b: 'Podemos adaptar estas condiciones de uso, por ejemplo por nuevas funciones o cambios legales. Te informamos con antelación en la app de los cambios importantes. Si no estás de acuerdo, puedes dejar de usar la app y eliminar tu cuenta.',
      },
      {
        h: '12. Derecho aplicable y jurisdicción',
        b: 'Se aplica el derecho suizo. La jurisdicción corresponde a la sede del proveedor. Si vives en otro país como consumidor/a, conservas las disposiciones de protección imperativas y la jurisdicción de tu país de residencia.',
      },
    ],
  },

  contact: {
    intro:
      '¿Falta un alimento, hay un valor incorrecto o tienes otra consulta? Escríbenos: revisamos cada mensaje.',
    kindNew: 'Nuevo alimento',
    kindOther: 'Otro',
    fixHint:
      '¿Un valor es incorrecto o falta una porción? Infórmalo directamente en el alimento, en la calculadora de HC.',
    foodName: 'Nombre del alimento *',
    foodNamePlaceholder: 'p. ej. panecillo integral de espelta',
    valuesLabel: 'Valores nutricionales por 100 g (si los conoces)',
    carbs: 'Hidratos de carbono (g)',
    sugar: 'Azúcares (g)',
    fat: 'Grasas (g)',
    valuesInvalid: 'Indica los valores nutricionales como un número entre 0 y 100.',
    remark: 'Observación / fuente',
    remarkPlaceholder: 'p. ej. valores del envase',
    subject: 'Asunto *',
    subjectPlaceholder: 'p. ej. pregunta sobre el diario',
    message: 'Mensaje *',
    messagePlaceholder: '¿Qué quieres decirnos?',
    send: 'Enviar',
    thanks: '¡Gracias!',
    sentMessage: 'Hemos recibido tu mensaje. ¡Gracias por tu ayuda!',
    notSent: 'No enviado',
    writeTo: (email) => `También puedes escribirnos a ${email}.`,
    errorOffline:
      'Sin conexión a Internet. Inténtalo de nuevo más tarde; lo que has escrito se conserva.',
    errorNotConfigured:
      'El formulario de contacto necesita una conexión con el servidor de Dialy, que aquí no está configurado.',
    errorUnavailable:
      'No se pudo enviar el mensaje en este momento. Inténtalo de nuevo más tarde.',
  },

  /** Report an error / suggest a portion right on a food in the KH-Rechner. */
  feedback: {
    reportError: 'Informar de un error',
    suggestPortion: 'Proponer una porción',
    reportLabel: '¿Qué está mal? *',
    reportPlaceholder: 'p. ej. 48 g de HC por 100 g según el envase',
    portionLabel: 'Descripción *',
    portionLabelPlaceholder: 'p. ej. 1 unidad, 1 rebanada, 1 vasito',
    portionGrams: 'Gramos *',
    portionGramsInvalid: 'Indica los gramos como un número entre 1 y 2000.',
    remark: 'Observación',
    remarkPlaceholder: 'p. ej. según el envase',
    sent: '¡Gracias! Hemos recibido tu aviso.',
  },

  auth: {
    alreadyRegisteredSignIn: 'Este correo electrónico ya está registrado. Inicia sesión.',
    confirmEmail: (email) =>
      `¡Casi listo! Te hemos enviado un correo a ${email}. Confirma tu dirección con el enlace que contiene y después inicia sesión.`,
    linkExpired: 'El enlace ha caducado o ya se ha utilizado. Solicita uno nuevo.',
    localResetUnavailable:
      'Sin servidor no se puede restablecer la contraseña: las cuentas locales no tienen un correo electrónico confirmado. Si es necesario, crea una cuenta nueva.',
    offline:
      'Sin conexión a Internet. Para iniciar sesión y registrarse se necesita Internet; todo lo demás también funciona sin conexión.',
    invalidLogin: 'El correo electrónico o la contraseña no son correctos.',
    alreadyRegistered: 'Este correo electrónico ya está registrado.',
    emailNotConfirmed:
      'Confirma primero tu correo electrónico (enlace en el correo de confirmación) y después inicia sesión.',
    samePassword: 'La nueva contraseña debe ser distinta de la anterior.',
    rateLimit: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
    weakPassword: 'La contraseña no cumple los requisitos (al menos 6 caracteres).',
    invalidEmail: 'Introduce un correo electrónico válido.',
    generic: 'Se ha producido un error. Inténtalo de nuevo.',
  },
};

export default es;
