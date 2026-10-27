import type { Metadata } from "next";
import AkustikPage from "@/components/akustik/AkustikPage";

export const metadata: Metadata = {
  title: "Akustični zidni paneli — drvene lamele na filcu | Baudecor",
  description: "Akustični paneli od drvenih lamela na crnom filcu: serije Klasik, Premium i Flex u drvenim, jednobojnim i metalik tonovima. Upijaju odjek do klase A. Salon u Ulcinju.",
};

export default function AkustikDuvarPaneliPage() {
  return <AkustikPage />;
}
