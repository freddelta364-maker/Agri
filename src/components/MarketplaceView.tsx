import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  Phone,
  MessageCircle,
  Plus,
  Check,
  AlertTriangle,
  SlidersHorizontal,
  Sparkles,
  Wheat,
} from 'lucide-react';
import { Product, ProductCategory, RegionCameroon } from '../types';
import { CAMEROON_REGIONS } from '../data/mockData';
import { createProductWhatsAppLink } from '../utils/whatsapp';

interface MarketplaceViewProps {
  products: Product[];
  lowDataMode: boolean;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onOpenDirectChat: (product: Product) => void;
  onOpenNewProductModal: () => void;
  userRole: 'ACHETEUR' | 'AGRICULTEUR';
}

const CATEGORIES: ('TOUS' | ProductCategory)[] = [
  'TOUS',
  'Tubercules & Féculents',
  'Légumes & Maraîchers',
  'Fruits & Régimes',
  'Épices & Aromates',
  'Céréales & Grains',
  'Cultures de Rente',
  'Huiles & Dérivés',
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  lowDataMode,
  onAddToCart,
  onSelectProduct,
  onOpenDirectChat,
  onOpenNewProductModal,
  userRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('TOUS');
  const [selectedCategory, setSelectedCategory] = useState<string>('TOUS');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === 'TOUS' || p.region === selectedRegion;

      const matchesCategory =
        selectedCategory === 'TOUS' || p.category === selectedCategory;

      const matchesOrganic = !organicOnly || p.isOrganic;

      return matchesSearch && matchesRegion && matchesCategory && matchesOrganic;
    });
  }, [products, searchQuery, selectedRegion, selectedCategory, organicOnly]);

  const handleAddWithFeedback = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p);
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Hero Banner for Cameroon Agriculture */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white p-4 sm:p-6 overflow-hidden border border-emerald-800 shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-amber-400">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-semibold mb-2.5 border border-emerald-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marché Agricole Direct du Cameroun</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Relier les terroirs camerounais aux acheteurs locaux
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
            Achetez directement aux coopératives et exploitants du Moungo, de Foumbot, de Maroua et du Bassin de la Meme. Paiements sécurisés MoMo & Orange Money avec assistance WhatsApp instantanée.
          </p>

          {userRole === 'AGRICULTEUR' && (
            <div className="mt-3">
              <button
                onClick={onOpenNewProductModal}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Publier une Récolte / Vendre mes produits</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher plantain, tomates de Foumbot, poivre de Penja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Region Select */}
          <div className="w-full sm:w-56 shrink-0">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700 font-medium text-stone-800"
            >
              <option value="TOUS">Toutes les régions (Cameroun)</option>
              {CAMEROON_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Bio filter checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 shrink-0 select-none">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span>Bio / Naturel</span>
          </label>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-stone-400 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider pl-1 mr-1">
            <SlidersHorizontal className="w-3 h-3" />
            Catégories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center px-1">
        <p className="text-xs font-bold text-stone-600">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''} sur le marché
        </p>
        {lowDataMode && (
          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            ⚡ Mode Bas Débit actif : compression visuelle
          </span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Wheat className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">Aucun produit ne correspond à ces critères</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Essayez d'élargir votre recherche ou de sélectionner « Toutes les régions » pour voir les récoltes disponibles au Cameroun.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('TOUS');
              setSelectedCategory('TOUS');
              setOrganicOnly(false);
            }}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const waLink = createProductWhatsAppLink(p);
            const isAdded = addedIds[p.id];

            return (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col cursor-pointer hover:border-emerald-500"
              >
                {/* Visual / Image header */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden shrink-0">
                  {lowDataMode ? (
                    // Low Data Mode Badge: lightweight SVG graphic
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 to-stone-900 text-white p-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-800/80 border border-emerald-400/40 flex items-center justify-center mb-2">
                        <Wheat className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="text-xs font-black text-center text-stone-100 line-clamp-1">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-amber-300 font-medium">
                        {p.category}
                      </span>
                    </div>
                  ) : (
                    // Regular Image with smooth load
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Badges on top of card */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {p.isUrgentSale && (
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> Vente Urgente
                      </span>
                    )}
                    {p.isOrganic && (
                      <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Naturel / Bio
                      </span>
                    )}
                  </div>

                  {/* Quality Grade Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-stone-950/80 backdrop-blur-xs text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-400/30">
                      {p.unit}
                    </span>
                  </div>

                  {/* Stock tag */}
                  <div className="absolute bottom-2.5 left-2.5 bg-stone-950/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-semibold">
                    Stock : <span className="text-amber-400 font-bold">{p.stockQuantity}</span> {p.unit}s
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Location & Region */}
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium mb-1">
                      <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span className="line-clamp-1">{p.locationName}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-stone-900 leading-snug group-hover:text-emerald-800 transition line-clamp-2">
                      {p.name}
                    </h3>

                    {/* Description preview */}
                    <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Farmer profile micro-strip */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-semibold text-stone-800 text-[11px] truncate max-w-[130px]">
                        {p.farmerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-stone-500">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>Récolté le {p.harvestDate}</span>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-stone-400 block font-medium">Prix unitaire</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-black text-emerald-900">
                          {p.pricePerUnit.toLocaleString('fr-FR')}
                        </span>
                        <span className="text-[11px] font-bold text-stone-600">FCFA</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* WhatsApp Direct Button */}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Discuter directement sur WhatsApp"
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition active:scale-95 shadow-xs flex items-center justify-center"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                      </a>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddWithFeedback(p, e)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-amber-400 hover:bg-amber-500 text-stone-950'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ajouté</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Panier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
