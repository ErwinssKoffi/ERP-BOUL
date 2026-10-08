import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP-BOUL",
  description: "ERP Intelligent pour Boulangeries Ivoiriennes — Système d'exploitation complet : Achats, Stocks, Recettes, Production, POS, Finance, Fiscalité FNE et Pilotage.",
  openGraph: {
    title: "ERP-BOUL",
    description: "ERP Intelligent pour Boulangeries Ivoiriennes — Système d'exploitation complet : Achats, Stocks, Recettes, Production, POS, Finance, Fiscalité FNE et Pilotage.",
    type: "website",
    locale: "fr_CI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-[#090a0f] text-gray-100 antialiased selection:bg-amber-500/20 selection:text-amber-300 font-sans">
        {children}
      </body>
    </html>
  );
}
