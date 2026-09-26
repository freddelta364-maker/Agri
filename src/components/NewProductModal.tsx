import React, { useState } from 'react';
import { X, Sparkles, Plus, Image, AlertCircle, Check } from 'lucide-react';
import { Product, ProductCategory, RegionCameroon } from '../types';
import { CAMEROON_REGIONS } from '../data/mockData';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Tubercules & Féculents');
  const [region, setRegion] = useState<RegionCameroon>('Littoral (Douala)');
  const [locationName, setLocationName] = useState('Njombé - Moungo');
  const [pricePerUnit, setPricePerUnit] = useState<number>(5000);
  const [unit, setUnit] = useState<Product['unit']>('régime');
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [minOrderQuantity, setMinOrderQuantity] = useState<number>(5);
  const [farmerName, setFarmerName] = useState('Papa Jean-Baptiste Njoh');
  const [farmerPhone, setFarmerPhone] = useState('+237 677 42 19 88');
  const [farmerWhatsApp, setFarmerWhatsApp] = useState('237677421988');
  const [isOrganic, setIsOrganic] = useState(true);
  const [qualityGrade, setQualityGrade] = useState<Product['qualityGrade']>(
    'Grade 1 (Export/Supérieur)'
  );
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&auto=format&fit=crop&q=80'
  );
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name,
      category,
      region,
      locationName,
      pricePerUnit,
      unit,
      stockQuantity,
      minOrderQuantity,
      harvestDate: new Date().toISOString().split('T')[0],
      farmerId: 'farm-current',
      farmerName,
      farmerPhone,
      farmerWhatsApp,
      isOrganic,
      qualityGrade,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      description: description || `Lot frais récolté au Cameroun (${locationName}). Traçabilité garantie.`,
      freshnessDaysRemaining: 14,
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black">Publier un Lot sur le Marché</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Nom du produit / variété *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Plantain Gros Michel de Penja, Macabo blanc..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
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
                Région du Terroir
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionCameroon)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
              >
                {CAMEROON_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Localité précise
              </label>
              <input
                type="text"
                placeholder="Ex: Foumbot, Penja..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Unité de vente
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Product['unit'])}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
              >
                <option value="régime">Régime</option>
                <option value="cageot">Cageot</option>
                <option value="sac 50kg">Sac 50kg</option>
                <option value="sac 100kg">Sac 100kg</option>
                <option value="filet">Filet</option>
                <option value="kg">Kg</option>
                <option value="bidon 20L">Bidon 20L</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(parseInt(e.target.value) || 100)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Quantité en stock
              </label>
              <input
                type="number"
                min="1"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Commande min.
              </label>
              <input
                type="number"
                min="1"
                value={minOrderQuantity}
                onChange={(e) => setMinOrderQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Nom du producteur / Coopérative
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Numéro WhatsApp (+237)
              </label>
              <input
                type="text"
                value={farmerWhatsApp}
                onChange={(e) => setFarmerWhatsApp(e.target.value)}
                placeholder="2376XXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">
              Description & Qualité du lot
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Récolté hier soir, gros calibres, maturité idéale pour conservation ou revente..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="organicCheck"
              checked={isOrganic}
              onChange={(e) => setIsOrganic(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <label htmlFor="organicCheck" className="text-xs font-bold text-stone-700 cursor-pointer">
              Certifié culture naturelle / sans pesticides chimiques
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md"
            >
              Publier sur AGRI LINK CAM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
