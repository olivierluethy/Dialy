import type { Dict } from '@/i18n/locales/de';

/** Portuguese (European) UI copy. Same shape as de.ts. */
const pt: Dict = {
  common: {
    cancel: 'Cancelar',
    save: 'Guardar',
    ok: 'OK',
    close: 'Fechar',
    back: 'Voltar',
    retry: 'Tentar novamente',
    delete: 'Eliminar',
    next: 'Continuar',
    later: 'Mais tarde',
    or: 'ou',
    emailLabel: 'E-mail',
    emailPlaceholder: 'nome@exemplo.ch',
    passwordLabel: 'Palavra-passe',
    confirmPasswordLabel: 'Confirmar palavra-passe',
    minChars: (n) => `pelo menos ${n} caracteres`,
    privacyPolicy: 'Política de privacidade',
    termsOfUse: 'Termos de utilização',
    appearance: 'Aspeto',
    language: 'Idioma',
    diabetesType: 'Tipo de diabetes',
    requiredHint: '* Campo obrigatório',
    notAvailable: 'n. d.',
  },

  units: {
    carbs: 'HC',
    minutes: 'min',
    hoursShort: 'h',
  },

  date: {
    months: [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
    ],
    weekdays: [
      'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
      'quinta-feira', 'sexta-feira', 'sábado',
    ],
    weekdaysShort: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sá'],
    long: (day, month, year) => `${day} de ${month} de ${year}`,
    withWeekday: (weekday, day, month, year) => `${weekday}, ${day} de ${month} de ${year}`,
    datePlaceholder: 'DD.MM.AAAA',
    timePlaceholder: 'HH:MM',
  },

  nav: {
    ratgeber: 'Conselhos',
    khrechner: 'Calculadora de HC',
    tagebuch: 'Diário',
    blutzucker: 'Glicemia',
    sport: 'Desporto',
    login: 'Iniciar sessão',
    settings: 'Conta',
    contact: 'Contacto',
    glucoseImport: 'Dados de glicemia',
    premium: 'Premium',
    privacy: 'Privacidade',
    terms: 'Termos de utilização',
    article: 'Artigo',
    register: 'Registar',
    forgotPassword: 'Palavra-passe esquecida',
    brandA11y: 'Dialy – ir para os conselhos',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    toLight: 'Mudar para o modo claro',
    toDark: 'Mudar para o modo escuro',
    groupDiabetes: 'Diabetes',
    groupSettings: 'Definições',
    groupInfo: 'Informações',
  },

  theme: {
    dark: 'Escuro',
    light: 'Claro',
    system: 'Sistema',
  },

  diabetesType: {
    t1: 'Tipo 1',
    t2: 'Tipo 2',
  },

  gate: {
    saveMeal: 'Para guardar uma refeição no diário precisas de uma conta com subscrição.',
    saveSport: 'Para guardar desporto no diário precisas de uma conta com subscrição.',
    diaryNeedsAccount:
      'O diário requer uma conta com subscrição. Assim, os teus registos ficam seguros e disponíveis em todos os teus dispositivos.',
    diaryNeedsPremium:
      'O diário faz parte do Dialy Premium. Com a subscrição registas as tuas refeições e o teu desporto e vês o teu histórico.',
    loginCta: 'Iniciar sessão',
    premiumCta: 'Ver Premium',
  },

  khrechner: {
    title: 'Calculadora de HC',
    totalA11y: (carbs) => `Subtotal ${carbs}, mostrar alimentos`,
    saveMealA11y: 'Guardar a refeição no diário',
    clearA11y: 'Repor o subtotal a zero',
    searchPlaceholder: 'Pesquisar alimento…',
    all: 'Todos',
    category: 'Categoria',
    noResults: 'Sem resultados',
    noFoodsYet:
      'Os alimentos são descarregados da Internet no primeiro arranque. Liga-te à Internet; depois, a calculadora de HC também funciona offline.',
    resultCount: (n) => (n === 1 ? '1 alimento' : `${n} alimentos`),
    showMore: (n, of) => `Mostrar mais ${n} de ${of}`,
    closeFoodA11y: 'Fechar alimento',
    clearSearchA11y: 'Limpar pesquisa',
    portionSize: 'Tamanho da porção',
    grams: 'gramas',
    nutrients: 'Valores nutricionais',
    carbs: 'Hidratos de carbono',
    sugar: 'Açúcares',
    gi: 'Índice glicémico',
    fat: 'Lípidos',
    thisPortion: (carbs) => `Esta porção: ${carbs}`,
    addToMeal: 'Adicionar à refeição',
    mealTitle: 'Refeição',
    total: 'Total',
    subscriptionRequired: 'Subscrição necessária',
    saved: 'Guardado',
    savedMessage: (n) =>
      n === 1
        ? 'Foi adicionado 1 alimento ao diário.'
        : `Foram adicionados ${n} alimentos ao diário.`,
    toDiary: 'Ir para o diário',
    saveFailed: 'Não foi possível guardar',
    saveFailedMessage:
      'Não foi possível guardar todos os alimentos. Os restantes continuam na refeição; tenta novamente.',
    source: (text) => `Fonte: ${text}`,
    sourceManufacturer: 'dados do fabricante (outubro de 2026)',
  },

  foodCategories: {
    'Brote, Flocken und Frühstückscerealien': 'Pão e cereais',
    'Getreideprodukte, Hülsenfrüchte und Kartoffeln': 'Amiláceos e batatas',
    Früchte: 'Fruta',
    Gemüse: 'Legumes',
    'Milch und Milchprodukte': 'Lacticínios',
    Süssigkeiten: 'Doces',
    Gerichte: 'Pratos',
    'Alkoholfreie Getränke': 'Bebidas',
    'Salzige Snacks': 'Snacks',
    'Nüsse, Samen und Ölfrüchte': 'Frutos secos e sementes',
    'Pflanzliche Proteinlieferanten und Alternativen zu tierischen Produkten':
      'Alternativas vegetais',
    'Fleisch und Innereien': 'Carne',
    'Fleisch- und Wurstwaren': 'Charcutaria',
    Fisch: 'Peixe',
    Eier: 'Ovos',
    'Fette und Öle': 'Gorduras e óleos',
    'Alkoholhaltige Getränke': 'Álcool',
    Speziallebensmittel: 'Alimentos especiais',
    Verschiedenes: 'Diversos',
  },

  portions: {
    usual: (amount) => `Porção habitual (${amount})`,
    package: (amount) => `Porção segundo a embalagem (${amount})`,
    labels: {
      '½ Scheibe': '½ fatia',
      '1 Scheibe': '1 fatia',
      '2 Scheiben': '2 fatias',
      '1 Brötchen': '1 pãozinho',
      '3 EL': '3 colheres de sopa',
      '1 Portion': '1 porção',
      '½ Portion': '½ porção',
      'grosse Portion': 'porção grande',
      'kleine Portion': 'porção pequena',
      'kleine Schale': 'taça pequena',
      '1 Schale': '1 taça',
      '1 kleine': '1 pequena',
      '½ Apfel': '½ maçã',
      '1 Apfel': '1 maçã',
      '½ Banane': '½ banana',
      '1 Banane': '1 banana',
      Handvoll: 'mão-cheia',
      '1 Orange': '1 laranja',
      '½ Becher': '½ copo',
      '1 Becher': '1 copo',
      '1 Glas': '1 copo',
      '1 Tasse': '1 chávena',
      '1 Stück': '1 unidade',
      '1 Stück, klein': '1 unidade, pequena',
      '1 Stück, mittel': '1 unidade, média',
      '1 Stück, gross': '1 unidade, grande',
      '2 Stücke': '2 unidades',
      '1 Ei': '1 ovo',
      '2 Eier': '2 ovos',
      '1 Gipfeli': '1 croissant',
      '1 Reihe': '1 fila',
      '½ Tafel': '½ tablete',
      '1 Dose': '1 lata',
      '1 Plättchen': '1 pastilha',
      '3 Plättchen': '3 pastilhas',
      '1 Glas (2 dl)': '1 copo (2 dl)',
      '1 Dose (250 ml)': '1 lata (250 ml)',
      '1 Dose (330 ml)': '1 lata (330 ml)',
      '1 Dose (355 ml)': '1 lata (355 ml)',
      '1 Flasche (5 dl)': '1 garrafa (5 dl)',
    },
  },

  tagebuch: {
    title: 'Diário',
    done: 'Concluído',
    select: 'Selecionar',
    multiSelect: 'Seleção múltipla',
    prevHour: 'Uma hora antes',
    nextHour: 'Uma hora depois',
    prevDay: 'Dia anterior',
    nextDay: 'Dia seguinte',
    viewList: 'Lista',
    viewCalendar: 'Calendário',
    noEntriesDay: 'Sem registos neste dia.',
    prevMonth: 'Mês anterior',
    nextMonth: 'Mês seguinte',
    locked: 'Diário bloqueado',
    tapToMark: 'Toca nos registos para os selecionar.',
    selectedCount: (n) =>
      n === 1 ? '1 registo selecionado' : `${n} registos selecionados`,
    changeDateTime: 'Alterar data e hora',
    empty:
      'Ainda não há registos. Adiciona algo na calculadora de HC ou no planeador de desporto.',
    carbTotal: 'Total de HC',
    sameDateTime: (n) => `${n} registos vão receber a mesma data e hora.`,
    markHint: 'Selecionar',
    editHint: 'Editar registo',
    bgCurveSaved: 'Curva de glicemia guardada',
    invalidDateTime: 'Introduz a data como DD.MM.AAAA e a hora como HH:MM.',
    editDateTimeTitle: 'Alterar data e hora',
    editEntryTitle: 'Editar registo',
    date: 'Data',
    time: 'Hora',
    today: 'Hoje',
    yesterday: 'Ontem',
    comment: 'Comentário',
    commentPlaceholder: 'p. ex. antes do desporto, hipo depois …',
    deleteEntryTitle: 'Eliminar registo',
    deleteEntryConfirm: (name: string) => `Eliminar «${name}» do diário?`,
    deleteEntryA11y: (name: string) => `Eliminar ${name}`,
    editEntryA11y: (name: string) => `Editar ${name}`,
    deleteEntriesConfirm: (n: number) => `Eliminar ${n} registos do diário?`,
  },

  blutzucker: {
    title: 'A minha glicemia',
    prevDay: 'Dia anterior',
    nextDay: 'Dia seguinte',
    backToToday: 'Voltar a hoje',
    average: 'Média',
    timeInRange: 'Tempo no alvo (3.9 a 10.0)',
    lowest: 'Valor mais baixo',
    highest: 'Valor mais alto',
    atTime: (time: string) => `às ${time}`,
    delayHint:
      'As últimas horas podem faltar: consoante o fornecedor, os dados de MCG só ficam disponíveis com algumas horas de atraso.',
    chartTitle: 'Curva de glicemia',
    legendGlucose: (unit: string) => `Glicose (${unit})`,
    legendTarget: 'Intervalo alvo',
    noReadingsDay: 'Sem valores de glicemia para este dia.',
    mealsTitle: 'Refeições',
    totalCarbs: (g: number) => `Total ${g} g de HC`,
    noMeals: 'Nenhuma refeição registada neste dia.',
    peakTooltip: (value: string, time: string) => `Pico ${value} às ${time}`,
    footnote: (unit: string) =>
      `Pico e subida em ${unit}, medidos nas 2.5 horas após a refeição. Os valores acima de 10.0 são destacados.`,
    disclaimer:
      'Apenas para fins informativos. A Dialy não dá recomendações terapêuticas (p. ex. doses de insulina) e não substitui um medidor.',
    manageData: 'Gerir dados de glicemia',
    emptyTitle: 'Ainda não há dados de glicemia',
    emptyText:
      'Liga uma fonte de MCG ou importa uma exportação do LibreView para veres a tua curva junto das tuas refeições.',
    importCta: 'Importar dados',
    locked: 'Glicemia bloqueada',
  },

  glucose: {
    needAccount: 'Inicia sessão para importar dados de glicemia.',
    intro:
      'Importa os teus valores de glicose de um sensor MCG e vê-os junto das tuas refeições. Os valores são guardados em mg/dL e mostrados na unidade escolhida.',
    unit: 'Unidade',
    consentTitle: 'Consentimento',
    consent:
      'Autorizo que a Dialy importe e guarde os meus valores de glicose (dados de saúde sensíveis).',
    sources: 'Fontes',
    dexcomSoon: 'Ligação direta através da tua conta Dexcom (OAuth). Em breve.',
    comingSoon: 'Em breve',
    healthHelp: (platform: string) =>
      `A Dexcom e a Libre escrevem os seus valores em ${platform}. A Dialy pede autorização de leitura e importa-os, sem palavra-passe.`,
    healthConnect: 'Ligar e importar',
    healthUnavailable: 'Disponível apenas na app Dialy instalada (não na pré-visualização/navegador).',
    healthDenied: 'A autorização de leitura não foi concedida. Podes concedê-la nas definições do sistema, em Saúde/Health Connect.',
    libreHelp: 'Exporta os teus dados no LibreView (dados de glicose em CSV) e cola o conteúdo aqui.',
    csvPlaceholder: 'Cola aqui o CSV do LibreView …',
    importCsv: 'Importar CSV',
    demoTitle: 'Dados de demonstração',
    demoHelp: 'Gera uma curva diária de exemplo para hoje, com base nas tuas refeições de hoje.',
    demoCta: 'Gerar dados de demonstração para hoje',
    stored: 'Dados guardados',
    storedCount: (n: number) => `${n} valores de glicemia guardados.`,
    disconnectDelete: 'Desligar e eliminar todos os dados de glicemia',
    disclaimer:
      'A Dialy mostra os valores para fins informativos e não dá recomendações terapêuticas. Os teus valores são transmitidos e guardados de forma encriptada.',
    csvError: (key: string) => {
      switch (key) {
        case 'empty':
          return 'O ficheiro está vazio.';
        case 'noHeader':
          return 'Não foi encontrada nenhuma linha de cabeçalho com data e hora. É uma exportação do LibreView?';
        case 'noGlucoseColumn':
          return 'Não foi encontrada nenhuma coluna de glicose (mg/dL ou mmol/L).';
        case 'noReadings':
          return 'Não foram encontradas medições válidas.';
        default:
          return 'Não foi possível ler o ficheiro.';
      }
    },
    importedTitle: 'Importação concluída',
    importedMessage: (inserted: number, duplicates: number) =>
      `${inserted} valores novos importados${duplicates > 0 ? `, ${duplicates} duplicados ignorados` : ''}.`,
    importFailed: 'Falha na importação',
    deleteTitle: 'Eliminar dados de glicemia',
    deleteConfirm: 'Eliminar definitivamente todos os valores de glicemia importados?',
    deletedTitle: 'Eliminado',
    deletedMessage: (n: number) => `Foram eliminados ${n} valores de glicemia.`,
  },

  activities: {
    wandern: 'Caminhada',
    laufen: 'Corrida',
    rad: 'Ciclismo',
    schwimmen: 'Natação',
    kraft: 'Musculação',
  },

  sport: {
    title: 'Registar desporto',
    activity: 'Atividade',
    duration: 'Duração (minutos)',
    bgBefore: 'Glicemia antes do desporto',
    curve: 'Tendência típica (exemplo geral)',
    disclaimer:
      'Ilustração geral, não calculada para ti: mostra apenas em que direção a glicemia costuma evoluir com esta atividade. Não é uma previsão nem uma recomendação: a Dialy não calcula doses de insulina nem quantidades de HC.',
    carbsBefore: 'HC antes do desporto (nota)',
    carbsAfter: 'HC depois do desporto (nota)',
    beforePrefix: 'Antes do desporto',
    afterPrefix: 'Depois',
    afterHint:
      'Depois do desporto, a sensibilidade à insulina continua aumentada enquanto as reservas de glicogénio são repostas.',
    pump: 'Definição da bomba (nota)',
    reduction: 'Redução',
    for: 'durante',
    pumpHint:
      'Apenas uma nota sobre a definição da tua própria bomba. A Dialy não dá recomendações nem calcula nada.',
    saved: 'Guardado no diário',
    save: 'Guardar desporto',
  },

  chart: {
    timeAxis: 'Tempo em minutos',
    noScale: 'Sem escala – tracejado: nível inicial',
  },

  ratgeber: {
    title: 'Conselhos',
    empty: 'Ainda não há artigos.',
    notFound: 'Artigo não encontrado.',
    germanOnly: 'Por agora, os artigos só estão disponíveis em alemão.',
    errorOffline: 'Os conselhos só estão disponíveis com ligação à Internet.',
    errorNotConfigured:
      'Os conselhos precisam de uma ligação ao servidor Dialy, que aqui não está configurado.',
    errorUnavailable: 'Não foi possível carregar os artigos neste momento.',
    categories: {
      Sport: 'Desporto',
      Nacht: 'Noite',
      Insulin: 'Insulina',
      Technologie: 'Tecnologia',
      Ernährung: 'Alimentação',
      Medikamente: 'Medicamentos',
      Alltag: 'Dia a dia',
      Sicherheit: 'Segurança',
    },
  },

  login: {
    welcome: 'Bem-vindo/a',
    forgot: 'Esqueceste-te da palavra-passe?',
    signIn: 'Iniciar sessão',
    createAccount: 'Criar conta',
  },

  register: {
    title: 'Criar conta',
    subtitle: 'Gratuito. O diário requer também o Dialy Premium.',
    mismatch: 'As palavras-passe não coincidem.',
    consentMissing: 'Aceita os termos de utilização e o tratamento dos teus dados de saúde.',
    consent:
      'Aceito os termos de utilização e que os meus registos (incluindo dados de saúde como valores de glicemia) sejam tratados de acordo com a política de privacidade para disponibilizar o diário. Não são usados para fins publicitários nem de análise.',
    submit: 'Registar',
  },

  forgot: {
    title: 'Palavra-passe esquecida',
    unavailable:
      'Sem servidor, a palavra-passe não pode ser reposta: as contas locais não têm um e-mail confirmado. Se necessário, cria uma conta nova.',
    sent:
      'Se existir uma conta com este e-mail, enviámos-te uma ligação. Abre-a neste dispositivo para definir uma nova palavra-passe.',
    intro:
      'Introduz o e-mail da tua conta. Vamos enviar-te uma ligação para definires uma nova palavra-passe.',
    send: 'Enviar ligação',
  },

  newPassword: {
    invalidLink: 'Ligação inválida',
    title: 'Nova palavra-passe',
    tooShort: (n) => `A palavra-passe deve ter pelo menos ${n} caracteres.`,
    changed: 'A tua palavra-passe foi alterada e tens sessão iniciada.',
    intro: 'Define uma nova palavra-passe para a tua conta.',
    label: 'Nova palavra-passe',
    save: 'Guardar palavra-passe',
  },

  account: {
    signedIn: 'Sessão iniciada',
    premium: 'Premium',
    freeAccount: 'Conta gratuita',
    premiumTitle: 'Dialy Premium (CHF 3.00 / mês)',
    premiumSub: 'Diário completo e histórico de glicemia.',
    viewPremium: 'Ver Premium',
    devHint: 'Dev: mantém premido este cartão para ativar/desativar o Premium em testes.',
    legal: 'Informação legal e privacidade',
    glucoseData: 'Glicemia e MCG',
    deleteData: 'Eliminar dados',
    deleteConfirm:
      'Queres mesmo eliminar definitivamente todos os teus registos (refeições, desporto, glicemia)?',
    partlyDeleted: 'Eliminado parcialmente',
    deleted: 'Eliminado',
    partlyDeletedMessage:
      'Os dados locais foram eliminados. A eliminação no servidor será feita na próxima sincronização.',
    deletedMessage: 'Todos os teus registos foram eliminados.',
    deleteAccount: 'Eliminar conta',
    deleteAccountConfirm:
      'Queres mesmo eliminar definitivamente a tua conta e todos os teus dados? Uma subscrição Premium ativa é cancelada separadamente na App Store ou no Google Play.',
    deleteAccountFailed: 'Conta não eliminada',
    accountDeleted: 'Conta eliminada',
    accountDeletedMessage: 'A tua conta e todos os teus dados foram eliminados.',
    sync: 'Sincronização',
    signOut: 'Terminar sessão',
    syncLocalOnly:
      'Modo offline: não há nenhum servidor configurado. Todos os dados ficam no dispositivo.',
    syncing: 'A sincronizar …',
    offlinePending: (n) =>
      n === 1
        ? 'Sem ligação: 1 alteração está pendente e será enviada automaticamente.'
        : `Sem ligação: ${n} alterações estão pendentes e serão enviadas automaticamente.`,
    offlineSaved: 'Sem ligação: os teus registos estão guardados no dispositivo.',
    syncFailed: 'Falha na sincronização; nova tentativa automática.',
    pending: (n) =>
      n === 1
        ? '1 alteração aguarda sincronização.'
        : `${n} alterações aguardam sincronização.`,
    allSynced: (since) => `Tudo sincronizado · ${since}`,
    notSynced: 'Ainda não sincronizado.',
    justNow: 'agora mesmo',
    minutesAgo: (n) => `há ${n} min`,
    today: 'hoje',
  },

  paywall: {
    price: 'CHF 3.00 / mês',
    features: [
      'Diário completo com histórico',
      'Histórico e resumo da glicemia',
      'Sincronização entre dispositivos',
    ],
    renewal:
      'A subscrição renova-se automaticamente todos os meses e pode ser cancelada a qualquer momento até 24 horas antes do fim do período nas definições da tua conta da App Store ou do Google Play.',
    mockNote:
      'Nota: nesta versão, o pagamento é apenas uma pré-visualização. Não está configurado nenhum sistema de pagamento real.',
    active: 'O Premium está ativo',
    unlock: 'Ativar Premium (demo)',
  },

  privacy: {
    title: 'Política de privacidade',
    sections: [
      {
        h: 'Resumo',
        b: 'A Dialy é uma companheira para o dia a dia com diabetes. A app regista os valores que tu próprio/a introduzes, soma os hidratos de carbono e mostra para o desporto uma ilustração geral, não personalizada. A Dialy não é um dispositivo médico, não calcula doses de insulina e não dá recomendações de tratamento nem de dosagem.',
      },
      {
        h: 'Que dados tratamos',
        b: 'As refeições, atividades desportivas e valores de glicemia que introduzes. Estes dados de saúde são considerados especialmente sensíveis (art. 9.º RGPD / art. 5.º nLPD). São utilizados exclusivamente para disponibilizar o diário.',
      },
      {
        h: 'Sem utilização publicitária ou analítica',
        b: 'Os teus dados de saúde não são utilizados para fins de publicidade, marketing ou mineração de dados, e não são vendidos a terceiros.',
      },
      {
        h: 'Armazenamento',
        b: 'Os teus dados são guardados localmente no teu dispositivo. Com uma conta, são sincronizados de forma encriptada com o nosso servidor para ficarem disponíveis em vários dispositivos. O acesso está limitado à tua conta através de segurança ao nível das linhas (row-level security).',
      },
      {
        h: 'Formulário de contacto',
        b: 'As mensagens do formulário de contacto (propor um alimento ou comunicar um erro) são guardadas no nosso servidor para melhorar os dados dos alimentos. Se tiveres sessão iniciada, a mensagem fica associada à tua conta para te podermos responder caso tenhamos perguntas.',
      },
      {
        h: 'Os teus direitos',
        b: 'Podes eliminar completamente os teus dados a qualquer momento nas definições da conta, em «Eliminar dados». A eliminação é também transmitida ao servidor.',
      },
      {
        h: 'Fontes',
        b: 'Valores nutricionais da maioria dos alimentos da calculadora de HC: Base de dados suíça de valores nutricionais, Serviço Federal de Segurança Alimentar e Veterinária (OSAV), naehrwertdaten.ch. Tamanhos de porção habituais: OSAV, inquérito nacional de alimentação menuCH 2014-15. Peso por unidade de fruta, legumes e ovos: U.S. Department of Agriculture, FoodData Central (fdc.nal.usda.gov), domínio público. Outros alimentos e pratos: Max Rubner-Institut (2025), Bundeslebensmittelschlüssel (BLS) versão 4.0, licença CC BY 4.0. Bebidas de marca (p. ex. Rivella, Coca-Cola): dados dos fabricantes para a Suíça, outubro de 2026. Produtos de marca: Open Food Facts (openfoodfacts.org), Open Database License (ODbL), introduzidos por voluntários; prevalecem os dados da embalagem.',
      },
      {
        h: 'Contacto',
        b: 'Para questões sobre proteção de dados, escreve-nos para datenschutz@dialy.example. (provisório)',
      },
    ],
  },

  terms: {
    title: 'Termos de utilização',
    version: 'Versão de 12 de outubro de 2026',
    sections: [
      {
        h: '1. Fornecedor',
        b: 'A Dialy é disponibilizada por [nome / empresa], [rua n.º], [código postal localidade], Suíça, e-mail: [kontakt@dialy.example]. (Marcador de posição: completar antes da publicação.)',
      },
      {
        h: '2. Âmbito de aplicação',
        b: 'Estes termos de utilização aplicam-se à utilização da app Dialy. Ao criares uma conta ou subscreveres o Premium, aceita-los. Sem conta, aplicam-se por analogia às funções de acesso livre. Aplica-se ainda a nossa política de privacidade.',
      },
      {
        h: '3. O que a Dialy é – e o que não é',
        b: 'A Dialy é uma companheira para o dia a dia de pessoas com diabetes: a app mostra os valores nutricionais dos alimentos, soma os hidratos de carbono de uma refeição, mantém um diário dos valores que tu próprio/a introduzes e oferece artigos de informação geral.\n\nA Dialy não é um dispositivo médico na aceção da Portaria suíça sobre dispositivos médicos (ODim) nem do Regulamento (UE) 2017/745. A Dialy não faz diagnósticos, não dá recomendações de terapia ou de tratamento, não calcula doses de insulina, correções, quantidades de hidratos de carbono a ingerir nem definições da bomba, não prevê a tua glicemia e não avisa de hipoglicemias nem de hiperglicemias. A curva da página de desporto é uma ilustração geral e não é calculada para ti. Os campos sobre hidratos de carbono ou a bomba são apenas notas sobre o que tu próprio/a decidiste.\n\nToma sempre as decisões sobre a tua terapia tu próprio/a ou com a tua equipa de diabetes. A Dialy não substitui o aconselhamento médico nem as medições de glicemia. Em caso de emergência, liga para o 144 (na Suíça) ou para o número de emergência local.',
      },
      {
        h: '4. Valores nutricionais',
        b: 'Os valores nutricionais provêm de bases de dados públicas (em especial a Base de dados suíça de valores nutricionais do OSAV, o Bundeslebensmittelschlüssel e o Open Food Facts) e dos fabricantes. São valores médios ou indicativos, podem estar incompletos, desatualizados ou errados e variar consoante o produto, a receita e a preparação. As porções são estimativas. Prevalecem sempre os dados da embalagem. Não garantimos a sua exatidão.',
      },
      {
        h: '5. Conta',
        b: 'Para o diário precisas de uma conta. Tens de ter pelo menos 16 anos. As pessoas mais novas só podem usar a Dialy com o consentimento dos pais ou representantes legais. Uma conta é pessoal. Mantém a tua palavra-passe em segredo e informa-nos se suspeitares de uma utilização indevida.',
      },
      {
        h: '6. Utilização gratuita e Premium',
        b: 'A calculadora de HC, os conselhos e a página de desporto são gratuitos. O Premium custa CHF 3.00 por mês (preço com IVA incluído, sujeito a alterações) e desbloqueia as funções adicionais descritas na app.\n\nO Premium é subscrito e faturado como subscrição através da App Store da Apple ou do Google Play; aplicam-se também as respetivas condições. A subscrição renova-se automaticamente todos os meses se não a cancelares até 24 horas antes do fim do período nas definições da tua conta da loja. O cancelamento produz efeitos no fim do período em curso. Os reembolsos regem-se pelas regras da Apple ou da Google. Anunciamos as alterações de preço atempadamente; só se aplicam a partir do período seguinte e apenas se não cancelares.',
      },
      {
        h: '7. Disponibilidade',
        b: 'Esforçamo-nos por garantir um funcionamento fiável, mas não podemos garantir uma disponibilidade ininterrupta. As funções podem ser alteradas, alargadas ou removidas. Os teus registos são guardados no dispositivo e, com uma conta, no nosso servidor; guarda também os valores importantes onde a tua equipa de diabetes precisar deles.',
      },
      {
        h: '8. Responsabilidade',
        b: 'Usas a Dialy por tua conta e risco. Não respondemos pelas decisões sobre alimentação, insulina ou terapia que tomes com base na app, nem por valores nutricionais incorretos ou perdas de dados. Na medida permitida por lei, a nossa responsabilidade limita-se ao dolo e à negligência grave. Fica ressalvada a responsabilidade legal imperativa, por exemplo por danos pessoais ou nos termos da lei da responsabilidade pelo produto.',
      },
      {
        h: '9. Direitos',
        b: 'A app, os seus textos e o seu design pertencem ao fornecedor ou aos respetivos titulares de direitos. Obténs um direito simples e intransmissível de usar a Dialy para fins privados. Aos dados nutricionais aplicam-se as licenças das fontes (ver a política de privacidade, secção «Fontes»).',
      },
      {
        h: '10. Rescisão e eliminação',
        b: 'Podes deixar de usar a Dialy a qualquer momento e eliminar os teus dados nas definições, em «Eliminar dados». Uma subscrição Premium ativa é cancelada separadamente na App Store ou no Google Play. Podemos bloquear ou eliminar contas em caso de violação destes termos.',
      },
      {
        h: '11. Alterações',
        b: 'Podemos adaptar estes termos de utilização, por exemplo devido a novas funções ou alterações legais. Informamos-te antecipadamente na app sobre alterações importantes. Se não concordares, podes deixar de usar a app e eliminar a tua conta.',
      },
      {
        h: '12. Lei aplicável e foro',
        b: 'É aplicável a lei suíça. O foro competente é o da sede do fornecedor. Se viveres noutro país como consumidor/a, manténs as disposições de proteção imperativas e o foro do teu país de residência.',
      },
    ],
  },

  contact: {
    intro:
      'Falta um alimento, há um valor errado ou tens outro pedido? Escreve-nos: analisamos todas as mensagens.',
    kindNew: 'Novo alimento',
    kindOther: 'Outro',
    fixHint:
      'Um valor está errado ou falta uma porção? Comunica-o diretamente no alimento, na calculadora de HC.',
    foodName: 'Nome do alimento *',
    foodNamePlaceholder: 'p. ex. pãozinho integral de espelta',
    valuesLabel: 'Valores nutricionais por 100 g (se souberes)',
    carbs: 'Hidratos de carbono (g)',
    sugar: 'Açúcares (g)',
    fat: 'Lípidos (g)',
    valuesInvalid: 'Indica os valores nutricionais como um número entre 0 e 100.',
    remark: 'Observação / fonte',
    remarkPlaceholder: 'p. ex. valores da embalagem',
    subject: 'Assunto *',
    subjectPlaceholder: 'p. ex. pergunta sobre o diário',
    message: 'Mensagem *',
    messagePlaceholder: 'O que nos queres dizer?',
    send: 'Enviar',
    thanks: 'Obrigado!',
    sentMessage: 'Recebemos a tua mensagem. Obrigado pela tua ajuda!',
    notSent: 'Não enviado',
    writeTo: (email) => `Também nos podes escrever para ${email}.`,
    errorOffline:
      'Sem ligação à Internet. Tenta novamente mais tarde; o que escreveste fica guardado.',
    errorNotConfigured:
      'O formulário de contacto precisa de uma ligação ao servidor Dialy, que aqui não está configurado.',
    errorUnavailable:
      'Não foi possível enviar a mensagem neste momento. Tenta novamente mais tarde.',
  },

  /** Report an error / suggest a portion right on a food in the KH-Rechner. */
  feedback: {
    reportError: 'Comunicar um erro',
    suggestPortion: 'Propor uma porção',
    reportLabel: 'O que está errado? *',
    reportPlaceholder: 'p. ex. 48 g de HC por 100 g segundo a embalagem',
    portionLabel: 'Designação *',
    portionLabelPlaceholder: 'p. ex. 1 unidade, 1 fatia, 1 copo',
    portionGrams: 'Gramas *',
    portionGramsInvalid: 'Indica os gramas como um número entre 1 e 2000.',
    remark: 'Observação',
    remarkPlaceholder: 'p. ex. segundo a embalagem',
    sent: 'Obrigado! Recebemos a tua comunicação.',
  },

  auth: {
    alreadyRegisteredSignIn: 'Este e-mail já está registado. Inicia sessão.',
    confirmEmail: (email) =>
      `Quase pronto! Enviámos-te um e-mail para ${email}. Confirma o teu endereço com a ligação que ele contém e depois inicia sessão.`,
    linkExpired: 'A ligação expirou ou já foi utilizada. Pede uma nova.',
    localResetUnavailable:
      'Sem servidor, a palavra-passe não pode ser reposta: as contas locais não têm um e-mail confirmado. Se necessário, cria uma conta nova.',
    offline:
      'Sem ligação à Internet. Para iniciar sessão e registar-te precisas de Internet; tudo o resto também funciona offline.',
    invalidLogin: 'O e-mail ou a palavra-passe estão incorretos.',
    alreadyRegistered: 'Este e-mail já está registado.',
    emailNotConfirmed:
      'Confirma primeiro o teu e-mail (ligação no e-mail de confirmação) e depois inicia sessão.',
    samePassword: 'A nova palavra-passe tem de ser diferente da anterior.',
    rateLimit: 'Demasiadas tentativas. Aguarda um momento e tenta novamente.',
    weakPassword: 'A palavra-passe não cumpre os requisitos (pelo menos 6 caracteres).',
    invalidEmail: 'Introduz um e-mail válido.',
    generic: 'Ocorreu um erro. Tenta novamente.',
  },
};

export default pt;
