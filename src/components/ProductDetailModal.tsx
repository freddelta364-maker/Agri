import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  Phone,
  MessageCircle,
  Plus,
  Minus,
  ShoppingCart,
  Wheat,
  Share2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { Product } from '../types';
import { createProductWhatsAppLink } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenDirectChat: (product: Product) => void;
  lowDataMode: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenDirectChat,
  lowDataMode,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(product.minOrderQuantity || 1);
  const [copied, setCopied] = useState(false);

  const subtotal = quantity * product.pricePerUnit;
  const waLink = createProductWhatsAppLink(
    product,
    `Bonjour ${product.farmerName}, je suis intéressé par votre lot de *${product.name}* sur AGRI LINK CAM. Je souhaite commander *${quantity} ${product.unit}(s)* pour un montant estimé de *${subtotal.toLocaleString('fr-FR')} FCFA*. Pouvons-nous échanger sur la livraison et le point de collecte ?`
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `AGRI LINK CAM : ${product.name}`,
          text: `Découvrez ce lot de ${product.name} à ${product.pricePerUnit} FCFA/${product.unit} sur AGRI LINK CAM`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${product.name} - ${product.pricePerUnit} FCFA/${product.unit} sur AGRI LINK CAM`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Media */}
        <div className="relative h-56 sm:h-72 w-full bg-stone-900 overflow-hidden">
          {lowDataMode ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 text-white p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-800/80 border border-emerald-400/40 flex items-center justify-center mb-3">
                <Wheat className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-xl font-black text-center">{product.name}</h2>
              <p className="text-xs text-amber-300 mt-1">{product.category} • {product.region}</p>
            </div>
          ) : (
            <img
              src={product.photoUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}

          {/* Badges Overlay */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            <span className="bg-emerald-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
              {product.category}
            </span>
            <span className="bg-amber-400 text-stone-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
              {product.qualityGrade}
            </span>
            {product.isOrganic && (
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                100% Terroir Naturel
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.locationName} ({product.region})</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 leading-snug">
                {product.name}
              </h2>
            </div>

            <div className="text-right sm:shrink-0 bg-stone-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
              <div className="text-xs text-stone-500 font-medium">Prix unitaire</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-900">
                {product.pricePerUnit.toLocaleString('fr-FR')}{' '}
                <span className="text-xs font-bold text-stone-600">FCFA / {product.unit}</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            {product.description}
          </p>

          {/* Farmer & Harvest details card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Producteur Partenaire Vérifié</span>
              </div>
              <div className="text-stone-800 font-semibold">{product.farmerName}</div>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={`tel:${product.farmerPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  <span>{product.farmerPhone}</span>
                </a>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-700 font-bold">
                <Calendar className="w-4 h-4 text-stone-500" />
                <span>Disponibilité & Fraîcheur</span>
              </div>
              <div className="text-stone-600">
                Récolté le <span className="font-semibold text-stone-800">{product.harvestDate}</span>
              </div>
              <div className="text-stone-600">
                Stock disponible : <span className="font-bold text-emerald-800">{product.stockQuantity}</span> {product.unit}s
              </div>
            </div>
          </div>

          {/* Quantity selector & Subtotal Calculator */}
          <div className="bg-stone-100 p-4 rounded-2xl border border-stone-300/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">
                Quantité souhaitée ({product.unit}s) :
              </span>
              <span className="text-[11px] text-stone-500">
                Min : {product.minOrderQuantity} {product.unit}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-stone-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(product.minOrderQuantity || 1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold active:scale-95 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min={product.minOrderQuantity || 1}
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || product.minOrderQuantity;
                    setQuantity(Math.min(product.stockQuantity, Math.max(product.minOrderQuantity || 1, val)));
                  }}
                  className="w-16 text-center font-bold text-stone-900 text-sm focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-stone-500 font-medium">Montant estimé</div>
                <div className="text-lg sm:text-xl font-black text-emerald-950">
                  {subtotal.toLocaleString('fr-FR')} <span className="text-xs font-bold text-stone-600">FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {/* WhatsApp Direct Action Button (Highlight requirement) */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Contacter sur WhatsApp</span>
            </a>

            {/* In-app Message Négocier */}
            <button
              onClick={() => {
                onClose();
                onOpenDirectChat(product);
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-900 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>Négocier sur l'App</span>
            </button>

            {/* Add to Cart */}
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Ajouter au Panier</span>
            </button>
          </div>

          {/* Share & Copy */}
          <div className="flex justify-between items-center text-xs text-stone-500 pt-1">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-stone-800"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Lien copié !' : 'Partager ce lot'}</span>
            </button>

            <span className="text-[11px] text-stone-400">
              Transactions garanties par Tontine AgriLink
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
