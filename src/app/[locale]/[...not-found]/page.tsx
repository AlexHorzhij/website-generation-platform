import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
    "not-found": ["404"],
  }));
}

const page = () => {
  notFound();
};

export default page;
