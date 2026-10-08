'use client';

import React, { useState } from 'react';
import { Header, NavTab } from '@/components/Header';
import { DashboardOverview } from '@/components/DashboardOverview';
import { ProductionBakehouse } from '@/components/ProductionBakehouse';
import { POSRegister } from '@/components/POSRegister';
import { CustomerOrdersManager } from '@/components/CustomerOrdersManager';
import { StockManager } from '@/components/StockManager';
import { SuppliersManager } from '@/components/SuppliersManager';
import { AnalyticsFinancials } from '@/components/AnalyticsFinancials';
import { DoughCalculatorModal } from '@/components/DoughCalculatorModal';
import { AiBakerAdvisorModal } from '@/components/AiBakerAdvisorModal';
import { RecipeModal } from '@/components/RecipeModal';

import {
  INITIAL_RECIPES,
  INITIAL_BATCHES,
  INITIAL_STOCKS,
  INITIAL_POS_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SUPPLIERS,
} from '@/lib/data';
import { Recipe, ProductionBatch, StockItem, POSProduct, CustomerOrder, CartItem, BatchStatus, OrderStatus } from '@/lib/types';

export default function BakeryERPPage() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [todayRevenue, setTodayRevenue] = useState<number>(642.30);
  const [wasteValue, setWasteValue] = useState<number>(14.50);

  // Core domain states
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [batches, setBatches] = useState<ProductionBatch[]>(INITIAL_BATCHES);
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [posProducts, setPosProducts] = useState<POSProduct[]>(INITIAL_POS_PRODUCTS);
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_ORDERS);
  const [suppliers] = useState(INITIAL_SUPPLIERS);

  // Modals state
  const [isDoughCalcOpen, setIsDoughCalcOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState<Recipe | null>(null);

  // Alerts counts
  const stockAlertsCount = stocks.filter((s) => s.quantity <= s.minAlertThreshold).length;
  const ordersPendingCount = orders.filter((o) => o.status === 'PRET' || o.status === 'EN_PREPARATION').length;

  // Handlers
  function handleSaleComplete(totalAmount: number, items: CartItem[], paymentMethod: string) {
    setTodayRevenue((prev) => Math.round((prev + totalAmount) * 100) / 100);

    // Reduce stock of flour/ingredients proportionally
    setStocks((prevStocks) =>
      prevStocks.map((stock) => {
        if (stock.category === 'Farines' && stock.quantity > 5) {
          return { ...stock, quantity: Math.max(0, Math.round((stock.quantity - items.length * 0.2) * 10) / 10) };
        }
        return stock;
      })
    );
  }

  function handleRecordWaste(productId: string, quantity: number, reason: string) {
    const product = posProducts.find((p) => p.id === productId);
    const lostValue = product ? product.price * quantity : 10;
    setWasteValue((prev) => Math.round((prev + lostValue) * 100) / 100);
  }

  function handleUpdateBatchStatus(batchId: string, newStatus: BatchStatus) {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: newStatus } : b))
    );
  }

  function handleAddBatch(batchData: Omit<ProductionBatch, 'id' | 'createdAt'>) {
    const newBatch: ProductionBatch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBatches((prev) => [newBatch, ...prev]);
  }

  function handleLaunchBatchFromRecipe(recipe: Recipe) {
    const newBatch: ProductionBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: `FOU-2026-${Math.floor(100 + Math.random() * 900)}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      category: recipe.category,
      plannedPieces: recipe.portionYield,
      status: 'PLANIFIE',
      scheduledTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      bakerName: 'Maxime (Chef Boulanger)',
      ovenNumber: 1,
      notes: `Fournée lancée depuis fiche technique (${recipe.portionYield} pcs).`,
      createdAt: new Date().toISOString(),
    };
    setBatches((prev) => [newBatch, ...prev]);
    setActiveTab('production');
  }

  function handleUpdateStockQuantity(id: string, delta: number) {
    setStocks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantity: Math.max(0, Math.round((s.quantity + delta) * 10) / 10) } : s))
    );
  }

  function handleAddStockItem(itemData: Omit<StockItem, 'id' | 'lastRestocked'>) {
    const newItem: StockItem = {
      ...itemData,
      id: `stk-${Date.now()}`,
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    setStocks((prev) => [...prev, newItem]);
  }

  function handleUpdateOrderStatus(orderId: string, newStatus: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }

  function handleAddOrder(orderData: Omit<CustomerOrder, 'id' | 'createdAt'>) {
    const newOrder: CustomerOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);

    // If deposit paid, increment today's cash
    if (orderData.depositPaid > 0) {
      setTodayRevenue((prev) => Math.round((prev + orderData.depositPaid) * 100) / 100);
    }
  }

  function handleAddRecipe(newRecipe: Recipe) {
    setRecipes((prev) => [newRecipe, ...prev]);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      
      {/* Main ERP Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openDoughCalc={() => setIsDoughCalcOpen(true)}
        openAiAdvisor={() => setIsAiAdvisorOpen(true)}
        stockAlertsCount={stockAlertsCount}
        ordersPendingCount={ordersPendingCount}
        todayRevenue={todayRevenue}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            todayRevenue={todayRevenue}
            batches={batches}
            orders={orders}
            stocks={stocks}
            recipes={recipes}
            onNavigate={setActiveTab}
            onUpdateBatchStatus={handleUpdateBatchStatus}
            onOpenDoughCalc={() => setIsDoughCalcOpen(true)}
            onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
          />
        )}

        {activeTab === 'production' && (
          <ProductionBakehouse
            recipes={recipes}
            batches={batches}
            onOpenRecipe={(rec) => setSelectedRecipeForModal(rec)}
            onOpenDoughCalc={() => setIsDoughCalcOpen(true)}
            onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
            onUpdateBatchStatus={handleUpdateBatchStatus}
            onAddBatch={handleAddBatch}
          />
        )}

        {activeTab === 'pos' && (
          <POSRegister
            products={posProducts}
            onSaleComplete={handleSaleComplete}
            onRecordWaste={handleRecordWaste}
          />
        )}

        {activeTab === 'orders' && (
          <CustomerOrdersManager
            orders={orders}
            products={posProducts}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddOrder={handleAddOrder}
          />
        )}

        {activeTab === 'stocks' && (
          <StockManager
            stocks={stocks}
            onUpdateStockQuantity={handleUpdateStockQuantity}
            onAddStockItem={handleAddStockItem}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersManager
            suppliers={suppliers}
            stocks={stocks}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsFinancials
            todayRevenue={todayRevenue}
            recipes={recipes}
            products={posProducts}
            wasteValue={wasteValue}
          />
        )}
      </main>

      {/* Modals */}
      <DoughCalculatorModal
        isOpen={isDoughCalcOpen}
        onClose={() => setIsDoughCalcOpen(false)}
        recipes={recipes}
      />

      <AiBakerAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        onRecipeCreated={handleAddRecipe}
      />

      <RecipeModal
        recipe={selectedRecipeForModal}
        isOpen={Boolean(selectedRecipeForModal)}
        onClose={() => setSelectedRecipeForModal(null)}
        onLaunchBatch={handleLaunchBatchFromRecipe}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 px-6 text-xs text-center">
        <p>
          ERP-BOUL • Système de Gestion Intégrée pour Artisans Boulangers, Pâtissiers & Traiteurs • Conforme aux normes d hygiène HACCP & traçabilité des lots
        </p>
      </footer>
    </div>
  );
}
