import { Site } from "@/types/site";

export const mockSites: Site[] = [
  {
    id: 198,
    siteName: "Agrippa товари ручної роботи",
    domainName: "6.mpcrm.click",
    folder: "folder223",
    region: "Україна",
    subregions: "Київська обл.",
    currency: "UAH",
    language: "Ukrainian",
    owner: { id: 1, username: "oleksandr_r", role: "ADMIN" },
    status: "live",
    autogeneration: false,
    autogenPerDay: 3000,
  },
  {
    id: 196,
    siteName: "Digital Learn",
    domainName: "tutorscoach.com",
    folder: "math",
    region: "Ukraine",
    subregions: "Lviv",
    currency: "UAH",
    language: "English",
    owner: { id: 2, username: "SashaChun", role: "USER" },
    status: "live",
    autogeneration: false,
    autogenPerDay: 3000,
  },
];
