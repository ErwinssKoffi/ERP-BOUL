Voici le **AI Development Playbook complet**, conçu pour être exécuté **dans l’ordre 01 → 10** avec Claude Code ou Cursor. Chaque prompt impose à l’IA une méthode de travail, des livrables, des garde-fous et des critères d’acceptation.

Tu peux utiliser **un prompt par session/étape**, ou conserver les 10 dans les règles du projet puis demander à l’IA d’exécuter l’étape voulue.

# AI DEVELOPMENT PLAYBOOK
# ERP INTELLIGENT POUR BOULANGERIES IVOIRIENNES

## INSTRUCTIONS GLOBALES — À CONSERVER DANS LE PROJET

Tu développes un ERP vertical SaaS destiné aux boulangeries ivoiriennes.

Le produit est un **Bakery Operating System** qui relie :

**ACHATS → STOCK → RECETTES → PRODUCTION → QUALITÉ → DISTRIBUTION → VENTE → CAISSE → FINANCE → COMPTABILITÉ → RENTABILITÉ → DÉCISION**

La philosophie produit est :

**Vercel precision + Linear polish + Apple restraint + AI-native experience**

Le produit doit être :

- premium ;
- futuriste ;
- moderne ;
- minimaliste ;
- rapide ;
- accessible ;
- responsive ;
- très fiable ;
- simple pour les opérateurs ;
- puissant pour les managers ;
- précis pour la comptabilité ;
- intelligent pour le dirigeant.

Stack privilégiée :

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide
- Motion / Framer Motion
- PostgreSQL
- Prisma ou Drizzle
- Redis
- stockage objet compatible S3

Pour le POS, prévoir à terme :

- Android / React Native
- SQLite
- offline-first
- synchronisation
- Bluetooth
- impression ESC/POS

RÈGLES ABSOLUES :

1. Ne jamais construire un CRUD générique sans logique métier.
2. Ne jamais réinventer un composant shadcn/ui existant sans raison.
3. Ne jamais hardcoder une règle fiscale, sociale ou réglementaire susceptible d'évoluer.
4. Ne jamais supprimer silencieusement une transaction critique.
5. Ne jamais présenter une estimation comme un résultat comptable officiel.
6. Ne jamais inventer des données.
7. Ne jamais modifier une donnée critique sans audit lorsque l'audit est requis.
8. Toujours séparer logique métier, UI et infrastructure.
9. Toujours penser aux états loading, empty, error, disabled, permission denied et offline lorsque pertinent.
10. Toujours vérifier l'impact d'une fonctionnalité sur les autres domaines.

---

# 01 — FOUNDATION

## OBJECTIF

Construire le socle technique du projet avant d'implémenter les modules métier.

Tu dois produire une base propre, extensible, sécurisée et adaptée à un ERP SaaS multi-tenant.

## MISSION

Commence par inspecter le projet existant.

Tu dois :

1. analyser la structure actuelle ;
2. identifier le framework ;
3. identifier l'ORM ;
4. identifier la base de données ;
5. identifier le système d'authentification ;
6. identifier le système UI ;
7. identifier les conventions de code ;
8. identifier les composants existants ;
9. identifier les dépendances ;
10. identifier les risques techniques.

Ne recrée pas ce qui existe déjà.

## ARCHITECTURE CIBLE

Organiser progressivement le projet autour de :

```text
src/
  app/
  components/
  features/
    auth/
    products/
    inventory/
    procurement/
    recipes/
    production/
    sales/
    pos/
    cash/
    customers/
    delivery/
    finance/
    accounting/
    hr/
    maintenance/
    quality/
    fiscal/
    reporting/
    ai/
  lib/
  server/
  db/
  types/
  config/
```

Utiliser une séparation claire entre :

```text
Presentation
Application
Domain
Infrastructure
```

## MULTI-TENANCY

Le projet doit être conçu pour plusieurs entreprises.

Prévoir une isolation stricte via :

```text
tenantId
companyId
branchId
```

selon les entités.

Aucune donnée d'un tenant ne doit être accessible par un autre.

## ENVIRONNEMENTS

Prévoir :

```text
development
test
staging
production
```

avec des variables d'environnement propres.

Ne jamais committer :

- secrets ;
- tokens ;
- mots de passe ;
- credentials.

## OBSERVABILITÉ

Préparer les fondations pour :

- logs ;
- erreurs ;
- métriques ;
- audit ;
- jobs ;
- intégrations ;
- synchronisation.

## AUTHENTIFICATION

Créer une authentification robuste avec :

- login ;
- logout ;
- session ;
- reset password ;
- protection des routes ;
- contrôle de session ;
- utilisateur courant.

Préparer MFA pour les profils sensibles.

## RBAC

Créer le modèle :

```text
User
Role
Permission
UserRole
RolePermission
```

Prévoir des permissions fines.

Exemples :

```text
sales.create
sales.cancel
sales.refund
cash.close
stock.adjust
purchase.approve
production.validate
payroll.run
accounting.post
fiscal.certify
settings.manage
```

## AUDIT

Préparer un système central :

```text
AuditLog
```

avec :

```text
userId
action
entity
entityId
oldValue
newValue
timestamp
reason
device
```

## MONNAIE

La devise métier principale est :

```text
XOF / FCFA
```

Utiliser des types financiers exacts.

Ne jamais utiliser des calculs flottants pour les montants sensibles.

## UNITÉS

Préparer un système configurable :

```text
kg
g
L
mL
sac
carton
paquet
pièce
```

## DELIVERABLES

À la fin de cette étape, produire :

1. architecture du projet ;
2. structure des dossiers ;
3. stratégie multi-tenant ;
4. système auth ;
5. RBAC ;
6. audit ;
7. configuration ;
8. conventions de code ;
9. stratégie de tests ;
10. documentation de démarrage.

## ACCEPTANCE CRITERIA

Le projet doit :

- démarrer localement ;
- avoir une authentification fonctionnelle ;
- avoir les rôles/permissions de base ;
- isoler les données par tenant ;
- disposer d'un système d'audit ;
- avoir une base de tests ;
- avoir une architecture prête pour les modules métier.

Ne commence pas les modules Stock ou Production avant que Foundation soit propre.

---

# 02 — DESIGN SYSTEM

## OBJECTIF

Créer le langage visuel officiel de l'ERP.

Le produit doit combiner :

**Vercel + Linear + Apple + AI startup**

sans devenir une copie visuelle de ces produits.

## DIRECTION ARTISTIQUE

Le design doit être :

- futuriste ;
- premium ;
- minimal ;
- élégant ;
- technique ;
- calme ;
- précis.

Éviter :

- dashboards génériques ;
- cartes excessives ;
- couleurs criardes ;
- néon partout ;
- glassmorphism partout ;
- gradients excessifs ;
- grosses ombres ;
- animations décoratives inutiles.

## SHADCN/UI

Utiliser shadcn/ui comme base.

Prévoir et personnaliser :

```text
Button
Card
Badge
Dialog
Sheet
Drawer
DropdownMenu
Select
Tabs
Accordion
Tooltip
Popover
Command
Input
Textarea
Checkbox
Switch
Table
Avatar
Skeleton
Alert
```

Ne pas reconstruire inutilement les primitives déjà existantes.

## TYPOGRAPHIE

Préférer :

- Geist ;
- Inter ;
- SF Pro ;
- Manrope.

Pour le style Vercel/Linear, privilégier Geist ou Inter.

Créer une hiérarchie :

```text
Display
H1
H2
H3
Body
Small
Caption
Label
```

## COULEURS

Base :

```text
Near Black
White
Off White
Neutral Gray
Cool Gray
```

Accent :

```text
Electric Blue
Indigo
Violet
Cyan
Emerald
```

Utiliser généralement une couleur d'accent principale.

## TOKENS

Créer des tokens pour :

```text
colors
spacing
radius
shadows
typography
transitions
z-index
```

Les composants ne doivent pas inventer aléatoirement leurs valeurs.

## BORDER RADIUS

Style recommandé :

```text
Controls      6–8px
Inputs        8–10px
Cards         12–16px
Containers    16–24px
Pills         full
```

Éviter de transformer toute l'interface en bulles.

## BORDERS

Préférer des bordures subtiles.

Exemple conceptuel :

```text
border-white/10
```

ou tokens sémantiques équivalents.

## SHADOWS

Utiliser très peu de shadow.

Préférer :

- contrastes ;
- bordures ;
- surfaces ;
- profondeur ;
- blur subtil.

## GRADIENTS

Uniquement :

- radial ;
- soft ;
- atmospheric ;
- blurred.

Ils doivent être subtils.

## GLASSMORPHISM

Utiliser seulement sur :

- command palette ;
- floating navigation ;
- AI assistant ;
- modal ;
- floating action bar.

Pas sur toute l'application.

## MOTION

Utiliser Motion / Framer Motion.

Durées :

```text
100–180ms
180–300ms
300–500ms
```

Animations privilégiées :

```text
opacity
translate
scale
layout
blur
```

Respecter reduced motion.

## COMPOSANTS DE LAYOUT

Créer :

```text
AppShell
Sidebar
TopBar
PageHeader
PageContainer
Section
StatCard
DataTable
FilterBar
EmptyState
ErrorState
LoadingState
CommandMenu
ConfirmDialog
```

## RESPONSIVE

Mobile-first.

Prévoir une adaptation réelle :

- navigation ;
- grille ;
- typographie ;
- spacing ;
- boutons ;
- tableaux.

## DELIVERABLES

Produire :

1. design tokens ;
2. theme light ;
3. theme dark ;
4. composants de base ;
5. App Shell ;
6. navigation ;
7. page layout ;
8. table system ;
9. forms system ;
10. feedback system ;
11. motion conventions ;
12. documentation UI.

## ACCEPTANCE CRITERIA

Tous les modules futurs doivent pouvoir utiliser le même système sans réinventer :

- boutons ;
- cards ;
- inputs ;
- tables ;
- dialogs ;
- alerts ;
- navigation.

Le système doit être visuellement cohérent avant de construire les écrans métier.

---

# 03 — DATABASE

## OBJECTIF

Concevoir le modèle de données métier complet avant d'implémenter les workflows complexes.

## PRINCIPES

PostgreSQL = source de vérité.

Toutes les entités critiques doivent être traçables.

Les opérations financières, stock et fiscalité doivent être auditables.

## ENTITÉS CORE

Créer progressivement :

```text
Company
Branch
Warehouse
User
Role
Permission
Employee

Supplier
SupplierProduct
PurchaseRequest
PurchaseOrder
GoodsReceipt
SupplierInvoice
SupplierPayment

Product
ProductCategory
Unit
Recipe
RecipeVersion
RecipeIngredient
ProductCost

StockItem
StockLot
StockMovement
StockCount
StockAdjustment

ProductionOrder
ProductionBatch
ProductionConsumption
ProductionOutput
ProductionWaste
QualityCheck

Customer
SalesOrder
Sale
SaleLine
Payment
Refund
Delivery
DeliveryLine
Return

CashRegister
CashSession
CashMovement

Expense
ExpenseCategory

BankAccount
BankTransaction

Attendance
Shift
Schedule
Leave
Payroll
PayrollLine

Asset
MaintenancePlan
MaintenanceOrder
MaintenancePart

AccountingAccount
AccountingJournal
AccountingEntry
AccountingPeriod

Invoice
CreditNote
FiscalTransaction
FNETransaction
RNETransaction

Alert
Notification
AuditLog
Document
```

## IDENTIFIANTS

Séparer :

```text
Technical ID
+
Business Number
```

Exemple :

```text
id = UUID
productionNumber = OP-2026-00124
```

## TIMESTAMPS

Prévoir :

```text
createdAt
updatedAt
createdBy
updatedBy
```

pour les entités appropriées.

## SOFT DELETE

Ne pas utiliser automatiquement soft delete partout.

Pour les objets financiers/critiques :

préférer :

```text
cancel
reverse
adjust
credit
archive
```

## INDEX

Créer les indexes nécessaires sur :

- tenantId ;
- companyId ;
- branchId ;
- dates ;
- status ;
- foreign keys ;
- numéros métier.

Analyser les requêtes avant d'ajouter des indexes inutiles.

## INTÉGRITÉ

Utiliser :

- foreign keys ;
- unique constraints ;
- check constraints ;
- transactions.

## STOCK

Ne pas simplement stocker une quantité arbitraire.

Conserver :

```text
StockMovement
```

comme source de traçabilité.

## VERSIONNAGE

Versionner :

```text
Recipe
TaxRule
SocialRule
RegulatoryRule
Pricing
```

## MIGRATIONS

Les migrations doivent être :

- versionnées ;
- reproductibles ;
- testables ;
- sûres.

## DELIVERABLES

Produire :

1. ERD ;
2. schéma ORM ;
3. migrations ;
4. indexes ;
5. contraintes ;
6. relations ;
7. stratégie tenant ;
8. seed de démonstration ;
9. documentation du modèle.

## ACCEPTANCE CRITERIA

Le modèle doit pouvoir représenter au minimum :

```text
Entreprise
↓
Établissement
↓
Entrepôt
↓
Stock

Recette
↓
Production
↓
Produit fini
↓
Vente
↓
Paiement
↓
Caisse
```

et :

```text
Fournisseur
↓
Commande
↓
Réception
↓
Lot
↓
Stock
```

---

# 04 — STOCK

## OBJECTIF

Construire un moteur de stock fiable et traçable.

## PRINCIPLE

Le stock est un moteur métier central.

Chaque mouvement doit avoir une origine.

## TYPES

```text
RAW_MATERIAL
PACKAGING
WORK_IN_PROGRESS
FINISHED_PRODUCT
RETURN
WASTE
MAINTENANCE_PART
```

## MOUVEMENTS

```text
PURCHASE_RECEIPT
PRODUCTION_CONSUMPTION
PRODUCTION_OUTPUT
SALE
TRANSFER
RETURN
WASTE
ADJUSTMENT
COUNT_CORRECTION
```

## RÉCEPTION

Workflow :

```text
Purchase Order
↓
Goods Receipt
↓
Quality/Quantity Check
↓
Lot Creation
↓
Stock Movement
```

## LOT

Chaque lot peut contenir :

```text
lotNumber
product
supplier
receivedAt
expirationDate
quantity
unitCost
warehouse
```

## FEFO

Pour les matières concernées :

```text
First Expired
First Out
```

Le système doit proposer le lot prioritaire.

## INVENTAIRE

Workflow :

```text
Create
↓
Freeze
↓
Count
↓
Compare
↓
Review
↓
Approve
↓
Post
```

Comparer :

```text
theoreticalQuantity
physicalQuantity
variance
varianceValue
```

## AJUSTEMENT

Tout ajustement doit avoir :

```text
reason
user
timestamp
```

## STOCK MINIMUM

Prévoir :

```text
minimum
maximum
safetyStock
reorderPoint
```

## ALERTES

Créer :

```text
LOW_STOCK
EXPIRING
NEGATIVE_STOCK
STOCK_VARIANCE
DORMANT_STOCK
```

## RAPPORTS

Créer :

- état du stock ;
- valorisation ;
- mouvements ;
- lots ;
- inventaires ;
- écarts ;
- expirations ;
- rotation.

## UX

Le magasinier doit pouvoir :

```text
Recevoir
Transférer
Compter
Ajuster
Consulter
```

en très peu d'étapes.

## ACCEPTANCE CRITERIA

### Réception

Une réception validée doit :

- créer les mouvements ;
- créer les lots si nécessaire ;
- augmenter le stock ;
- conserver le lien fournisseur/réception/lot.

### Consommation

Une consommation doit :

- réduire le stock ;
- référencer la production ;
- référencer le lot lorsque applicable.

### Vente

Une vente validée doit réduire le stock produit fini selon la configuration.

### Inventaire

Un inventaire doit détecter les écarts et générer les écritures/mouvements d'ajustement appropriés.

---

# 05 — PRODUCTION

## OBJECTIF

Construire le cœur opérationnel de la boulangerie.

## PRODUITS

Une production doit être liée à :

```text
Product
Recipe
RecipeVersion
Shift
Team
Branch
Warehouse
```

## ORDRE DE PRODUCTION

Créer :

```text
ProductionOrder
```

Champs principaux :

```text
number
product
recipeVersion
plannedQuantity
plannedDate
shift
team
responsible
status
```

Statuts :

```text
DRAFT
PLANNED
RELEASED
IN_PROGRESS
COMPLETED
PARTIAL
CANCELLED
```

## WORKFLOW

```text
Planification
↓
Ordre
↓
Réservation matière si activée
↓
Production
↓
Consommation réelle
↓
Output réel
↓
Pertes
↓
Contrôle qualité
↓
Calcul rendement
↓
Calcul coût réel
↓
Clôture
```

## ÉTAPES

Permettre des étapes configurables :

```text
Préparation
Pesée
Pétrissage
Fermentation
Division
Façonnage
Apprêt
Cuisson
Refroidissement
Conditionnement
```

## RECETTES

Supporter :

```text
quantités
unités
pourcentages boulangers
rendement
```

Une recette doit être versionnée.

## COSTING

Calculer :

```text
Standard Cost
Actual Cost
Variance
```

## RENDEMENT

Formule :

```text
Actual Output / Expected Output
```

Comparer :

- cible ;
- jour ;
- semaine ;
- mois ;
- équipe ;
- produit ;
- recette.

## POIDS

Créer un système de règles réglementaires versionnées.

Structure :

```text
RegulatoryRule
product
price
targetWeight
tolerance
effectiveFrom
effectiveTo
source
```

Ne pas hardcoder les valeurs réglementaires.

## PERTES

Créer :

```text
Production Waste
```

Catégories :

```text
PRODUCTION
QUALITY
DAMAGE
OVERPRODUCTION
OTHER
```

## QUALITÉ

Permettre :

```text
weight
qualityStatus
rejectionReason
notes
operator
timestamp
```

## ANALYSE

Le responsable doit pouvoir répondre :

> Pourquoi avons-nous produit moins que prévu ?

> Pourquoi le coût augmente-t-il ?

> Pourquoi avons-nous consommé plus de farine ?

## ACCEPTANCE CRITERIA

Un ordre terminé doit automatiquement permettre de connaître :

```text
Quantité prévue
Quantité réelle
Matières prévues
Matières consommées
Pertes
Rendement
Coût standard
Coût réel
Écart
```

Le système doit conserver la traçabilité jusqu'aux lots consommés.

---

# 06 — POS

## OBJECTIF

Construire un POS extrêmement rapide, fiable et pensé pour un environnement de boulangerie.

## PRIORITÉS

1. vitesse ;
2. simplicité ;
3. offline ;
4. paiement ;
5. caisse ;
6. impression ;
7. synchronisation.

## ÉCRAN

Structure :

```text
SEARCH
CATEGORIES
PRODUCT GRID

CART
TOTAL

PAYMENT METHODS

VALIDATE
```

## PRODUITS

Supporter :

- favoris ;
- catégories ;
- recherche ;
- quantités ;
- prix configurables ;
- barcode si nécessaire.

## PAIEMENTS

Prévoir :

```text
CASH
MOBILE_MONEY
CARD
BANK_TRANSFER
OTHER
```

Les providers ne doivent pas être codés en dur.

## SESSION CAISSE

Workflow :

```text
Open
↓
Sell
↓
Collect
↓
Withdraw/Expense if authorized
↓
Count
↓
Close
```

## RAPPROCHEMENT

Comparer :

```text
Expected
vs
Actual
```

Créer :

```text
CashVariance
```

si écart.

## REMBOURSEMENT

Un remboursement doit :

- vérifier les permissions ;
- conserver une référence ;
- être audité ;
- ne pas supprimer la vente originale.

## OFFLINE

Prévoir :

```text
SQLite
Local Transaction
Sync Queue
Backend
```

États :

```text
LOCAL
PENDING_SYNC
SYNCING
SYNCED
FAILED
CONFLICT
```

## IDEMPOTENCE

Chaque transaction offline doit avoir :

```text
localId
deviceId
createdAt
```

afin d'éviter les doublons lors de la synchronisation.

## IMPRESSION

Architecture :

```text
POS
↓
Print Service
↓
Print Queue
↓
Bluetooth / USB / TCP
↓
ESC/POS
```

Statuts :

```text
PENDING
PRINTING
SUCCESS
FAILED
RETRY
```

L'impression ne doit pas déterminer si la vente existe.

## FISCALISATION

Séparer :

```text
Sale
↓
Fiscalization
↓
Print
```

Jamais :

```text
Print
↓
Sale
```

## ACCEPTANCE CRITERIA

Un caissier doit pouvoir réaliser une vente complète en très peu d'étapes.

Une panne réseau ne doit pas faire perdre une vente locale prise en charge par le mode offline.

Une panne d'imprimante ne doit pas annuler une vente enregistrée.

Une clôture de caisse doit produire :

```text
Opening Float
Sales
Payments
Refunds
Expenses
Withdrawals
Expected Cash
Actual Cash
Variance
```

---

# 07 — FINANCE

## OBJECTIF

Construire les modules financiers, clients, fournisseurs, dépenses, trésorerie et première couche comptable de pilotage.

## PRINCIPLE

Tout doit être connecté aux événements métier.

```text
Sale
↓
Payment
↓
Cash / Bank
↓
Finance
```

et :

```text
Purchase
↓
Supplier Invoice
↓
Supplier Payment
↓
Cash / Bank
```

## CLIENTS

Créer :

```text
Customer
CustomerAccount
CustomerCreditLimit
CustomerPayment
```

## CRÉANCES

Afficher :

```text
Current
1-30
31-60
60+
```

## FOURNISSEURS

Afficher :

```text
Payables
Due Date
Paid
Outstanding
```

## DÉPENSES

Créer :

```text
Expense
ExpenseCategory
ExpenseAttachment
ExpenseApproval
```

Catégories :

```text
Énergie
Eau
Gaz
Carburant
Transport
Maintenance
Loyer
Télécommunication
Fournitures
Nettoyage
Salaires
Taxes
Frais bancaires
Autres
```

## TRÉSORERIE

Gérer :

```text
Cash
Bank
Mobile Money
Internal Accounts
```

## RAPPROCHEMENT

Prévoir :

```text
Expected
Actual
Variance
```

## MARGE

Calcul :

```text
Selling Price
-
Actual Cost
=
Unit Margin
```

Puis :

```text
Unit Margin × Quantity
=
Contribution
```

## PROFIT ENGINE

Créer un service central :

```text
ProfitEngine
```

Il doit être capable d'agréger :

```text
Revenue
Material Cost
Packaging
Waste
Production
Energy
Labor
Distribution
Operating Expenses
```

et produire :

```text
Gross Margin
Contribution Margin
Estimated Operating Result
Cash Position
```

## IMPORTANT

Le résultat estimé doit être explicitement présenté comme :

```text
Management Estimate
```

et non comme résultat comptable officiel.

## COMPTABILITÉ

Préparer :

```text
Accounts
Journals
Entries
Periods
Customers
Suppliers
Cash
Banks
```

Le modèle doit être compatible avec le référentiel comptable ivoirien applicable.

## CONFIGURATION

Les règles comptables et fiscales doivent être paramétrables.

## RAPPORTS

Créer :

- CA ;
- marge ;
- dépenses ;
- cash ;
- créances ;
- dettes ;
- fournisseurs ;
- produits rentables ;
- coûts.

## ACCEPTANCE CRITERIA

Le dirigeant doit pouvoir savoir :

```text
CA
Marge
Cash
Créances
Dettes
Dépenses
Pertes
Produits les plus rentables
```

sans devoir effectuer manuellement des calculs Excel.

---

# 08 — FNE / FISCAL

## OBJECTIF

Construire une couche fiscale isolée et évolutive.

IMPORTANT :

Les règles fiscales et les procédures d'intégration doivent toujours être vérifiées sur les sources officielles ivoiriennes applicables au moment de l'implémentation.

Ne jamais supposer qu'une règle historique est encore active.

## ARCHITECTURE

Créer :

```text
Fiscal Engine
     ↓
Fiscal Adapter
     ↓
FNE / RNE Integration
```

Les modules POS, Sales et Invoices ne doivent pas contenir directement la logique technique FNE.

## OBJETS

Créer :

```text
FiscalDocument
FiscalTransaction
FiscalResponse
FiscalStatus
FNETransaction
RNETransaction
```

## DOCUMENTS

Prévoir selon le cadre applicable :

```text
Invoice
CreditNote
Proforma
Receipt
FNE / RNE related records
```

## STATUTS

```text
DRAFT
READY
SUBMITTED
CERTIFIED
FAILED
CANCELLED
SYNC_PENDING
```

## API

L'intégration doit gérer :

- authentication ;
- validation ;
- mapping ;
- requêtes ;
- réponses ;
- erreurs ;
- retry ;
- idempotence ;
- logs.

## FNE IDENTITY

Conserver séparément :

```text
Internal Invoice ID
External Fiscal ID
External Fiscal Number
```

## QR / DOCUMENT

Le moteur doit pouvoir stocker les informations nécessaires à la génération du document fiscal selon les spécifications officielles applicables.

## NUMÉROTATION

La logique de numérotation fiscale doit être indépendante de la génération PDF.

Prévoir :

```text
Sequence
Series
Fiscal Year
Branch
Document Type
```

avec contrôles d'unicité et continuité selon les règles applicables.

## ERREURS

Une erreur FNE doit être visible comme :

```text
Fiscalization failed
Reason:
...
Action:
Retry / Correct / Contact support
```

Ne jamais exposer directement une erreur technique brute à l'utilisateur final.

## RETRY

Un appel échoué doit pouvoir être rejoué.

Le retry ne doit jamais créer un doublon.

## AUDIT

Conserver :

```text
request
response
timestamp
document
user
status
```

## ACCEPTANCE CRITERIA

Le module doit être complètement découplé des autres domaines.

Une modification future de l'API fiscale ne doit pas nécessiter de réécrire le POS.

Toute transaction fiscale doit rester traçable.

La configuration fiscale doit être versionnée.

---

# 09 — ANALYTICS / IA

## OBJECTIF

Transformer les données ERP en décisions.

Ce module doit être construit uniquement après avoir une base de données fiable.

## ANALYTICS

Créer :

```text
Executive Dashboard
Production Dashboard
Stock Dashboard
Sales Dashboard
Cash Dashboard
Finance Dashboard
```

## EXECUTIVE DASHBOARD

Afficher en priorité :

```text
Revenue
Margin
Estimated Operating Result
Cash
Inventory
Waste
Yield
Cash Variance
Receivables
Alerts
```

## CONTROL TOWER

Créer un centre de contrôle :

```text
Production
Stock
Cash
Waste
Receivables
Suppliers
Quality
Maintenance
```

avec indicateurs :

```text
Healthy
Warning
Critical
```

## ALERT ENGINE

Créer :

```text
Rule
Condition
Threshold
Severity
Action
Notification
```

Exemples :

```text
stock < safetyStock
→ LOW_STOCK

actualYield < targetYield
→ LOW_YIELD

cashVariance > threshold
→ CASH_DISCREPANCY

wasteRate > threshold
→ WASTE_HIGH
```

## KPI

Créer au minimum :

```text
Revenue
Gross Margin
Product Contribution
Waste Cost
Yield
Inventory Value
Stock Variance
Cash Variance
Receivables
Payables
Supplier Price Variance
Energy Cost
Labor Cost
```

## DRILL DOWN

Un KPI doit pouvoir être exploré.

Exemple :

```text
Marge baisse
↓
Produit
↓
Recette
↓
Matière
↓
Lot
↓
Fournisseur
```

## AI COPILOT

Créer un assistant métier permettant :

```text
Pourquoi ma marge baisse ?
Combien avons-nous perdu cette semaine ?
Quel produit est le plus rentable ?
Quelle matière coûte le plus ?
Quel fournisseur est le plus intéressant ?
Combien produire demain ?
Quels clients sont en retard ?
Quelle boutique est la plus rentable ?
```

## RÈGLE ABSOLUE

L'IA ne doit jamais inventer les données.

Pipeline :

```text
Question
↓
Intent
↓
Allowed Tool
↓
Business Query
↓
Validated Data
↓
Calculation
↓
LLM Explanation
```

## OUTILS IA

Créer des tools contrôlés tels que :

```text
getRevenue()
getGrossMargin()
getWaste()
getProductionYield()
getStock()
getReceivables()
getSupplierPriceVariance()
getCashVariance()
getProductProfitability()
getProductionForecast()
```

L'IA ne doit pas recevoir un accès SQL illimité.

## EXPLICABILITÉ

Une réponse importante doit pouvoir indiquer :

```text
Période
Données utilisées
Calcul
Résultat
Impact
```

## ANOMALIES

Détecter :

```text
Unusual Waste
Unusual Yield
Cash Variance
Supplier Price Increase
Unusual Consumption
Unusual Sales Drop
```

## PRÉVISION

Prévoir progressivement :

```text
Sales Forecast
Production Forecast
Inventory Forecast
Cash Forecast
```

Toujours séparer :

```text
Observed
Estimated
Predicted
```

## RECOMMANDATIONS

Exemple :

```text
Le coût de la farine a augmenté de X%.

Impact estimé :
Y FCFA.

Action recommandée :
Réévaluer le fournisseur ou le prix du produit.
```

L'IA ne doit pas décider automatiquement d'une action financière critique sans approbation humaine.

## ACCEPTANCE CRITERIA

Le dirigeant doit pouvoir poser une question en langage naturel et obtenir une réponse :

- basée sur les données ;
- datée ;
- vérifiable ;
- expliquée ;
- sans hallucination.

---

# 10 — QA & DEPLOYMENT

## OBJECTIF

Préparer une application réellement exploitable en production.

Cette étape ne consiste pas seulement à « corriger les bugs ».

Elle doit vérifier :

```text
Fonctionnel
+
Métier
+
Sécurité
+
Performance
+
Données
+
UX
+
Offline
+
Fiscal
+
Déploiement
```

## TESTS UNITAIRES

Tester toutes les règles critiques.

Exemples :

```text
Stock calculation
Recipe costing
Margin
Yield
Cash variance
Receivables
Tax rules
Social rules
```

## TESTS D'INTÉGRATION

Tester les grands flux :

```text
Purchase
→ Receipt
→ Stock

Stock
→ Production
→ Finished Goods

Finished Goods
→ Sale
→ Payment
→ Cash

Sale
→ Fiscalization
→ Print
```

## E2E

Créer des scénarios complets :

### Scénario 1

```text
Créer produit
↓
Créer recette
↓
Recevoir farine
↓
Produire pain
↓
Vendre
↓
Encaisser
↓
Clôturer caisse
```

### Scénario 2

```text
Créer client B2B
↓
Créer commande
↓
Livrer
↓
Facturer
↓
Créer créance
↓
Recevoir paiement
```

### Scénario 3

```text
Créer achat
↓
Réception partielle
↓
Facture fournisseur
↓
Mismatch
↓
Alerte
```

## TESTS OFFLINE

Simuler :

```text
Internet down
Internet returns
Duplicate sync
Sync retry
Printer unavailable
Backend unavailable
```

## TESTS FISCAL

Prévoir environnement de test/sandbox lorsque le service officiel le permet.

Tester :

- succès ;
- erreur ;
- timeout ;
- doublon ;
- retry ;
- cancellation ;
- invalid payload.

Toujours vérifier les spécifications officielles en vigueur.

## TESTS SÉCURITÉ

Vérifier :

```text
Tenant isolation
Authorization
Authentication
Session
Rate limiting
Injection
XSS
CSRF where applicable
File upload
Secrets
```

## TESTS DE PERFORMANCE

Tester :

```text
POS
Dashboard
Stock queries
Large tables
Reports
Search
Sync
```

Prévoir des jeux de données réalistes.

Tester notamment avec :

```text
100k+ sales
100k+ stock movements
thousands of products
multiple branches
```

## DATABASE

Vérifier :

- migrations ;
- rollback strategy ;
- indexes ;
- constraints ;
- backups.

## BACKUPS

Mettre en place :

```text
Automated Backup
Retention
Restore Test
Monitoring
```

Objectifs cibles à valider selon l'infrastructure :

```text
RPO
RTO
```

## MONITORING

Surveiller :

```text
API latency
Error rate
Database health
Queue failures
FNE failures
Print failures
Sync failures
```

## DEPLOYMENT

Préparer :

```text
Development
Staging
Production
```

Pipeline :

```text
Commit
↓
Lint
↓
Typecheck
↓
Unit Tests
↓
Integration Tests
↓
Build
↓
Deploy Staging
↓
E2E
↓
Production
```

## RÈGLE « NO BROKEN BUILD »

Aucune fonctionnalité ne doit être considérée terminée si :

```text
TypeScript errors
Lint errors
Failing tests
Broken migrations
```

existent.

## DESIGN QA

Vérifier chaque écran :

```text
Spacing
Typography
Alignment
Contrast
Responsive
Loading
Empty
Error
Hover
Focus
Disabled
Animation
```

## ACCESSIBILITY

Vérifier :

- clavier ;
- focus ;
- contrastes ;
- labels ;
- ARIA ;
- navigation.

## MOBILE

Tester :

```text
Mobile
Tablet
Desktop
Large Desktop
```

## SECURITY

Ne jamais exposer :

- secrets ;
- API keys ;
- credentials ;
- données d'un autre tenant.

## RELEASE CHECKLIST

Avant chaque release :

```text
[ ] Database migrations
[ ] Environment variables
[ ] Tests
[ ] Security
[ ] Backup
[ ] Monitoring
[ ] Fiscal integration status
[ ] Print
[ ] Offline sync
[ ] Permissions
[ ] Audit
[ ] Documentation
```

## ACCEPTANCE CRITERIA

La release n'est valide que si :

```text
Build ✅
Tests ✅
Security ✅
Database ✅
UX ✅
Responsive ✅
Audit ✅
Monitoring ✅
Backup ✅
Critical Workflows ✅
```

---

# ORDRE D'EXÉCUTION OBLIGATOIRE

Exécuter dans cet ordre :

```text
01 FOUNDATION
        ↓
02 DESIGN SYSTEM
        ↓
03 DATABASE
        ↓
04 STOCK
        ↓
05 PRODUCTION
        ↓
06 POS
        ↓
07 FINANCE
        ↓
08 FNE / FISCAL
        ↓
09 ANALYTICS / IA
        ↓
10 QA & DEPLOYMENT
```

Ne saute pas directement à l'IA.

Ne construis pas FNE avant d'avoir stabilisé les objets Sales / Invoice.

Ne construis pas les calculs de marge avant d'avoir un système fiable de Stock + Production.

Ne construis pas le forecasting avant d'avoir suffisamment de données historiques fiables.

---

# PROTOCOLE DE TRAVAIL ENTRE DEUX ÉTAPES

Après chaque étape, produire obligatoirement :

## 1. WHAT WAS BUILT

Résumé concret des éléments développés.

## 2. FILES CHANGED

Liste des fichiers créés/modifiés.

## 3. DATABASE CHANGES

Tables, migrations, indexes.

## 4. BUSINESS RULES

Nouvelles règles ajoutées.

## 5. API

Endpoints/services créés.

## 6. UI

Pages et composants créés.

## 7. TESTS

Tests ajoutés et résultats.

## 8. RISKS

Problèmes ou hypothèses identifiés.

## 9. NEXT STEP

Ce qui est prêt pour l'étape suivante.

---

# PROTOCOLE « DO NOT BREAK EXISTING »

Avant chaque modification :

```text
Inspect existing code
↓
Identify dependencies
↓
Reuse existing components
↓
Implement smallest coherent change
↓
Run tests
↓
Run typecheck
↓
Run lint
↓
Verify affected workflows
```

Ne jamais casser une fonctionnalité existante pour construire une nouvelle fonctionnalité.

---

# PROTOCOLE « WHEN SOMETHING IS AMBIGUOUS »

Ne pas inventer silencieusement une règle métier critique.

Classer l'ambiguïté :

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Pour les sujets critiques :

- fiscalité ;
- comptabilité ;
- droit social ;
- réglementation ;
- sécurité ;

signaler explicitement l'hypothèse et isoler la règle dans une configuration versionnée.

---

# PROTOCOLE « UI FIRST CLASS »

Chaque page doit avoir :

```text
Page Header
Primary Action
Context / KPI
Filters
Main Content
Secondary Actions
```

et les états :

```text
Loading
Empty
Error
Success
Disabled
Permission denied
Offline
Syncing
```

---

# PROTOCOLE « BUSINESS FIRST »

Pour chaque fonctionnalité, répondre intérieurement à :

```text
Quel problème métier est résolu ?

Quelle donnée est créée ?

Quelle donnée est modifiée ?

Quel impact stock ?

Quel impact financier ?

Quel impact comptable ?

Quel impact fiscal ?

Qui peut effectuer l'action ?

Quelle trace est conservée ?

Quel risque existe ?
```

---

# PROTOCOLE « MONEY FIRST »

Pour toute fonctionnalité impactant :

```text
Sales
Stock
Production
Purchase
Cash
Expense
```

toujours considérer :

```text
Revenue
Cost
Margin
Cash
Waste
Risk
```

---

# PROTOCOLE « TRACE EVERYTHING »

Pour chaque événement critique :

```text
Who
What
When
Where
Why
Amount
Quantity
Source
```

doit pouvoir être retrouvé.

---

# PHRASE DIRECTRICE DU PRODUIT

Chaque fonctionnalité doit contribuer à cette mission :

> **Chaque gramme. Chaque pain. Chaque franc.**

L'ERP doit permettre à la boulangerie de :

**Prévoir → Acheter → Stocker → Produire → Contrôler → Vendre → Encaisser → Comptabiliser → Analyser → Corriger → Prévoir à nouveau.**

Le résultat final doit ressembler à un produit technologique international haut de gamme tout en étant profondément adapté aux réalités opérationnelles d'une boulangerie ivoirienne.

### Comment je te conseille de l'exécuter

Commence **strictement par `01 Foundation`**, puis donne à l'IA uniquement l'étape suivante une fois la précédente stabilisée. Ça évite que Claude Code/Cursor génère simultanément 40 tables, 80 écrans et une architecture impossible à maintenir.

Le meilleur mode opératoire est ensuite :

**01 → commit Git → review → 02 → commit → review → 03 → migration → tests → 04...**

Et surtout, pour ce projet, **ne laisse pas l'IA inventer les règles métier ivoiriennes** : pour la fiscalité FNE/RNE, le social CNPS, le SYSCOHADA et les règles sectorielles de la boulangerie, le prompt lui demande volontairement de vérifier les textes et sources officielles au moment de l'implémentation.
