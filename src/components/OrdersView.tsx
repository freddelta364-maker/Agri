import React from 'react';
import {
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Order } from '../types';
import { createOrderWhatsAppLink } from '../utils/whatsapp';

interface OrdersViewProps {
  orders: Order[];
  onOpenMarketplace: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onOpenMarketplace }) => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white p-4 sm:p-6 rounded-3xl border border-emerald-800 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Traçabilité & Reçus
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black">
          Mes Commandes & Bordereaux de Livraison
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-emerald-200/90 max-w-xl">
          Retrouvez vos achats, statut de paiement mobile (MTN MoMo / Orange Money), références de transaction et contact direct WhatsApp des producteurs.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">Aucune commande pour le moment</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Consultez le marché vivrier et passez votre première commande de denrées locales avec paiement sécurisé.
          </p>
          <button
            onClick={onOpenMarketplace}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md transition"
          >
            Explorer les produits vivriers
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const firstFarmerWhatsApp = order.items[0]?.farmerWhatsApp || '237677421988';
            const waOrderUrl = createOrderWhatsAppLink(order, firstFarmerWhatsApp);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-stone-900">
                        {order.reference}
                      </span>
                      <span className="text-xs text-stone-400">• {order.date}</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Livraison à : <span className="font-semibold text-stone-800">{order.deliveryCity} ({order.deliveryAddress})</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      {order.paymentStatus === 'SECURISE_ESCROW'
                        ? 'Fonds sous Séquestre'
                        : order.paymentStatus === 'PAYE'
                        ? 'Payé'
                        : 'En attente réception'}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      <Truck className="w-3.5 h-3.5 text-stone-500" />
                      {order.orderStatus === 'CONFIRMEE'
                        ? 'Confirmée'
                        : order.orderStatus === 'EN_TRANSIT'
                        ? 'En transit'
                        : 'Livrée'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Détail des denrées commandées :
                  </div>
                  <div className="divide-y divide-stone-100 text-xs">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-stone-900">{it.productName}</span>
                          <span className="text-stone-500 ml-2">
                            ({it.quantity} {it.unit}s à {it.pricePerUnit.toLocaleString('fr-FR')} FCFA)
                          </span>
                          <div className="text-[10px] text-emerald-800 font-semibold">
                            Fournisseur : {it.farmerName}
                          </div>
                        </div>
                        <div className="font-black text-stone-900">
                          {it.subtotal.toLocaleString('fr-FR')} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with totals & WhatsApp delivery button */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-stone-500">
                      Moyen de règlement :{' '}
                      <span className="font-semibold text-stone-800">
                        {order.paymentMethod === 'MTN_MOMO'
                          ? 'MTN Mobile Money'
                          : order.paymentMethod === 'ORANGE_MONEY'
                          ? 'Orange Money'
                          : 'Cash à réception'}
                      </span>
                    </div>
                    <div className="text-sm font-black text-emerald-950 mt-0.5">
                      Total réglé : {order.totalAmount.toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>

                  {/* WhatsApp tracking button */}
                  <a
                    href={waOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Coordonner la livraison sur WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
