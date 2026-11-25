import residence from "./src/assets/residence.webp";
import commercial from "./src/assets/commercial.webp";
import interior from "./src/assets/interior.webp";
import construction from "./src/assets/construction.webp";
export const company = {
  name: "Hangool Construction & Real Estate",
  location: "Hargeisa, Somaliland",
  // All contact details live here; every page reads them from this object.
  phone: "+252 63 6378888",
  phoneHref: "tel:+252636378888",
  whatsapp: "+252 63 6378888",
  whatsappUrl: "https://wa.me/252636378888",
  email: "info@hangooldevelopment.com",
  emailHref: "mailto:info@hangooldevelopment.com",
  // Suggested figures for Admin → Settings. They are NOT shown on the site until the
  // owner confirms them there (no unconfirmed company information is published).
  suggestedStats: { years: 10, projects: 50, clients: 100, professionals: 30 },
  socials: [
    { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61596598676776" },
    { name: "TikTok", url: "https://www.tiktok.com/@hangooldevelopment" },
    { name: "Instagram", url: "https://www.instagram.com/hangooldevelopment/" },
    { name: "YouTube", url: "https://www.youtube.com/@HANGOOLDevelopment" },
  ],
};
export const images = { residence, commercial, interior, construction };

// Built-in gallery photos (the former "Media & Updates" page). Shown in the Gallery
// until the admin adds gallery items in the dashboard. Captions live in src/i18n.
export const bundledGallery = [
  { image: residence, key: "home" as const },
  { image: interior, key: "detail" as const },
  { image: construction, key: "ambition" as const },
];
