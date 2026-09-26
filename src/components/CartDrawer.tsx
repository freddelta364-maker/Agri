import React from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Wheat,
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  lowDataMode: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  lowDataMode,
}) => {
  if (!isOpen) return null;

  const totalProductsAmount = cart.reduce(
    (sum, item) => sum + item.product.pricePerUnit * item.quantity,
    0
  );

  // Estimated inter-urban transport based on quantity & weight
  const estimatedTransportFee = cart.length > 0 ? 3000 + cart.length * 1500 : 0;
  const grandTotal = totalProductsAmount + estimatedTransportFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-black">Mon Panier Agricole</h2>
              <span className="bg-emerald-800 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {cart.length} article{cart.length > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-stone-400">
                <ShoppingCart className="w-12 h-12 stroke-1" />
                <h3 className="text-sm font-bold text-stone-700">Votre panier est vide</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Sélectionnez des récoltes fraîches sur le marché (plantain, tomates, poivre de Penja...) pour lancer une commande groupée.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-sm"
                >
                  Découvrir les produits
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const subtotal = item.product.pricePerUnit * item.quantity;
                return (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      {lowDataMode ? (
                        <div className="w-full h-full bg-emerald-900 flex items-center justify-center text-amber-400">
                          <Wheat className="w-6 h-6" />
                        </div>
                      ) : (
                        <img
                          src={item.product.photoUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-stone-400 hover:text-red-600 p-0.5"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate">
                          {item.product.farmerName} • {item.product.locationName}
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-800">
                          {item.product.pricePerUnit.toLocaleString('fr-FR')} FCFA / {item.product.unit}
                        </p>
                      </div>

                      {/* Quantity Controls & Subtotal */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center text-xs font-bold shadow-2xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                Math.min(item.product.stockQuantity, item.quantity + 1)
                              )
                            }
                            className="w-6 h-6 rounded bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center text-xs font-bold shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-stone-900">
                          {subtotal.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with breakdown & checkout */}
          {cart.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Total produits vivriers</span>
                  <span className="font-bold text-stone-800">
                    {totalProductsAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-emerald-700" />
                    Estimation acheminement interurbain
                  </span>
                  <span className="font-semibold text-stone-800">
                    {estimatedTransportFee.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-sm font-black text-stone-900">Total à régler</span>
                  <span className="text-lg font-black text-emerald-950">
                    {grandTotal.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-emerald-100/60 rounded-xl text-[11px] text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Paiement sécurisé MTN MoMo / Orange Money sous séquestre Tontine.</span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
              >
                <span>Commander avec Paiement Mobile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
