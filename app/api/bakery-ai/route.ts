import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, prompt, recipeParams } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      let systemPrompt = `Tu es un Maître Artisan Boulanger et Pâtissier Compagnon du Devoir, expert en gestion d'ERP de boulangerie (calcul des pourcentages du boulanger, températures de base, hydratation, coûts matières et organisation du fournil). Réponds en français clair, précis et professionnel.`;

      let userMessage = "";
      if (action === "create_recipe") {
        userMessage = `Crée une fiche technique complète pour le produit suivant: "${recipeParams?.name || prompt}".
Catégorie: ${recipeParams?.category || "Boulangerie"}.
Rendement souhaité: ${recipeParams?.yieldPieces || 50} pièces.
Donne:
1. Poids unitaire du pâton
2. Température de base recommandée (TB) et température de pâte
3. Liste détaillée des ingrédients avec leur % du boulanger (farine = 100%) et grammage total
4. Étapes clés de fabrication (Frasage, Pétrissage, Pointage, Façonnage, Apprêt, Cuisson °C et durée)
5. Conseils d'expert pour maximiser le croustillant ou le moelleux
6. Estimation du coût matière unitaire.
Formate en JSON avec les clés : name, category, portionYield, unitWeightGrams, bakingTempC, bakingDurationMin, costPricePerPiece, sellingPrice, allergens (array de strings), ingredients (array de {name, bakerPercentage, quantityGramsPerPiece, unit}), steps (array de {step, durationMin, description}), expertAdvice.`;
      } else if (action === "optimize_weather") {
        userMessage = `Voici les prévisions du jour : ${prompt}. En tant que chef boulanger, donne 4 recommandations concrètes pour ajuster les fournées, l'hydratation de la pâte, la gestion de l'étuve et les quantités de viennoiserie/snacking à préparer.`;
      } else {
        userMessage = prompt || "Donne un conseil d'optimisation pour réduire le gaspillage de pain en fin de journée.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemPrompt}\n\n${userMessage}`,
      });

      return NextResponse.json({
        success: true,
        text: response.text || "Conseil généré avec succès.",
      });
    }

    // Fallback if no API key is provided: Artisan Bakery Heuristic Engine
    if (action === "create_recipe") {
      const name = recipeParams?.name || "Pain Spécial Céréales Rustique";
      const category = recipeParams?.category || "Boulangerie";
      const pieces = Number(recipeParams?.yieldPieces) || 40;

      const fallbackRecipe = {
        name,
        category,
        portionYield: pieces,
        unitWeightGrams: 450,
        bakingTempC: 240,
        bakingDurationMin: 28,
        costPricePerPiece: 0.52,
        sellingPrice: 2.90,
        allergens: ["Gluten", "Graines de sésame"],
        ingredients: [
          { name: "Farine T65 Tradition", bakerPercentage: 70, quantityGramsPerPiece: 175, unit: "kg" },
          { name: "Farine Seigle T130", bakerPercentage: 30, quantityGramsPerPiece: 75, unit: "kg" },
          { name: "Eau filtrée (T° coulée)", bakerPercentage: 72, quantityGramsPerPiece: 180, unit: "L" },
          { name: "Mélange 5 graines torréfiées (Lin, Tournesol, Sésame, Courge, Millet)", bakerPercentage: 15, quantityGramsPerPiece: 38, unit: "kg" },
          { name: "Sel de mer de Guérande", bakerPercentage: 1.8, quantityGramsPerPiece: 4.5, unit: "kg" },
          { name: "Levain naturel rafraîchi", bakerPercentage: 20, quantityGramsPerPiece: 50, unit: "kg" },
          { name: "Levure biologique", bakerPercentage: 0.4, quantityGramsPerPiece: 1.0, unit: "kg" },
        ],
        steps: [
          { step: "Autolyse des farines", durationMin: 45, description: "Mélange farines + eau à 20°C pour développer l extensibilité." },
          { step: "Pétrissage & incorporation des graines", durationMin: 12, description: "Ajout sel, levain et graines en fin de pétrissage pour ne pas déchirer le réseau." },
          { step: "Pointage en bac", durationMin: 90, description: "2 rabats à 30 et 60 min. T° pâte finie: 24.5°C." },
          { step: "Division & Façonnage bâtard", durationMin: 20, description: "Façonnage doux avec roulage dans les graines." },
          { step: "Apprêt sur couche", durationMin: 60, description: "À température ambiante (21°C) ou blocage froid 12h à 8°C." },
          { step: "Cuisson four à soles", durationMin: 28, description: "Enfournement à 240°C avec forte buée, tirage des ouras à mi-cuisson." },
        ],
        expertAdvice: "Trempez les graines dans 10% d'eau tiède 2h avant le pétrissage pour éviter qu'elles n'absorbent l'eau de la pâte pendant le pointage !",
      };

      return NextResponse.json({
        success: true,
        text: JSON.stringify(fallbackRecipe, null, 2),
        fallback: true,
      });
    }

    if (action === "optimize_weather") {
      return NextResponse.json({
        success: true,
        text: `📊 Analyse Météo & Fournil :
1. Température de l'eau : Abaissez la température de coulée de 2°C pour compenser la chaleur ambiante et viser une pâte à 24°C.
2. Hydratation : Maintenez à 70% pour préserver l'alvéolage sans risquer le relâchement au façonnage.
3. Viennoiserie : Si temps humide ou pluvieux, augmentez la production de sandwichs chauds et quiches de +15%.
4. Cuisson : Prolongez la cuisson des baguettes de 2 minutes pour assurer un croustillant durable face à l'humidité de l'air.`,
        fallback: true,
      });
    }

    return NextResponse.json({
      success: true,
      text: "Astuce Fournil : En cas d'invendus de baguettes, valorisez-les en chapelure artisanale pour panure ou en croûtons dorés à l'ail pour les soupes de saison, marge brute de 88%.",
      fallback: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
