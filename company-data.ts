import residence from "./src/assets/residence.webp";
import commercial from "./src/assets/commercial.webp";
import interior from "./src/assets/interior.webp";
import construction from "./src/assets/construction.webp";
export const company = {
  name: "Hangool Construction & Real Estate",
  location: "Hargeisa, Somaliland",
  phone: "[PHONE NUMBER]",
  whatsapp: "[WHATSAPP NUMBER]",
  email: "[EMAIL ADDRESS]",
  address: "[OFFICE ADDRESS], Hargeisa, Somaliland",
  hours: "[WORKING HOURS]",
  story:
    "Hangool Construction & Real Estate builds thoughtfully designed homes and commercial developments rooted in Somali heritage and modern craftsmanship. Dedicated to families and businesses building their future, we blend cultural authenticity with enduring structural quality to create spaces that thrive for generations.",
  mission:
    "To deliver well-built, reliable homes and developments through transparent, honest communication, fair dealing, and deep respect for every client and community we build for.",
  vision:
    "To be a trusted, leading name in Somali construction and real estate — shaping vibrant communities and building lasting places that families are genuinely proud to call home.",
  stats: [
    { value: "10+", label: "Years of experience" },
    { value: "50+", label: "Projects delivered" },
    { value: "100+", label: "Happy clients" },
    { value: "30+", label: "Skilled professionals" },
  ],
  values: ["Ambition", "Purpose", "Integrity", "Craftsmanship", "Pride in Somali heritage"],
  socials: [
    { name: "Facebook", url: "[FACEBOOK URL]" },
    { name: "Instagram", url: "[INSTAGRAM URL]" },
    { name: "TikTok", url: "[TIKTOK URL]" },
    { name: "YouTube", url: "[YOUTUBE URL]" },
  ],
  team: [
    { name: "[TEAM MEMBER NAME]", role: "Managing Director" },
    { name: "[TEAM MEMBER NAME]", role: "Lead Engineer" },
    { name: "[TEAM MEMBER NAME]", role: "Project Manager" },
  ],
  milestones: [
    {
      year: "[YEAR]",
      title: "Our beginning",
      text: "A shared ambition to build better homes and stronger communities.",
    },
    {
      year: "[YEAR]",
      title: "Our first development",
      text: "Turning an idea into a place to call home.",
    },
    {
      year: "[YEAR]",
      title: "Building forward",
      text: "Growing our team and our commitment to quality.",
    },
  ],
};
export const images = { residence, commercial, interior, construction };
export const services = [
  {
    title: "Residential Construction",
    short: "Thoughtfully built homes, made for the way you live.",
    image: residence,
    includes: [
      "New homes and villas",
      "Structural and civil works",
      "Complete finishing and handover",
    ],
  },
  {
    title: "Commercial Buildings",
    short: "Practical, lasting spaces that help your business grow.",
    image: commercial,
    includes: ["Offices and retail spaces", "Commercial developments", "Building infrastructure"],
  },
  {
    title: "Renovation & Finishing",
    short: "A fresh perspective. A higher standard of finish.",
    image: interior,
    includes: [
      "Interior and exterior renovation",
      "Flooring, painting and joinery",
      "Kitchen and bathroom finishing",
    ],
  },
  {
    title: "Project Management",
    short: "From the first plan to the final key, we take care of the details.",
    image: construction,
    includes: [
      "Planning and coordination",
      "Budget and schedule management",
      "Quality and site supervision",
    ],
  },
  {
    title: "Building Materials Supply",
    short: "Reliable materials. A solid foundation for every build.",
    image: construction,
    includes: ["Construction materials sourcing", "Quality checks", "Site supply coordination"],
  },
];
export const projects = [
  {
    id: 1,
    name: "Modern Family Residence",
    category: "Residential",
    location: "Hargeisa, Somaliland",
    year: "[PROJECT YEAR]",
    image: residence,
    gallery: [residence, interior],
    description:
      "A contemporary family home with open living spaces, generous natural light, and carefully considered finishes. Sample project — replace with a completed Hangool project.",
  },
  {
    id: 2,
    name: "City Centre Offices",
    category: "Commercial",
    location: "Hargeisa, Somaliland",
    year: "[PROJECT YEAR]",
    image: commercial,
    gallery: [commercial, construction],
    description:
      "A flexible commercial building designed around the needs of growing businesses. Sample project — replace with a completed Hangool project.",
  },
  {
    id: 3,
    name: "Contemporary Living Spaces",
    category: "Renovation",
    location: "Hargeisa, Somaliland",
    year: "[PROJECT YEAR]",
    image: interior,
    gallery: [interior, residence],
    description:
      "A welcoming interior with thoughtful details, quality materials, and a timeless finish. Sample project — replace with a completed Hangool project.",
  },
  {
    id: 4,
    name: "Courtyard Villa",
    category: "Residential",
    location: "Hargeisa, Somaliland",
    year: "[PROJECT YEAR]",
    image: residence,
    gallery: [residence, interior],
    description:
      "A family-focused villa bringing indoor comfort and outdoor living together. Sample project — replace with a completed Hangool project.",
  },
];
export type Project = (typeof projects)[number];
export const updates = [
  {
    title: "A place to call home",
    caption: "Thoughtful design, from the first plan to the final key.",
    date: "[POST DATE]",
    image: residence,
  },
  {
    title: "Built on attention to detail",
    caption: "A closer look at the craftsmanship behind every finish.",
    date: "[POST DATE]",
    image: interior,
  },
  {
    title: "The ambition behind the build",
    caption: "Our work begins with a clear plan and a shared goal.",
    date: "[POST DATE]",
    image: construction,
  },
];
