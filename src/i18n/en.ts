// English dictionary — the source of truth for all public-site text.
// src/i18n/so.ts must mirror this file exactly (same keys, same array lengths);
// src/test/i18n.test.ts checks that.

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

const dict = {
  meta: { langName: "English", short: "EN", switchLabel: "Language" },
  nav: {
    home: "Home",
    about: "About",
    aboutUs: "About Us",
    team: "Our Team",
    careers: "Careers",
    services: "Services",
    ourServices: "Our Services",
    construction: "Construction Department",
    realEstate: "Real Estate Department",
    projects: "Projects",
    ourProjects: "Our Projects",
    gallery: "Gallery",
    news: "News & Blog",
    contact: "Contact Us",
    quote: "Request a Quote",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    home_aria: "Hangool home",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
  },
  common: {
    location: "Hargeisa, Somaliland",
    viewDetails: "View details",
    viewAll: "View all",
    readMore: "Read more",
    back: "Back",
    loading: "Loading…",
    all: "All",
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
    photo: "Photo {n}",
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    talkWhatsApp: "Talk to us on WhatsApp",
    chatWhatsApp: "Chat with Hangool on WhatsApp (opens in a new tab)",
    whatsappTitle: "Let's talk on WhatsApp",
    onSocial: "Hangool on {name} (opens in a new tab)",
    comingSoon: "Coming soon",
    offline:
      "We couldn't load the latest content right now. Please try again later, or contact us on WhatsApp.",
    notFoundTitle: "We couldn't find that page.",
    notFoundText: "It may have been removed or is no longer published.",
    goHome: "Go to the home page",
  },
  footer: {
    description:
      "Hangool Development builds homes, commercial buildings and real estate across Somaliland — from design and planning to construction and handover, delivered with quality, transparency and on time.",
    explore: "Explore",
    getInTouch: "Get in touch",
    stayConnected: "Stay connected",
    rights: "All rights reserved.",
    tagline: "Built with ambition. Grounded in integrity.",
    admin: "Admin",
  },
  cta: {
    eyebrow: "Let's build something lasting",
    title: "Have a project in mind? Let’s talk.",
    copy: "Your ambition. Our craftsmanship. A better future, together.",
  },
  home: {
    eyebrow: "Rooted in heritage. Built for tomorrow.",
    line1: "Building Hargeisa’s",
    line2: "future.",
    line2accent: "Together.",
    copy1: "Thoughtfully designed homes. Lasting developments.",
    copy2: "Built with ambition, honesty, and care.",
    viewProjects: "View Our Projects",
    discover: "Discover Hangool",
    heroAlt: "Modern residence with open terraces, a landscaped garden, and warm evening lighting",
    statsLabel: "Company statistics",
    stats: {
      years: "Years of experience",
      projects: "Projects delivered",
      clients: "Happy clients",
      professionals: "Skilled professionals",
    },
    deptEyebrow: "Two departments, one standard",
    deptTitle: "Construction and real estate under one roof.",
    whatEyebrow: "What we build",
    whatTitle: "Your vision. Our expertise.",
    whatCopy:
      "From a family’s first home to a business’s next chapter, we build spaces that move you forward.",
    exploreServices: "Explore all services",
    workEyebrow: "Our work",
    workTitle: "Spaces with purpose.",
    viewAllProjects: "View all projects",
    propsEyebrow: "Real estate",
    propsTitle: "Find your next property.",
    viewAllProperties: "Browse properties",
    diffEyebrow: "The Hangool difference",
    diffTitle1: "Strong foundations.",
    diffTitle2: "Stronger commitments.",
    diffCopy:
      "A building is more than walls and a roof. It’s a promise to the people who will live, work, and grow inside it.",
    diffAlt: "Architectural plans and materials prepared for a new building",
    meet: "Meet Hangool",
    reasons: [
      { title: "Quality without compromise", text: "Reliable materials and care in every detail." },
      { title: "Respect for your time", text: "Clear planning. Consistent communication." },
      { title: "People who know their craft", text: "An experienced team with a shared ambition." },
      { title: "Safety comes first", text: "Responsible building, from the ground up." },
    ],
  },
  about: {
    eyebrow: "Our story",
    title: "Every goal needs a home.",
    description:
      "We build with ambition, honesty, and care — from the first plan to the final key.",
    imageAlt: "A thoughtfully designed contemporary home",
    aboutEyebrow: "About Hangool",
    aboutTitle1: "Somali heritage.",
    aboutTitle2: "Modern craftsmanship.",
    story:
      "Hangool Construction & Real Estate builds thoughtfully designed homes and commercial developments rooted in Somali heritage and modern craftsmanship. Dedicated to families and businesses building their future, we blend cultural authenticity with enduring structural quality to create spaces that thrive for generations.",
    missionTitle: "Our mission",
    mission:
      "To deliver well-built, reliable homes and developments through transparent, honest communication, fair dealing, and deep respect for every client and community we build for.",
    visionTitle: "Our vision",
    vision:
      "To be a trusted, leading name in Somali construction and real estate — shaping vibrant communities and building lasting places that families are genuinely proud to call home.",
    valuesEyebrow: "What guides us",
    valuesTitle: "Values that hold us together.",
    values: ["Ambition", "Purpose", "Integrity", "Craftsmanship", "Pride in Somali heritage"],
    teamEyebrow: "Our people",
    teamTitle: "The team behind the promise.",
    teamLink: "Meet our team",
    careersLink: "Join us",
  },
  services: {
    eyebrow: "Our expertise",
    title: "Built around your ambition.",
    description:
      "A complete approach to construction and real estate — thoughtful planning, reliable delivery, and care in every finish.",
    deptEyebrow: "Our departments",
    deptTitle: "Two departments. One promise.",
    construction: {
      title: "Construction Department",
      text: "Residential, commercial, industrial and road construction, with design, engineering and project management.",
    },
    realEstate: {
      title: "Real Estate Department",
      text: "Homes, apartments, villas and land for sale or rent, plus property management and development.",
    },
    explore: "Explore the department",
    listEyebrow: "Our services",
    workWithYou:
      "We work closely with you to understand your goals, agree a clear plan, and deliver with care.",
    items: [
      {
        title: "Residential Construction",
        short: "Thoughtfully built homes, made for the way you live.",
        includes: [
          "New homes and villas",
          "Structural and civil works",
          "Complete finishing and handover",
        ],
      },
      {
        title: "Commercial Buildings",
        short: "Practical, lasting spaces that help your business grow.",
        includes: [
          "Offices and retail spaces",
          "Commercial developments",
          "Building infrastructure",
        ],
      },
      {
        title: "Renovation & Finishing",
        short: "A fresh perspective. A higher standard of finish.",
        includes: [
          "Interior and exterior renovation",
          "Flooring, painting and joinery",
          "Kitchen and bathroom finishing",
        ],
      },
      {
        title: "Project Management",
        short: "From the first plan to the final key, we take care of the details.",
        includes: [
          "Planning and coordination",
          "Budget and schedule management",
          "Quality and site supervision",
        ],
      },
      {
        title: "Building Materials Supply",
        short: "Reliable materials. A solid foundation for every build.",
        includes: ["Construction materials sourcing", "Quality checks", "Site supply coordination"],
      },
    ],
  },
  construction: {
    eyebrow: "Construction Department",
    title: "From the ground up, built to last.",
    description:
      "One team for design, engineering and construction — so every project is planned clearly and delivered with care.",
    listTitle: "What we build",
    items: [
      {
        title: "Residential Construction",
        text: "Family homes, villas and apartment buildings, built to a high standard from foundation to finish.",
      },
      {
        title: "Commercial Construction",
        text: "Offices, shops, hotels and mixed-use buildings designed for daily business.",
      },
      {
        title: "Industrial Construction",
        text: "Warehouses, workshops and industrial facilities with strong, practical structures.",
      },
      {
        title: "Road Construction",
        text: "Access roads, paving and site infrastructure that connect people and places.",
      },
      {
        title: "Architectural Design",
        text: "Plans, 3D designs and drawings that turn your ideas into a buildable design.",
      },
      {
        title: "Engineering Services",
        text: "Structural and civil engineering, surveys and technical drawings.",
      },
      {
        title: "Project Management",
        text: "Planning, budgets, schedules and site supervision from start to handover.",
      },
      {
        title: "Renovation & Maintenance",
        text: "Upgrades, repairs and finishing work that bring buildings back to life.",
      },
      {
        title: "Construction Consultancy",
        text: "Expert advice on costs, materials, permits and the right way to build.",
      },
    ],
    processEyebrow: "How we work",
    processTitle: "A clear path from idea to handover.",
    steps: [
      { title: "Listen", text: "We start with your goals, budget and site." },
      { title: "Design", text: "Plans and drawings you can review and approve." },
      { title: "Build", text: "Quality materials, safe sites and regular updates." },
      { title: "Hand over", text: "A finished building, checked and ready to use." },
    ],
  },
  realEstate: {
    eyebrow: "Real Estate Department",
    title: "The right property, with people you trust.",
    description:
      "Homes, apartments, villas, land and commercial spaces — to buy, rent, manage or develop.",
    listTitle: "Our real estate services",
    items: [
      {
        title: "Properties for Sale",
        text: "Homes and buildings ready to buy, with clear details and fair prices.",
      },
      {
        title: "Properties for Rent",
        text: "Homes, apartments and commercial spaces available to rent.",
      },
      { title: "Land for Sale", text: "Plots for homes, businesses and new developments." },
      { title: "Residential Properties", text: "Houses and family homes in good locations." },
      { title: "Commercial Properties", text: "Shops, offices and business premises." },
      { title: "Apartments", text: "Modern apartments for families and professionals." },
      { title: "Villas", text: "Spacious villas with quality finishes." },
      {
        title: "Property Management",
        text: "We look after your property, tenants and maintenance.",
      },
      {
        title: "Real Estate Development",
        text: "Planning and building new residential and commercial developments.",
      },
    ],
    listingsEyebrow: "Available properties",
    listingsTitle: "Find your next property.",
  },
  search: {
    title: "Search properties",
    location: "Location",
    anyLocation: "Any location",
    type: "Property type",
    anyType: "Any type",
    deal: "For sale or rent",
    anyDeal: "Sale or rent",
    minPrice: "Min price (USD)",
    maxPrice: "Max price (USD)",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    minSize: "Min size (m²)",
    any: "Any",
    availability: "Availability",
    anyAvailability: "Any",
    reset: "Clear filters",
    results: "{n} properties found",
    noResults: "No properties match your search. Try clearing some filters.",
    emptyTitle: "Property listings are coming soon.",
    emptyText:
      "We're preparing our first listings. Contact us on WhatsApp to tell us what you're looking for.",
  },
  property: {
    types: {
      apartment: "Apartment",
      villa: "Villa",
      house: "House",
      land: "Land",
      commercial: "Commercial",
      office: "Office",
    },
    deal: { sale: "For sale", rent: "For rent" },
    availability: {
      available: "Available",
      reserved: "Reserved",
      sold: "Sold",
      rented: "Rented",
      unavailable: "Unavailable",
    },
    perMonth: "/ month",
    priceOnRequest: "Price on request",
    beds: "{n} bedrooms",
    baths: "{n} bathrooms",
    size: "{n} m²",
    sizeLabel: "Size",
    details: "Property details",
    price: "Price",
    description: "Description",
    back: "Back to properties",
    interested: "Interested in this property?",
    askWhatsApp: "Ask on WhatsApp",
    whatsappText: "Hello Hangool, I'm interested in this property: {name}",
    viewingTitle: "Request a viewing",
    viewingText: "Choose a day that suits you and we'll call you to confirm.",
    preferredDate: "Preferred date",
    viewingSuccess:
      "Thank you. Your viewing request has been sent. We'll call you to confirm the time.",
  },
  projects: {
    eyebrow: "Our portfolio",
    title: "Spaces with purpose.",
    description:
      "Homes for families. Places for businesses. A lasting foundation for the next chapter.",
    status: "Status",
    category: "Category",
    allStatuses: "All statuses",
    allCategories: "All categories",
    statuses: { completed: "Completed", ongoing: "Ongoing", upcoming: "Upcoming" },
    categories: {
      residential: "Residential",
      commercial: "Commercial",
      industrial: "Industrial",
      road: "Road",
      renovation: "Renovation",
      other: "Other",
    },
    emptyTitle: "Our project portfolio is coming soon.",
    emptyText: "We're adding photos and details of our completed and ongoing work.",
    noResults: "No projects match these filters.",
    back: "Back to projects",
    started: "Started",
    finished: "Finished",
    expected: "Expected completion",
    photos: "Photos",
    videos: "Videos",
    watchVideo: "Watch video",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Behind every build, a story.",
    description:
      "From ideas on paper to the details on site. A look at our work, our people, and the places we create.",
    categories: {
      completed: "Completed Projects",
      ongoing: "Ongoing Projects",
      construction: "Construction",
      realEstate: "Real Estate",
      engineering: "Engineering & Architecture",
      equipment: "Equipment & Machinery",
      events: "Company Events",
      video: "Video",
    },
    bundled: {
      home: {
        title: "A place to call home",
        caption: "Thoughtful design, from the first plan to the final key.",
      },
      detail: {
        title: "Built on attention to detail",
        caption: "A closer look at the craftsmanship behind every finish.",
      },
      ambition: {
        title: "The ambition behind the build",
        caption: "Our work begins with a clear plan and a shared goal.",
      },
    },
    empty: "No photos in this category yet.",
    openPhoto: "Open photo",
    stayTitle: "Stay close to what’s next.",
    stayText: "Find Hangool on Facebook, Instagram, TikTok, and YouTube.",
  },
  team: {
    eyebrow: "Our people",
    title: "The team behind the promise.",
    description:
      "Engineers, architects, project managers and real estate specialists working together.",
    emptyTitle: "Our team profiles are coming soon.",
    emptyText: "We're preparing introductions to the people behind Hangool.",
  },
  news: {
    eyebrow: "News & Blog",
    title: "News from Hangool.",
    description: "Company news, project updates and advice on building and buying property.",
    emptyTitle: "No articles yet.",
    emptyText:
      "News and blog posts will appear here soon. Follow us on social media for the latest updates.",
    back: "Back to news",
  },
  careers: {
    eyebrow: "Careers",
    title: "Build your career with Hangool.",
    description:
      "We're always glad to meet engineers, architects, site staff and real estate professionals.",
    emptyTitle: "No open positions right now.",
    emptyText: "New jobs will be posted here. You can still send your CV to {email}.",
    deadline: "Apply by {date}",
    apply: "How to apply",
    applyText: "Send your CV and a short message to {email}, with the job title in the subject.",
    applyEmail: "Apply by email",
    types: {
      full_time: "Full time",
      part_time: "Part time",
      contract: "Contract",
      internship: "Internship",
    },
  },
  contact: {
    eyebrow: "Let's talk",
    title: "Your next chapter starts here.",
    description:
      "Tell us what you have in mind. A family home, a commercial space, a new beginning — we’re ready to listen.",
    formTitle: "Send us a message.",
    formText: "We usually reply within one working day.",
    asideTitle: "A conversation. A beginning.",
    callUs: "Call us",
    emailUs: "Email us",
    follow: "Follow us",
    findUs: "Find us",
    mapTitle: "Hangool office location",
    openMap: "Open in Google Maps",
    success: "Thank you. Your message has been sent. We'll get back to you soon.",
  },
  quote: {
    eyebrow: "Request a quote",
    title: "Tell us about your project.",
    description: "Share a few details and our team will prepare a quote for you.",
    formTitle: "Request a quote.",
    formText: "A few details about you and your project.",
    serviceType: "Service type",
    selectService: "Select a service",
    location: "Project location",
    budget: "Budget range",
    selectBudget: "Select a budget range",
    budgets: [
      "Under $10,000",
      "$10,000 – $50,000",
      "$50,000 – $150,000",
      "$150,000 – $500,000",
      "Over $500,000",
      "Not sure yet",
    ],
    other: "Other",
    success: "Thank you. Your quote request has been sent. Our team will contact you soon.",
    asideTitle: "What happens next?",
    steps: [
      "We review your request, usually within one working day.",
      "We call you to understand your project and site.",
      "You receive a clear, itemised quote.",
    ],
  },
  form: {
    name: "Your name",
    namePlaceholder: "Full name",
    phone: "Phone number",
    phonePlaceholder: "e.g. +252 63 1234567",
    email: "Email (optional)",
    emailPlaceholder: "you@example.com",
    message: "Message",
    messagePlaceholder: "How can we help?",
    projectMessage: "Tell us about your project",
    projectPlaceholder: "What would you like to build?",
    send: "Send message",
    sendQuote: "Send quote request",
    sendViewing: "Request viewing",
    sending: "Sending…",
    required: "Please fill in this field.",
    invalidPhone: "Please enter a valid phone number.",
    invalidEmail: "Please enter a valid email address.",
    error: "Your message could not be sent. Please try again, or contact us on WhatsApp.",
    tooFast: "Please take a moment to check your details, then send again.",
    waContact: "Hello Hangool,",
    waQuote: "Hello Hangool, I would like a quote.",
  },
  seo: {
    home: {
      title: "Building Hargeisa’s Future",
      description:
        "Hangool Construction & Real Estate builds homes and commercial buildings and sells and rents property across Somaliland.",
    },
    about: {
      title: "About Us",
      description:
        "Discover Hangool’s story, mission, and commitment to Somali heritage, integrity, and lasting craftsmanship.",
    },
    services: {
      title: "Our Services",
      description:
        "Construction and real estate services in Somaliland: building, design, engineering, project management, sales, rentals and property management.",
    },
    construction: {
      title: "Construction Department",
      description:
        "Residential, commercial, industrial and road construction, architectural design, engineering and project management in Somaliland.",
    },
    realEstate: {
      title: "Real Estate Department",
      description:
        "Properties, land, apartments and villas for sale and rent in Somaliland, plus property management and development.",
    },
    projects: {
      title: "Our Projects",
      description:
        "Completed, ongoing and upcoming construction projects by Hangool in Somaliland.",
    },
    gallery: {
      title: "Gallery",
      description:
        "Photos and videos of Hangool projects, construction sites, equipment and company events.",
    },
    team: {
      title: "Our Team",
      description: "Meet the engineers, architects and specialists behind Hangool.",
    },
    news: {
      title: "News & Blog",
      description: "News, project updates and property advice from Hangool.",
    },
    careers: {
      title: "Careers",
      description: "Job openings at Hangool Construction & Real Estate in Somaliland.",
    },
    contact: {
      title: "Contact Us",
      description:
        "Call, WhatsApp or email Hangool about your construction or real estate project in Somaliland.",
    },
    quote: {
      title: "Request a Quote",
      description:
        "Request a free quote for your construction, renovation or real estate project in Somaliland.",
    },
    property: { title: "Property", description: "Property details from Hangool Real Estate." },
    project: { title: "Project", description: "Project details from Hangool Construction." },
    post: { title: "Article", description: "News from Hangool Construction & Real Estate." },
  },
};

export type Dictionary = Widen<typeof dict>;
export const en: Dictionary = dict;
