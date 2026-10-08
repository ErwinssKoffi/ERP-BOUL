import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP-BOUL - Gestion Boulangerie & Pâtisserie",
  description: "ERP complet pour boulangeries-pâtisseries artisanales : gestion de production et fournées, stocks d'ingrédients, caisse tactile POS, commandes spéciales et rentabilité.",
  openGraph: {
    title: "ERP-BOUL - Gestion Boulangerie & Pâtisserie",
    description: "ERP complet pour boulangeries-pâtisseries artisanales : gestion de production et fournées, stocks d'ingrédients, caisse tactile POS, commandes spéciales et rentabilité.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
