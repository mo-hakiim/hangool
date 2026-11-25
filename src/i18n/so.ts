import type { Dictionary } from "./en";

// Somali dictionary — mirrors en.ts exactly (src/test/i18n.test.ts checks this).
// Lines marked "TODO(so): review" are translations a native speaker should confirm,
// mostly technical construction and real-estate terms.
export const so: Dictionary = {
  meta: { langName: "Soomaali", short: "SO", switchLabel: "Luqadda" },
  nav: {
    home: "Bogga Hore",
    about: "Nagu Saabsan",
    aboutUs: "Nagu Saabsan",
    team: "Kooxdayada",
    careers: "Shaqooyin",
    services: "Adeegyada",
    ourServices: "Adeegyadayada",
    construction: "Waaxda Dhismaha",
    realEstate: "Waaxda Hantida Ma-guurtada", // TODO(so): review ("real estate")
    projects: "Mashaariicda",
    ourProjects: "Mashaariicdayada",
    gallery: "Sawirro",
    news: "Wararka & Maqaallada",
    contact: "Nala Soo Xiriir",
    quote: "Codso Qiimeyn",
    openMenu: "Fur liiska",
    closeMenu: "Xir liiska",
    home_aria: "Bogga hore ee Hangool",
    mainNav: "Hagaha ugu weyn",
    mobileNav: "Hagaha taleefanka",
  },
  common: {
    location: "Hargeysa, Somaliland",
    viewDetails: "Faahfaahin",
    viewAll: "Dhammaan",
    readMore: "Akhri wax badan",
    back: "Dib u noqo",
    loading: "Waa la soo rarayaa…",
    all: "Dhammaan",
    close: "Xir",
    previous: "Sawirka hore",
    next: "Sawirka xiga",
    photo: "Sawir {n}",
    call: "Wac",
    whatsapp: "WhatsApp",
    email: "Iimayl",
    talkWhatsApp: "Nagala hadal WhatsApp",
    chatWhatsApp: "Hangool kala xiriir WhatsApp (daaqad cusub ayuu ka furmayaa)",
    whatsappTitle: "Aan ku wada hadalno WhatsApp",
    onSocial: "Hangool ee {name} (daaqad cusub ayuu ka furmayaa)",
    comingSoon: "Dhowaan",
    offline:
      "Hadda ma soo saari karno macluumaadkii ugu dambeeyay. Fadlan mar dambe isku day, ama nagala soo xiriir WhatsApp.",
    notFoundTitle: "Boggaas lama helin.",
    notFoundText: "Waxaa laga yaabaa in la tirtiray ama aan la daabicin hadda.",
    goHome: "Tag bogga hore",
  },
  footer: {
    description:
      "Hangool Development waxay dhistaa guryo, dhismayaal ganacsi iyo hanti ma-guurto ah oo ku baahsan Somaliland — laga bilaabo naqshadaynta iyo qorshaynta ilaa dhismaha iyo wareejinta, iyadoo la ilaalinayo tayada, daahfurnaanta iyo waqtiga.", // TODO(so): review
    explore: "Baadh",
    getInTouch: "Nala xiriir",
    stayConnected: "Nala joog",
    rights: "Xuquuqda oo dhan way dhowran tahay.",
    tagline: "Waxaa lagu dhisay hammi. Waxaa lagu saleeyay daacadnimo.",
    admin: "Maamulka",
  },
  cta: {
    eyebrow: "Aan dhisno wax waara",
    title: "Mashruuc ma kugu jiraa maskaxda? Aan wada hadalno.",
    copy: "Hammigaaga. Farsamadayada. Mustaqbal ka wanaagsan, wadajir.",
  },
  home: {
    eyebrow: "Dhaqanka ku salaysan. Berrito loo dhisay.",
    line1: "Dhisidda mustaqbalka",
    line2: "Hargeysa.",
    line2accent: "Wadajir.",
    copy1: "Guryo si fiican loo naqshadeeyay. Horumarin waarta.",
    copy2: "Waxaa lagu dhisay hammi, daacadnimo iyo daryeel.",
    viewProjects: "Eeg Mashaariicdayada",
    discover: "Baro Hangool",
    heroAlt: "Guri casri ah oo leh balakoonno furan, beer qurxoon iyo iftiin fiid ah oo diiran",
    statsLabel: "Tirakoobka shirkadda",
    stats: {
      years: "Sano oo khibrad ah",
      projects: "Mashaariic la dhammeeyay",
      clients: "Macaamiil ku faraxsan",
      professionals: "Shaqaale xirfad leh",
    },
    deptEyebrow: "Laba waaxood, hal heer",
    deptTitle: "Dhismaha iyo hantida ma-guurtada hal saqaf hoostiisa.",
    whatEyebrow: "Waxa aan dhisno",
    whatTitle: "Aragtidaada. Khibradayada.",
    whatCopy:
      "Laga bilaabo guriga ugu horreeya ee qoys ilaa cutubka xiga ee ganacsi, waxaan dhisnaa meelo kor kuu qaada.",
    exploreServices: "Eeg dhammaan adeegyada",
    workEyebrow: "Shaqadayada",
    workTitle: "Meelo ujeeddo leh.",
    viewAllProjects: "Eeg dhammaan mashaariicda",
    propsEyebrow: "Hantida ma-guurtada",
    propsTitle: "Hel hantidaada xigta.",
    viewAllProperties: "Daawo guryaha",
    diffEyebrow: "Waxa Hangool ka duwan",
    diffTitle1: "Aasaas adag.",
    diffTitle2: "Ballanqaad ka sii adag.",
    diffCopy:
      "Dhismuhu wuu ka badan yahay darbiyo iyo saqaf. Waa ballan loo qaaday dadka ku dhex noolaan doona, ka shaqayn doona, korina doona.",
    diffAlt: "Naqshado dhisme iyo agab loo diyaariyay dhisme cusub",
    meet: "Baro Hangool",
    reasons: [
      {
        title: "Tayo aan laga tanaasulin",
        text: "Agab la isku halleyn karo iyo daryeel faahfaahin kasta.",
      },
      { title: "Ixtiraamka waqtigaaga", text: "Qorshe cad. Xiriir joogto ah." },
      { title: "Dad xirfaddooda yaqaan", text: "Koox khibrad leh oo hammi wadaag ah." },
      { title: "Badbaadadu waa kow", text: "Dhisme mas'uuliyad leh, aasaaska ilaa dusha." },
    ],
  },
  about: {
    eyebrow: "Sheekadayada",
    title: "Hadaf kastaa wuxuu u baahan yahay guri.",
    description:
      "Waxaan ku dhisnaa hammi, daacadnimo iyo daryeel — qorshaha koowaad ilaa furaha ugu dambeeya.",
    imageAlt: "Guri casri ah oo si fiican loo naqshadeeyay",
    aboutEyebrow: "Ku saabsan Hangool",
    aboutTitle1: "Dhaqanka Soomaaliyeed.",
    aboutTitle2: "Farsamo casri ah.",
    story:
      "Hangool Construction & Real Estate waxay dhistaa guryo iyo horumarin ganacsi oo si fiican loo naqshadeeyay, kuna salaysan dhaqanka Soomaaliyeed iyo farsamada casriga ah. Waxaan u heellan nahay qoysaska iyo ganacsiyada mustaqbalkooda dhisanaya, waxaanan isku darnaa dhaqanka saxda ah iyo tayada dhismaha ee waarta si aan u abuurno meelo jiilal badan u adeega.",
    missionTitle: "Hadafkayaga",
    mission:
      "In aan bixino guryo iyo horumarin si fiican loo dhisay oo la isku halleyn karo, annagoo adeegsanayna xiriir daahfuran oo daacad ah, macaamil caddaalad ah, iyo ixtiraam qoto dheer oo aan u hayno macmiil kasta iyo bulsho kasta oo aan u dhisno.",
    visionTitle: "Aragtidayada",
    vision:
      "In aan noqonno magac lagu kalsoon yahay oo hormuud ka ah dhismaha iyo hantida ma-guurtada Soomaaliyeed — anagoo qaabaynayna bulshooyin firfircoon oo dhisayna meelo waara oo qoysasku si dhab ah ugu faanaan inay guri u yeeshaan.",
    valuesEyebrow: "Waxa na haga",
    valuesTitle: "Qiyamka na mideeya.",
    values: ["Hammi", "Ujeeddo", "Daacadnimo", "Farsamo", "Ku faanka dhaqanka Soomaaliyeed"],
    teamEyebrow: "Dadkayaga",
    teamTitle: "Kooxda ka dambaysa ballanka.",
    teamLink: "Baro kooxdayada",
    careersLink: "Nagu soo biir",
  },
  services: {
    eyebrow: "Khibradayada",
    title: "Waxaa lagu dhisay hammigaaga.",
    description:
      "Hab dhammaystiran oo dhismaha iyo hantida ma-guurtada ah — qorshayn taxadar leh, fulin la isku halleyn karo, iyo daryeel dhammaystir kasta.",
    deptEyebrow: "Waaxyahayaga",
    deptTitle: "Laba waaxood. Hal ballan.",
    construction: {
      title: "Waaxda Dhismaha",
      text: "Dhismaha guryaha, ganacsiga, warshadaha iyo waddooyinka, oo ay la socdaan naqshadayn, injineernimo iyo maareynta mashruuca.",
    },
    realEstate: {
      title: "Waaxda Hantida Ma-guurtada",
      text: "Guryo, abaartamanno, fillooyin iyo dhul iib ama kiro ah, iyo maareynta iyo horumarinta hantida.",
    },
    explore: "Eeg waaxda",
    listEyebrow: "Adeegyadayada",
    workWithYou:
      "Waxaan si dhow kuula shaqaynaa si aan u fahanno hadafyadaada, ugu heshiinno qorshe cad, oo aan si daryeel leh u fulinno.",
    items: [
      {
        title: "Dhismaha Guryaha",
        short: "Guryo si fiican loo dhisay, loogu talagalay sida aad u nooshahay.",
        includes: [
          "Guryo iyo fillooyin cusub",
          "Shaqooyinka qaabdhismeedka iyo madaniga",
          "Dhammaystir iyo wareejin buuxda",
        ], // TODO(so): review
      },
      {
        title: "Dhismayaasha Ganacsiga",
        short: "Meelo waara oo ku habboon oo ganacsigaaga ka caawiya inuu koro.",
        includes: ["Xafiisyo iyo dukaamo", "Horumarin ganacsi", "Kaabayaasha dhismaha"],
      },
      {
        title: "Dayactir & Dhammaystir",
        short: "Aragti cusub. Heer dhammaystir oo sare.",
        includes: [
          "Dayactirka gudaha iyo dibadda",
          "Sagxadda, rinjiga iyo alwaaxa",
          "Dhammaystirka jikada iyo musqusha",
        ],
      },
      {
        title: "Maareynta Mashruuca",
        short: "Qorshaha koowaad ilaa furaha ugu dambeeya, faahfaahinta annaga ayaa qaabilsan.",
        includes: [
          "Qorshayn iyo isku-dubbarid",
          "Maareynta miisaaniyadda iyo jadwalka",
          "Kormeerka tayada iyo goobta",
        ],
      },
      {
        title: "Keenista Agabka Dhismaha",
        short: "Agab la isku halleyn karo. Aasaas adag oo dhisme kasta.",
        includes: [
          "Soo iibinta agabka dhismaha",
          "Hubinta tayada",
          "Isku-dubbaridka keenista goobta",
        ],
      },
    ],
  },
  construction: {
    eyebrow: "Waaxda Dhismaha",
    title: "Aasaaska ilaa dusha, loo dhisay inuu waaro.",
    description:
      "Hal koox oo naqshadaynta, injineernimada iyo dhismaha qaabilsan — si mashruuc kasta si cad loo qorsheeyo oo daryeel loogu fuliyo.",
    listTitle: "Waxa aan dhisno",
    items: [
      {
        title: "Dhismaha Guryaha",
        text: "Guryo qoys, fillooyin iyo dhismayaal abaartamanno ah, oo heer sare lagu dhisay aasaaska ilaa dhammaystirka.",
      },
      {
        title: "Dhismaha Ganacsiga",
        text: "Xafiisyo, dukaamo, hoteello iyo dhismayaal isku-dhafan oo loogu talagalay ganacsi maalinle ah.",
      },
      {
        title: "Dhismaha Warshadaha",
        text: "Bakhaarro, warshado yaryar iyo xarumo warshadeed oo leh qaabdhismeed adag oo wax ku ool ah.",
      }, // TODO(so): review
      {
        title: "Dhismaha Waddooyinka",
        text: "Waddooyin gelitaan, laami iyo kaabayaasha goobta oo isku xira dadka iyo meelaha.",
      },
      {
        title: "Naqshadaynta Dhismaha",
        text: "Qorshayaal, naqshado 3D ah iyo sawirro u beddela fikradahaaga naqshad la dhisi karo.",
      },
      {
        title: "Adeegyada Injineernimada",
        text: "Injineernimada qaabdhismeedka iyo madaniga, sahamin iyo sawirro farsamo.",
      }, // TODO(so): review
      {
        title: "Maareynta Mashruuca",
        text: "Qorshayn, miisaaniyad, jadwal iyo kormeerka goobta bilowga ilaa wareejinta.",
      },
      {
        title: "Dayactir & Ilaalin",
        text: "Casriyayn, dayactir iyo shaqooyin dhammaystir oo dhismayaasha dib u nooleeya.",
      },
      {
        title: "La-talinta Dhismaha",
        text: "Talo khabiir ah oo ku saabsan kharashka, agabka, ruqsadaha iyo habka saxda ah ee wax loo dhiso.",
      },
    ],
    processEyebrow: "Sida aan u shaqayno",
    processTitle: "Waddo cad oo fikradda ilaa wareejinta ah.",
    steps: [
      {
        title: "Dhageyso",
        text: "Waxaan ka bilaabnaa hadafyadaada, miisaaniyaddaada iyo goobtaada.",
      },
      {
        title: "Naqshadee",
        text: "Qorshayaal iyo sawirro aad dib u eegi karto oo aad ansixin karto.",
      },
      { title: "Dhis", text: "Agab tayo leh, goobo badbaado leh iyo warbixinno joogto ah." },
      { title: "Wareeji", text: "Dhisme dhammaystiran, la hubiyay oo diyaar u ah isticmaal." },
    ],
  },
  realEstate: {
    eyebrow: "Waaxda Hantida Ma-guurtada",
    title: "Hantida saxda ah, oo ay la socdaan dad aad ku kalsoon tahay.",
    description:
      "Guryo, abaartamanno, fillooyin, dhul iyo meelo ganacsi — si aad u iibsato, u kiraysato, u maamusho ama u horumariso.",
    listTitle: "Adeegyadayada hantida ma-guurtada",
    items: [
      {
        title: "Guryo Iib Ah",
        text: "Guryo iyo dhismayaal diyaar u ah iibsasho, leh faahfaahin cad iyo qiimo caddaalad ah.",
      },
      { title: "Guryo Kiro Ah", text: "Guryo, abaartamanno iyo meelo ganacsi oo kiro ah." },
      { title: "Dhul Iib Ah", text: "Dhul loogu talagalay guryo, ganacsi iyo horumarin cusub." },
      { title: "Hantida Deegaanka", text: "Guryo iyo hoy qoys oo meelo wanaagsan ku yaal." }, // TODO(so): review ("residential properties")
      { title: "Hantida Ganacsiga", text: "Dukaamo, xafiisyo iyo goobo ganacsi." },
      {
        title: "Abaartamanno",
        text: "Abaartamanno casri ah oo loogu talagalay qoysaska iyo shaqaalaha.",
      },
      { title: "Fillooyin", text: "Fillooyin waaweyn oo leh dhammaystir tayo sare leh." },
      {
        title: "Maareynta Hantida",
        text: "Waxaan daryeelnaa hantidaada, kiraystayaasha iyo dayactirka.",
      },
      {
        title: "Horumarinta Hantida Ma-guurtada",
        text: "Qorshaynta iyo dhisidda horumarin cusub oo guryo iyo ganacsi ah.",
      },
    ],
    listingsEyebrow: "Hantida la heli karo",
    listingsTitle: "Hel hantidaada xigta.",
  },
  search: {
    title: "Raadi guryo",
    location: "Goobta",
    anyLocation: "Goob kasta",
    type: "Nooca hantida",
    anyType: "Nooc kasta",
    deal: "Iib ama kiro",
    anyDeal: "Iib ama kiro",
    minPrice: "Qiimaha ugu yar (USD)",
    maxPrice: "Qiimaha ugu badan (USD)",
    bedrooms: "Qolalka jiifka",
    bathrooms: "Musqulaha",
    minSize: "Baaxadda ugu yar (m²)",
    any: "Kasta",
    availability: "Xaaladda",
    anyAvailability: "Kasta",
    reset: "Tirtir shaandheynta",
    results: "{n} hanti ayaa la helay",
    noResults:
      "Hanti la mid ah raadintaada lama helin. Isku day inaad tirtirto qaar ka mid ah shaandheynta.",
    emptyTitle: "Liiska hantidu dhowaan ayuu imanayaa.",
    emptyText:
      "Waxaan diyaarinaynaa liisaskayaga ugu horreeya. Nagala soo xiriir WhatsApp oo noo sheeg waxa aad raadinayso.",
  },
  property: {
    types: {
      apartment: "Abaartamanno",
      villa: "Fillo",
      house: "Guri",
      land: "Dhul",
      commercial: "Ganacsi",
      office: "Xafiis",
    },
    deal: { sale: "Iib", rent: "Kiro" },
    availability: {
      available: "Waa la heli karaa",
      reserved: "Waa la qabsaday",
      sold: "Waa la iibiyay",
      rented: "Waa la kireeyay",
      unavailable: "Lama heli karo",
    },
    perMonth: "/ bishii",
    priceOnRequest: "Qiimaha waa la weydiin karaa",
    beds: "{n} qol jiif",
    baths: "{n} musqul",
    size: "{n} m²",
    sizeLabel: "Baaxadda",
    details: "Faahfaahinta hantida",
    price: "Qiimaha",
    description: "Sharaxaad",
    back: "Ku noqo guryaha",
    interested: "Hantidan ma xiisaynaysaa?",
    askWhatsApp: "Ku weydii WhatsApp",
    whatsappText: "Salaan Hangool, waxaan xiisaynayaa hantidan: {name}",
    viewingTitle: "Codso booqasho",
    viewingText: "Dooro maalin kugu habboon, waxaanan kuu soo wici doonnaa si aan u xaqiijinno.",
    preferredDate: "Maalinta aad doorbidayso",
    viewingSuccess:
      "Mahadsanid. Codsigaaga booqashada waa la diray. Waxaan kuu soo wici doonnaa si aan u xaqiijinno waqtiga.",
  },
  projects: {
    eyebrow: "Mashaariicdayada",
    title: "Meelo ujeeddo leh.",
    description: "Guryo qoysas. Goobo ganacsi. Aasaas waara oo cutubka xiga ah.",
    status: "Xaaladda",
    category: "Qaybta",
    allStatuses: "Dhammaan xaaladaha",
    allCategories: "Dhammaan qaybaha",
    statuses: { completed: "La dhammeeyay", ongoing: "Socda", upcoming: "Soo socda" },
    categories: {
      residential: "Guryo",
      commercial: "Ganacsi",
      industrial: "Warshado",
      road: "Waddo",
      renovation: "Dayactir",
      other: "Kale",
    },
    emptyTitle: "Mashaariicdayadu dhowaan ayay imanayaan.",
    emptyText:
      "Waxaan ku darraynaa sawirro iyo faahfaahin shaqadayada la dhammeeyay iyo tan socota.",
    noResults: "Mashaariic la mid ah shaandheyntan lama helin.",
    back: "Ku noqo mashaariicda",
    started: "La bilaabay",
    finished: "La dhammeeyay",
    expected: "Dhammaystirka la filayo",
    photos: "Sawirro",
    videos: "Muuqaallo",
    watchVideo: "Daawo muuqaalka",
  },
  gallery: {
    eyebrow: "Sawirro",
    title: "Dhisme kasta, sheeko ayaa ka dambaysa.",
    description:
      "Fikradaha warqadda ku qoran ilaa faahfaahinta goobta. Eegmo shaqadayada, dadkayaga iyo meelaha aan abuurno.",
    categories: {
      completed: "Mashaariic La Dhammeeyay",
      ongoing: "Mashaariic Socda",
      construction: "Dhismo",
      realEstate: "Hantida Ma-guurtada",
      engineering: "Injineernimo & Naqshadayn",
      equipment: "Qalabka & Mashiinnada",
      events: "Munaasabadaha Shirkadda",
      video: "Muuqaal",
    },
    bundled: {
      home: {
        title: "Meel guri loogu yeesho",
        caption: "Naqshad taxadar leh, qorshaha koowaad ilaa furaha ugu dambeeya.",
      },
      detail: {
        title: "Waxaa lagu dhisay daryeel faahfaahinta",
        caption: "Eegmo dhow oo farsamada ka dambaysa dhammaystir kasta.",
      },
      ambition: {
        title: "Hammiga ka dambeeya dhismaha",
        caption: "Shaqadayadu waxay ka bilaabataa qorshe cad iyo hadaf wadaag ah.",
      },
    },
    empty: "Qaybtan wali sawirro kuma jiraan.",
    openPhoto: "Fur sawirka",
    stayTitle: "Nala soco waxa xiga.",
    stayText: "Hangool ka hel Facebook, Instagram, TikTok iyo YouTube.",
  },
  team: {
    eyebrow: "Dadkayaga",
    title: "Kooxda ka dambaysa ballanka.",
    description:
      "Injineerro, naqshadeeyayaal, maareeyayaal mashruuc iyo khubaro hanti ma-guurto oo wada shaqeeya.",
    emptyTitle: "Bogagga kooxdayadu dhowaan ayay imanayaan.",
    emptyText: "Waxaan diyaarinaynaa soo bandhigidda dadka ka dambeeya Hangool.",
  },
  news: {
    eyebrow: "Wararka & Maqaallada",
    title: "Warar ka yimid Hangool.",
    description:
      "Wararka shirkadda, xogta mashaariicda iyo talooyin ku saabsan dhismaha iyo iibsashada hantida.",
    emptyTitle: "Wali maqaallo ma jiraan.",
    emptyText:
      "Warar iyo maqaallo dhowaan ayaa halkan ka soo bixi doona. Nagala soco baraha bulshada si aad u hesho wararkii ugu dambeeyay.",
    back: "Ku noqo wararka",
  },
  careers: {
    eyebrow: "Shaqooyin",
    title: "Mustaqbalkaaga xirfadeed la dhis Hangool.",
    description:
      "Had iyo jeer waan ku faraxsannahay inaan la kulanno injineerro, naqshadeeyayaal, shaqaalaha goobta iyo khubarada hantida ma-guurtada.",
    emptyTitle: "Hadda ma jiraan shaqooyin bannaan.",
    emptyText:
      "Shaqooyinka cusub halkan ayaa lagu soo dhejin doonaa. Weli waxaad CV-gaaga u diri kartaa {email}.",
    deadline: "Codso ka hor {date}",
    apply: "Sida loo codsado",
    applyText:
      "CV-gaaga iyo fariin gaaban u dir {email}, adigoo cinwaanka shaqada ku qoraya mawduuca.",
    applyEmail: "Ku codso iimayl",
    types: {
      full_time: "Waqti buuxa",
      part_time: "Waqti dhiman",
      contract: "Qandaraas",
      internship: "Tababar",
    },
  },
  contact: {
    eyebrow: "Aan wada hadalno",
    title: "Cutubkaaga xiga halkan ayuu ka bilaabmayaa.",
    description:
      "Noo sheeg waxa maskaxdaada ku jira. Guri qoys, meel ganacsi, bilow cusub — diyaar ayaan u nahay inaan dhegeysano.",
    formTitle: "Noo soo dir fariin.",
    formText: "Badanaa waxaan ku jawaabnaa hal maalin shaqo gudaheed.",
    asideTitle: "Wada hadal. Bilow.",
    callUs: "Na wac",
    emailUs: "Noo soo dir iimayl",
    follow: "Nala soco",
    findUs: "Na soo booqo",
    mapTitle: "Goobta xafiiska Hangool",
    openMap: "Ka fur Google Maps",
    success: "Mahadsanid. Fariintaada waa la diray. Dhowaan ayaan kuu soo jawaabi doonnaa.",
  },
  quote: {
    eyebrow: "Codso qiimeyn",
    title: "Noo sheeg mashruucaaga.",
    description: "Noo soo dir faahfaahin yar, kooxdayaduna waxay kuu diyaarin doontaa qiimeyn.",
    formTitle: "Codso qiimeyn.",
    formText: "Faahfaahin yar oo adiga iyo mashruucaaga ku saabsan.",
    serviceType: "Nooca adeegga",
    selectService: "Dooro adeeg",
    location: "Goobta mashruuca",
    budget: "Miisaaniyadda",
    selectBudget: "Dooro miisaaniyad",
    budgets: [
      "Ka yar $10,000",
      "$10,000 – $50,000",
      "$50,000 – $150,000",
      "$150,000 – $500,000",
      "Ka badan $500,000",
      "Wali ma hubo",
    ],
    other: "Kale",
    success:
      "Mahadsanid. Codsigaaga qiimeynta waa la diray. Kooxdayadu dhowaan ayay kula soo xiriiri doontaa.",
    asideTitle: "Maxaa xiga?",
    steps: [
      "Waxaan eegnaa codsigaaga, badanaa hal maalin shaqo gudaheed.",
      "Waxaan kuu soo wacnaa si aan u fahanno mashruucaaga iyo goobta.",
      "Waxaad heleysaa qiimeyn cad oo faahfaahsan.",
    ],
  },
  form: {
    name: "Magacaaga",
    namePlaceholder: "Magaca oo buuxa",
    phone: "Lambarka taleefanka",
    phonePlaceholder: "tusaale +252 63 1234567",
    email: "Iimayl (ikhtiyaari)",
    emailPlaceholder: "adiga@tusaale.com",
    message: "Fariin",
    messagePlaceholder: "Sideen kuu caawin karnaa?",
    projectMessage: "Noo sheeg mashruucaaga",
    projectPlaceholder: "Maxaad doonaysaa inaad dhisto?",
    send: "Dir fariinta",
    sendQuote: "Dir codsiga qiimeynta",
    sendViewing: "Codso booqasho",
    sending: "Waa la dirayaa…",
    required: "Fadlan buuxi meeshan.",
    invalidPhone: "Fadlan geli lambar taleefan oo sax ah.",
    invalidEmail: "Fadlan geli iimayl sax ah.",
    error: "Fariintaada lama diri karin. Fadlan mar kale isku day, ama nagala soo xiriir WhatsApp.",
    tooFast: "Fadlan daqiiqad hubi xogtaada, kadibna mar kale dir.",
    waContact: "Salaan Hangool,",
    waQuote: "Salaan Hangool, waxaan rabaa qiimeyn.",
  },
  seo: {
    home: {
      title: "Dhisidda Mustaqbalka Hargeysa",
      description:
        "Hangool Construction & Real Estate waxay dhistaa guryo iyo dhismayaal ganacsi, waxayna iibisaa oo kiraysaa hanti ku baahsan Somaliland.",
    },
    about: {
      title: "Nagu Saabsan",
      description:
        "Baro sheekada Hangool, hadafkeeda iyo ballanqaadkeeda dhaqanka Soomaaliyeed, daacadnimada iyo farsamada waarta.",
    },
    services: {
      title: "Adeegyadayada",
      description:
        "Adeegyada dhismaha iyo hantida ma-guurtada ee Somaliland: dhisme, naqshadayn, injineernimo, maareynta mashruuca, iib, kiro iyo maareynta hantida.",
    },
    construction: {
      title: "Waaxda Dhismaha",
      description:
        "Dhismaha guryaha, ganacsiga, warshadaha iyo waddooyinka, naqshadaynta, injineernimada iyo maareynta mashruuca ee Somaliland.",
    },
    realEstate: {
      title: "Waaxda Hantida Ma-guurtada",
      description:
        "Guryo, dhul, abaartamanno iyo fillooyin iib iyo kiro ah oo Somaliland ku yaal, iyo maareynta iyo horumarinta hantida.",
    },
    projects: {
      title: "Mashaariicdayada",
      description:
        "Mashaariicda dhismaha ee Hangool ee la dhammeeyay, socda iyo soo socda ee Somaliland.",
    },
    gallery: {
      title: "Sawirro",
      description:
        "Sawirro iyo muuqaallo mashaariicda Hangool, goobaha dhismaha, qalabka iyo munaasabadaha shirkadda.",
    },
    team: {
      title: "Kooxdayada",
      description: "Baro injineerada, naqshadeeyayaasha iyo khubarada ka dambeeya Hangool.",
    },
    news: {
      title: "Wararka & Maqaallada",
      description: "Warar, xogta mashaariicda iyo talooyin hanti ma-guurto oo ka yimid Hangool.",
    },
    careers: {
      title: "Shaqooyin",
      description: "Shaqooyinka bannaan ee Hangool Construction & Real Estate ee Somaliland.",
    },
    contact: {
      title: "Nala Soo Xiriir",
      description:
        "Hangool ka wac, kala xiriir WhatsApp ama iimayl ugu dir mashruucaaga dhismaha ama hantida ma-guurtada ee Somaliland.",
    },
    quote: {
      title: "Codso Qiimeyn",
      description:
        "Codso qiimeyn bilaash ah oo mashruucaaga dhismaha, dayactirka ama hantida ma-guurtada ee Somaliland.",
    },
    property: { title: "Hanti", description: "Faahfaahinta hantida ee Hangool Real Estate." },
    project: { title: "Mashruuc", description: "Faahfaahinta mashruuca ee Hangool Construction." },
    post: { title: "Maqaal", description: "Warar ka yimid Hangool Construction & Real Estate." },
  },
};
