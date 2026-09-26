import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { FarmerStockRecord, ProductCategory } from '../types';

interface FarmerStockViewProps {
  stocks: FarmerStockRecord[];
  onAddStock: (stock: FarmerStockRecord) => void;
  onUpdateStock: (stock: FarmerStockRecord) => void;
  onDeleteStock: (id: string) => void;
  isOnline: boolean;
}

export const FarmerStockView: React.FC<FarmerStockViewProps> = ({
  stocks,
  onAddStock,
  onUpdateStock,
  onDeleteStock,
  isOnline,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  // New stock form state
  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Tubercules & Féculents');
  const [parcelName, setParcelName] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalHarvested, setTotalHarvested] = useState<number>(50);
  const [unit, setUnit] = useState<FarmerStockRecord['unit']>('sac 50kg');
  const [unitPriceFCFA, setUnitPriceFCFA] = useState<number>(15000);
  const [storageLocation, setStorageLocation] = useState('Hangar principal au champ');
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [condition, setCondition] = useState<FarmerStockRecord['condition']>('EXCELLENT');
  const [notes, setNotes] = useState('');

  // Calculations
  const totalValueFCFA = stocks.reduce(
    (acc, s) => acc + s.availableQuantity * s.unitPriceFCFA,
    0
  );
  const urgentCount = stocks.filter((s) => s.condition === 'VENTE_URGENTE').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    const newRecord: FarmerStockRecord = {
      id: `stock-${Date.now()}`,
      cropName,
      category,
      parcelName: parcelName || 'Parcelle non renseignée',
      harvestDate,
      totalHarvested,
      reservedQuantity: 0,
      availableQuantity: totalHarvested,
      unit,
      unitPriceFCFA,
      storageLocation,
      expiryDate,
      condition,
      notes,
      isSynced: isOnline,
    };

    onAddStock(newRecord);
    setShowAddForm(false);

    // Reset form
    setCropName('');
    setNotes('');
  };

  const handleAdjustQuantity = (stock: FarmerStockRecord, delta: number) => {
    const newQty = Math.max(0, stock.availableQuantity + delta);
    onUpdateStock({
      ...stock,
      availableQuantity: newQty,
      isSynced: isOnline,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header & Stats Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white p-4 sm:p-6 rounded-3xl border border-emerald-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-amber-300 text-xs font-bold mb-2 border border-emerald-700">
              <Package className="w-3.5 h-3.5" />
              <span>Espace Agriculteur & Gestion de Parcelles</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Gestion de mes Stocks et Récoltes
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
              Enregistrez vos récoltes même sans connexion internet en plein champ. Vos stocks seront consultables et automatiquement synchronisés sur la place de marché locale.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Fermer le formulaire' : 'Déclarer une Récolte'}</span>
          </button>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-emerald-800/80">
          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/60">
            <span className="text-[11px] text-emerald-300 font-semibold block">
              Lots en Stock Actuel
            </span>
            <span className="text-xl sm:text-2xl font-black text-white">
              {stocks.length}
            </span>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/60">
            <span className="text-[11px] text-amber-300 font-semibold block">
              Valeur Estimée en Stock
            </span>
            <span className="text-base sm:text-xl font-black text-white">
              {totalValueFCFA.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-bold text-amber-300">FCFA</span>
            </span>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/60 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-red-300 font-semibold block">
              Alertes Vente Urgente
            </span>
            <span className="text-xl sm:text-2xl font-black text-red-400">
              {urgentCount} {urgentCount > 1 ? 'lots' : 'lot'}
            </span>
          </div>
        </div>
      </div>

      {/* Offline Notice Badge for Rural Area */}
      {!isOnline && (
        <div className="bg-amber-100 border border-amber-300 text-amber-900 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs">
          <WifiOff className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <strong>Mode Hors-Ligne Zone Rurale :</strong> Vous pouvez ajouter ou modifier vos récoltes sans réseau. Toutes les données sont gardées en mémoire sur votre téléphone et publiées dès votre retour en zone couverte.
          </div>
        </div>
      )}

      {/* Add Stock Form (Collapsible) */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-md space-y-4"
        >
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Déclaration d'une Nouvelle Récolte / Stock</span>
            </h3>
            <span className="text-xs text-stone-400">Fonctionne 100% hors-ligne</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Culture / Produit agricole *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Plantain Gros Michel, Tomate Kobra..."
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Tubercules & Féculents">Tubercules & Féculents</option>
                <option value="Légumes & Maraîchers">Légumes & Maraîchers</option>
                <option value="Fruits & Régimes">Fruits & Régimes</option>
                <option value="Épices & Aromates">Épices & Aromates</option>
                <option value="Céréales & Grains">Céréales & Grains</option>
                <option value="Cultures de Rente">Cultures de Rente</option>
                <option value="Huiles & Dérivés">Huiles & Dérivés</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Nom de la Parcelle / Hangar
              </label>
              <input
                type="text"
                placeholder="Ex: Champ du bas-fond, Hangar Ouest..."
                value={parcelName}
                onChange={(e) => setParcelName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Quantité Récoltée
              </label>
              <input
                type="number"
                min="1"
                required
                value={totalHarvested}
                onChange={(e) => setTotalHarvested(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Unité de mesure</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as FarmerStockRecord['unit'])}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="sac 50kg">Sac de 50 kg</option>
                <option value="sac 100kg">Sac de 100 kg</option>
                <option value="régime">Régime</option>
                <option value="cageot">Cageot</option>
                <option value="filet">Filet</option>
                <option value="kg">Kilogramme (kg)</option>
                <option value="bidon 20L">Bidon 20L</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Prix Unitaire Espéré (FCFA)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={unitPriceFCFA}
                onChange={(e) => setUnitPriceFCFA(parseInt(e.target.value) || 100)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Date de Récolte
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                État / Degré d'urgence
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as FarmerStockRecord['condition'])}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold"
              >
                <option value="EXCELLENT">Excellent (Frais, récolté du jour)</option>
                <option value="BON">Bon état (Conservation normale)</option>
                <option value="VENTE_URGENTE">Vente Urgente (Périssable à écouler)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Lieu d'entreposage
              </label>
              <input
                type="text"
                placeholder="Ex: Hangar ventilé Penja..."
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md"
            >
              Enregistrer le Stock
            </button>
          </div>
        </form>
      )}

      {/* Stocks Table / List */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-stone-800 uppercase tracking-wider px-1">
          Inventaire Actif ({stocks.length} récoltes enregistrées)
        </h3>

        {stocks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-2">
            <Package className="w-10 h-10 text-stone-400 mx-auto" />
            <h4 className="text-sm font-bold text-stone-700">Aucun stock déclaré pour l'instant</h4>
            <p className="text-xs text-stone-500">
              Déclarez votre première récolte pour suivre vos volumes et les vendre aux grossistes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stocks.map((stock) => {
              const stockValue = stock.availableQuantity * stock.unitPriceFCFA;
              const isUrgent = stock.condition === 'VENTE_URGENTE';

              return (
                <div
                  key={stock.id}
                  className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition flex flex-col justify-between ${
                    isUrgent
                      ? 'border-red-300 bg-red-50/20'
                      : 'border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
                            {stock.cropName}
                          </h4>
                          {!stock.isSynced && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> Hors-ligne
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">{stock.parcelName}</p>
                      </div>

                      {isUrgent ? (
                        <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          Vente Urgente
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          En Stock
                        </span>
                      )}
                    </div>

                    {/* Quantities breakdown */}
                    <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-center">
                      <div>
                        <span className="text-[10px] text-stone-500 block">Récolté</span>
                        <span className="font-extrabold text-stone-800 text-xs sm:text-sm">
                          {stock.totalHarvested} {stock.unit}s
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">Réservé</span>
                        <span className="font-extrabold text-amber-700 text-xs sm:text-sm">
                          {stock.reservedQuantity} {stock.unit}s
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">Disponible</span>
                        <span className="font-black text-emerald-800 text-xs sm:text-sm">
                          {stock.availableQuantity} {stock.unit}s
                        </span>
                      </div>
                    </div>

                    {/* Stock Details */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-stone-600 pt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Récolté le {stock.harvestDate}</span>
                      </div>
                      <div className="font-bold text-stone-800">
                        {stock.unitPriceFCFA.toLocaleString('fr-FR')} FCFA / {stock.unit}
                      </div>
                    </div>

                    {stock.storageLocation && (
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        <span>{stock.storageLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity quick adjustment controls & Value */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-medium">Valeur du lot</span>
                      <span className="font-black text-sm text-emerald-950">
                        {stockValue.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustQuantity(stock, -1)}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-xs active:scale-95"
                        title="Réduire de 1"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleAdjustQuantity(stock, 1)}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-xs active:scale-95"
                        title="Ajouter 1"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onDeleteStock(stock.id)}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-500 hover:text-red-700 flex items-center justify-center text-xs active:scale-95 ml-1"
                        title="Supprimer ce stock"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
