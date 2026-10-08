export type CategoryType = 'Boulangerie' | 'Viennoiserie' | 'Pâtisserie' | 'Snacking' | 'Boissons';

export interface IngredientRecipeItem {
  id: string;
  name: string;
  stockItemId?: string;
  bakerPercentage: number; // e.g. Flour is 100%, Water 68%, Salt 1.8%, Yeast 1.2%
  quantityGramsPerPiece: number;
  unit: string;
  costPerUnit: number; // Cost per kg or unit
}

export interface RecipeStep {
  step: string;
  durationMin: number;
  temperatureC?: number;
  description: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: CategoryType;
  portionYield: number; // Pieces produced per standard batch
  unitWeightGrams: number; // e.g. 250g baguette dough
  flourBaseKg: number;
  baseTempTarget?: number; // Température de base (Farine + Fournil + Eau = 54-56°C)
  bakingTempC: number;
  bakingDurationMin: number;
  costPricePerPiece: number;
  sellingPrice: number;
  ingredients: IngredientRecipeItem[];
  steps: RecipeStep[];
  allergens: string[];
}

export type BatchStatus = 'PLANIFIE' | 'PETRISSAGE' | 'POUSSE' | 'FOUR' | 'TERMINE';

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  recipeId: string;
  recipeName: string;
  category: CategoryType;
  plannedPieces: number;
  actualPieces?: number;
  status: BatchStatus;
  scheduledTime: string;
  bakerName: string;
  ovenNumber: number;
  notes?: string;
  createdAt: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: 'Farines' | 'Matières Grasses' | 'Levures & Levains' | 'Chocolat & Pâtisserie' | 'Emballages & Consommables';
  quantity: number;
  unit: 'kg' | 'L' | 'unités' | 'sacs 25kg';
  minAlertThreshold: number;
  costPerUnit: number; // €
  supplierName: string;
  lotNumber: string;
  dluoDate: string; // YYYY-MM-DD
  lastRestocked: string;
}

export interface POSProduct {
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  vatRate: 5.5 | 10 | 20;
  recipeId?: string;
  stockToday: number;
  badge?: string;
  allergens: string[];
}

export interface CartItem {
  product: POSProduct;
  quantity: number;
  discountPct?: number;
}

export type OrderStatus = 'CONFIRME' | 'EN_PREPARATION' | 'PRET' | 'RETIRE' | 'ANNULE';

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupDate: string;
  pickupTime: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  depositPaid: number; // Acompte versé
  status: OrderStatus;
  notes?: string;
  customDesignDetails?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  specialty: string;
  contactPerson: string;
  phone: string;
  email: string;
  leadTimeDays: number;
  minOrderEur: number;
}
