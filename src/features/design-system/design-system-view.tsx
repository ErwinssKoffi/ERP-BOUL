"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge, StatusIndicator } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/ui/form-field";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AccordionItem } from "@/components/ui/accordion";
import { Tooltip } from "@/components/ui/tooltip";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { StatCard } from "@/components/layout/stat-card";
import { FilterBar } from "@/components/layout/filter-bar";
import { DataTable } from "@/components/layout/data-table";
import { EmptyState } from "@/components/layout/empty-state";
import { ErrorState } from "@/components/layout/error-state";
import { LoadingState } from "@/components/layout/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Section } from "@/components/layout/section";
import {
  Sparkles,
  Layers,
  Coins,
  Store,
  Box,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  ChevronDown,
} from "lucide-react";

export function DesignSystemView() {
  const { toast } = useToast();

  // Dialog / Modal state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Form controls state
  const [inputText, setInputText] = React.useState("Farine de Blé T55");
  const [inputError, setInputError] = React.useState(false);
  const [checkboxChecked, setCheckboxChecked] = React.useState(true);
  const [switchChecked, setSwitchChecked] = React.useState(true);

  // Table search & filter state
  const [tableSearch, setTableSearch] = React.useState("");
  const [tableFilterCategory, setTableFilterCategory] = React.useState("all");

  // Sample Bakery Inventory data
  const sampleData = [
    { id: "mat_01", code: "FAR-T55", name: "Farine de Blé T55 (MCI)", category: "Farines", stock: "45 sacs (2 250 kg)", unitCost: "23 500 FCFA/sac", status: "optimal" },
    { id: "mat_02", code: "LEV-FR", name: "Levure Fraîche Saf-Instant", category: "Levures", stock: "8 cartons (80 kg)", unitCost: "18 000 FCFA/ctn", status: "optimal" },
    { id: "mat_03", code: "SEL-RAF", name: "Sel Fin Raffiné Iodé", category: "Épicerie", stock: "15 paquets (15 kg)", unitCost: "500 FCFA/kg", status: "optimal" },
    { id: "mat_04", code: "AMEL-MAG", name: "Améliorant Magimix Bleu", category: "Additifs", stock: "2 sacs (50 kg)", unitCost: "42 000 FCFA/sac", status: "warning" },
    { id: "mat_05", code: "BEUR-82", name: "Beurre de Tourage 82%", category: "Pâtisserie", stock: "3 cartons (30 kg)", unitCost: "35 000 FCFA/ctn", status: "critical" },
  ];

  const filteredData = sampleData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(tableSearch.toLowerCase()) || item.code.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesCategory = tableFilterCategory === "all" || item.category === tableFilterCategory;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      key: "code",
      header: "Code Matière",
      render: (item: any) => <span className="font-mono font-semibold text-amber-400">{item.code}</span>,
    },
    {
      key: "name",
      header: "Désignation Ingrédient",
      render: (item: any) => (
        <div>
          <div className="font-medium text-white">{item.name}</div>
          <div className="text-[10px] text-gray-500 font-mono">{item.category}</div>
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock Physique",
      render: (item: any) => <span className="font-mono text-gray-200">{item.stock}</span>,
    },
    {
      key: "unitCost",
      header: "Prix Achat Récent",
      render: (item: any) => <span className="font-mono text-gray-300">{item.unitCost}</span>,
    },
    {
      key: "status",
      header: "Disponibilité",
      render: (item: any) => {
        if (item.status === "optimal") {
          return <StatusIndicator status="active" label="Stock suffisant" />;
        }
        if (item.status === "warning") {
          return <StatusIndicator status="warning" label="Seuil d'alerte" />;
        }
        return <StatusIndicator status="error" label="Réappro urgent" />;
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Système de Design — Étape 02"
        description="Spécifications visuelles unifiées combinant Vercel precision, Linear polish, Apple restraint et l'identité chaleureuse du fournil ivoirien."
        breadcrumbs={[
          { label: "ERP-BOUL" },
          { label: "Socle Système" },
          { label: "02 Design System" },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  type: "info",
                  title: "Design System 02",
                  message: "Toutes les primitives sont prêtes pour les modules Stock & Production.",
                });
              }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Tester Notification
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              Ouvrir Dialogue Modal
            </Button>
          </div>
        }
      />

      {/* KPI Primitives Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Composants Primitives"
          value="24"
          subValue="UI Primitives"
          change={{ value: "100% testés", trend: "up" }}
          hint="Zero-pill discipline"
        />
        <StatCard
          label="Palette Sémantique"
          value="Ambre #f59e0b"
          subValue="Fournil & Or"
          change={{ value: "Contraste AA+", trend: "up" }}
          hint="Surfaces sombres 8px radius"
        />
        <StatCard
          label="Composants Layout"
          value="13"
          subValue="Structures"
          change={{ value: "AppShell / Sidebar / Table", trend: "up" }}
          hint="Mobile-first responsive"
        />
        <StatCard
          label="Standard Motion"
          value="150 - 250ms"
          subValue="Framer / CSS"
          change={{ value: "Courbes naturelles", trend: "neutral" }}
          hint="prefers-reduced-motion"
        />
      </div>

      {/* Onglets d'Exploration des Primitives */}
      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Composants de Base</TabsTrigger>
          <TabsTrigger value="forms">Formulaires & Contrôles</TabsTrigger>
          <TabsTrigger value="data">Tableaux & Données</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Modales</TabsTrigger>
          <TabsTrigger value="tokens">Tokens & Typographie</TabsTrigger>
        </TabsList>

        {/* 1. COMPOSANTS DE BASE */}
        <TabsContent value="components" className="space-y-6">
          <Section title="Boutons & Actions" description="Variantes accessibles avec gestion des états loading et focus visible.">
            <div className="flex flex-wrap items-center gap-3 bg-[#0c0f18] border border-[#1e2538] p-4 rounded-xl">
              <Button variant="primary">Bouton Principal</Button>
              <Button variant="secondary">Bouton Secondaire</Button>
              <Button variant="outline">Bouton Contour</Button>
              <Button variant="ghost">Bouton Ghost</Button>
              <Button variant="destructive">Destructif</Button>
              <Button variant="subtle">Subtle Ambre</Button>
              <Button variant="primary" isLoading>Chargement</Button>
              <Button variant="primary" size="sm">Taille SM</Button>
              <Button variant="primary" size="lg">Taille LG</Button>
            </div>
          </Section>

          <Section title="Badges & Statuts Métier" description="Application rigoureuse de la discipline Zero-Pill : séparateurs typographiques et points discrets pour les métadonnées.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Indicateurs de Statut Linéaires (Zero-Pill)</CardTitle>
                  <CardDescription>À privilégier pour les statuts d'ordres de fabrication, caisses et stocks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-6 text-xs">
                    <StatusIndicator status="active" label="Production En Cours" />
                    <StatusIndicator status="idle" label="Caisse En Attente" />
                    <StatusIndicator status="warning" label="Stock Farine Faible" />
                    <StatusIndicator status="error" label="Écart Caisse Détecté" />
                  </div>
                  <div className="pt-3 border-t border-[#181d2a] text-xs text-gray-500 font-mono">
                    Boulangerie Plateau · Fournée N° 104 · Créé il y a 12 min
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badges Techniques Granulaires</CardTitle>
                  <CardDescription>Réservés aux codes de taxes, abréviations monétaires et permissions.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="default">TVA 18%</Badge>
                  <Badge variant="success">FNE CERTIFIÉ</Badge>
                  <Badge variant="warning">RÉGIME RSI</Badge>
                  <Badge variant="destructive">REBUT FOURNIL</Badge>
                  <Badge variant="secondary">SYSCOHADA</Badge>
                  <Badge variant="outline">XOF / FCFA</Badge>
                </CardContent>
              </Card>
            </div>
          </Section>
        </TabsContent>

        {/* 2. FORMULAIRES & CONTRÔLES */}
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Système de Formulaire Opérationnel</CardTitle>
              <CardDescription>Conçu pour une saisie ultra-rapide au comptoir ou au fournil avec validation intégrée.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Désignation Matière Première" required hint="Nom exact mentionné sur la facture du meunier.">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ex: Farine de Blé T55"
                  />
                </FormField>

                <FormField
                  label="Quantité Réceptionnée"
                  required
                  error={inputError ? "La quantité doit être supérieure à zéro." : undefined}
                >
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      defaultValue="50"
                      error={inputError}
                      className="font-mono"
                    />
                    <Select defaultValue="sac" className="w-32">
                      <option value="sac">Sacs (50kg)</option>
                      <option value="kg">Kilogrammes</option>
                      <option value="carton">Cartons</option>
                    </Select>
                  </div>
                </FormField>

                <FormField label="Conditionnement & Unité">
                  <Select defaultValue="mci">
                    <option value="mci">Moulins de Côte d'Ivoire (MCI)</option>
                    <option value="gmd">Grands Moulins d'Abidjan (GMA)</option>
                    <option value="local">Fournisseur Local Abidjan</option>
                  </Select>
                </FormField>

                <FormField label="Notes & Observations du Chef">
                  <Textarea placeholder="Indiquer la température ambiante, hygrométrie ou état des sacs..." />
                </FormField>
              </div>

              <div className="mt-6 pt-5 border-t border-[#181d2a] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cb1"
                      checked={checkboxChecked}
                      onCheckedChange={setCheckboxChecked}
                    />
                    <label htmlFor="cb1" className="text-xs text-gray-300 cursor-pointer">
                      Générer bon de réception
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={switchChecked}
                      onCheckedChange={setSwitchChecked}
                    />
                    <span className="text-xs text-gray-300">
                      Certification FNE automatique
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputError(!inputError)}
                  >
                    Simuler Erreur Validation
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      toast({
                        type: "success",
                        title: "Formulaire Validé",
                        message: "Les matières premières ont été imputées au stock avec succès.",
                      });
                    }}
                  >
                    Enregistrer la Réception
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. TABLEAUX & DONNÉES */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Composant DataTable & Système de Filtres</CardTitle>
              <CardDescription>
                Exemple complet avec recherche temps réel, filtres à facettes, statut d'alerte et pagination.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FilterBar
                searchValue={tableSearch}
                onSearchChange={setTableSearch}
                searchPlaceholder="Filtrer par code ou nom de matière..."
                facets={
                  <Select
                    value={tableFilterCategory}
                    onChange={(e) => setTableFilterCategory(e.target.value)}
                    className="w-40 bg-[#090b12]"
                  >
                    <option value="all">Toutes catégories</option>
                    <option value="Farines">Farines</option>
                    <option value="Levures">Levures</option>
                    <option value="Additifs">Additifs</option>
                    <option value="Pâtisserie">Pâtisserie</option>
                  </Select>
                }
                activeFilterCount={tableSearch ? 1 : 0}
                onClearFilters={() => setTableSearch("")}
              />

              <DataTable
                columns={columns}
                data={filteredData}
                keyExtractor={(item) => item.id}
                emptyMessage="Aucune matière trouvée correspondant à vos critères"
                total={filteredData.length}
                pageSize={10}
              />
            </CardContent>
          </Card>

          {/* États Empty & Error */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EmptyState
              title="Aucune Fournée Planifiée"
              description="Le fournil n'a aucun ordre de fabrication en cours pour le shift d'après-midi."
              actionLabel="Créer un Ordre de Fournée"
              onAction={() => {
                toast({ type: "info", title: "Action", message: "Redirection vers le module Production" });
              }}
            />

            <ErrorState
              title="Déconnexion Service Fiscal FNE"
              message="Le serveur de télédéclaration DGI ne répond pas. Les ventes restent enregistrées localement en mode tampon sécurisé."
              onRetry={() => {
                toast({ type: "info", title: "Test Retry", message: "Tentative de reconnexion au webhook DGI..." });
              }}
            />
          </div>
        </TabsContent>

        {/* 4. FEEDBACK & MODALES */}
        <TabsContent value="feedback" className="space-y-6">
          <Section title="Alertes In-Page" description="Messages informatifs, avertissements d'écarts et blocages fiscaux.">
            <div className="space-y-3">
              <Alert variant="default" title="Information Système">
                Sauvegarde automatique du journal de caisse effectuée avec succès sur le serveur central.
              </Alert>

              <Alert variant="warning" title="Alerte Rendement Pétrin">
                Le taux d'hydratation de la tournée N° 12 est de 62% au lieu de 66% prescrit dans la recette standard.
              </Alert>

              <Alert variant="destructive" title="Écart de Caisse Constaté">
                Une différence négative de 1 200 FCFA a été saisie lors du comptage d'espèces au tiroir caisse.
              </Alert>

              <Alert variant="success" title="Facture FNE Certifiée">
                La facture B2B N° 2026-FNE-0987 a reçu son visa électronique officiel DGI.
              </Alert>
            </div>
          </Section>

          <Section title="Contrôles Modaux & Tiroirs (Drawer / Sheet)">
            <div className="flex flex-wrap gap-3 bg-[#0c0f18] border border-[#1e2538] p-4 rounded-xl">
              <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
                Dialogue d'Information
              </Button>
              <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
                Dialogue de Confirmation
              </Button>
              <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
                Panneau Latéral (Drawer)
              </Button>
            </div>
          </Section>

          <Section title="Accordéons & Menus Déroulants">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <AccordionItem title="Règles de Calcul du Prix de Revient Pain" defaultOpen>
                  Le coût de revient intègre : Farine (55%), Levure (4%), Sel (1%), Eau & Énergie four (15%), 
                  Main d&apos;œuvre directe boulangers (25%). Chaque calcul respecte l&apos;arithmétique entière sans virgule flottante.
                </AccordionItem>
                <AccordionItem title="Procédure de Clôture Caisse Journalière">
                  1. Comptage des billets et pièces par coupure.
                  2. Saisie du total dans l&apos;écran de caisse.
                  3. Calcul automatique de l&apos;écart par rapport aux encaissements enregistrés.
                  4. Signature électronique et consignation immédiate dans l&apos;AuditLog.
                </AccordionItem>
              </div>

              <div className="p-5 rounded-xl border border-[#1e2538] bg-[#0c0f18] space-y-4">
                <h4 className="text-xs font-semibold text-white">Menu Contextuel Dropdown</h4>
                <DropdownMenu
                  trigger={
                    <Button variant="secondary" size="sm">
                      Actions Fournil <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  }
                >
                  <DropdownMenuItem onClick={() => toast({ type: "info", title: "Action", message: "Impression ticket lancée" })}>
                    Imprimer Fiche de Fournée
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ type: "info", title: "Action", message: "Export pesées" })}>
                    Exporter Fiche de Pesée
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive onClick={() => setIsConfirmOpen(true)}>
                    Annuler la Fournée
                  </DropdownMenuItem>
                </DropdownMenu>

                <div className="pt-2">
                  <Tooltip content="Le code RNE est obligatoire pour la certification FNE">
                    <span className="text-xs text-amber-400 underline cursor-help">
                      Survoler pour voir l&apos;infobulle Tooltip
                    </span>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Section>
        </TabsContent>

        {/* 5. TOKENS & TYPOGRAPHIE */}
        <TabsContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiérarchie Typographique du Projet</CardTitle>
              <CardDescription>Police sans-serif haute lisibilité, alignements stricts et accents de contraste.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 pb-4 border-b border-[#181d2a]">
                <div className="text-2xl font-bold tracking-tight text-white">
                  Display / Titre Écran : Boulangerie & Pâtisserie Ivoire Excellence
                </div>
                <div className="text-lg font-semibold text-white">
                  H2 Section : Contrôle Journalier du Fournil & Farinier
                </div>
                <div className="text-sm font-medium text-gray-200">
                  Body Medium : Chaque gramme de farine, chaque pain cuit, chaque franc encaissé est tracé.
                </div>
                <div className="text-xs text-gray-400">
                  Body Regular : Les baguettes traditionnelles bénéficient d&apos;une fermentation longue de 16h à 4°C.
                </div>
                <div className="text-[11px] font-mono text-amber-400">
                  Caption Monospace : REF-FNE-2026-003891 · 24 500 FCFA · LOT #FL-2026-10-08
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white mb-3">Échelle des Rayons de Bordure (Border Radius)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 bg-[#131724] border border-[#22293c] rounded-md text-gray-300">
                    rounded-md (6px)<br/><span className="text-[10px] text-gray-500">Boutons, badges</span>
                  </div>
                  <div className="p-3 bg-[#131724] border border-[#22293c] rounded-lg text-gray-300">
                    rounded-lg (8px)<br/><span className="text-[10px] text-gray-500">Inputs, selects</span>
                  </div>
                  <div className="p-3 bg-[#131724] border border-[#22293c] rounded-xl text-gray-300">
                    rounded-xl (12px)<br/><span className="text-[10px] text-gray-500">Cards, dropdowns</span>
                  </div>
                  <div className="p-3 bg-[#131724] border border-[#22293c] rounded-2xl text-gray-300">
                    rounded-2xl (16px)<br/><span className="text-[10px] text-gray-500">Modales, containers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales Interactives de Démonstration */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Dialogue Modal Design System"
        description="Composant de boîte de dialogue accessible avec fermeture par Échap ou clic extérieur."
      >
        <div className="space-y-3 text-xs text-gray-300">
          <p>
            Cette modale utilise un flou d&apos;arrière-plan (`backdrop-blur-xs`), un rayon de 16px (`rounded-2xl`) et une ombre portée profonde conformément aux règles Vercel/Linear.
          </p>
          <div className="flex justify-end pt-3 border-t border-[#1b2132]">
            <Button variant="primary" size="sm" onClick={() => setIsDialogOpen(false)}>
              Compris
            </Button>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          toast({
            type: "error",
            title: "Action Confirmée",
            message: "L'opération sensible a été exécutée et enregistrée dans l'AuditLog.",
          });
        }}
        title="Confirmer la Déclaration de Rebut"
        description="Cette action imputera définitivement 15 baguettes brûlées en perte d'exploitation. Un enregistrement sera versé à la piste d'audit."
        confirmLabel="Confirmer le rebut"
        variant="destructive"
      />

      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Détail du Lot de Farine"
        description="Fiche technique et historique des mouvements de stock."
      >
        <div className="space-y-4 text-xs text-gray-300">
          <div className="bg-[#121624] p-3 rounded-lg border border-[#1f2638] space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Numéro de Lot :</span>
              <span className="text-white">LOT-MCI-2026-44</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fournisseur :</span>
              <span className="text-white">Moulins de CI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date réception :</span>
              <span className="text-white">08/10/2026 06:30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">DLUO / Expiration :</span>
              <span className="text-amber-400">08/04/2027</span>
            </div>
          </div>
          <p>
            Le moteur FEFO (First Expired, First Out) de l&apos;étape 04 utilisera automatiquement ce panneau pour l&apos;inspection des dates de péremption des sacs.
          </p>
        </div>
      </Sheet>
    </PageContainer>
  );
}
