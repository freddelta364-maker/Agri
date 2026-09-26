import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  MessageCircle,
  Truck,
  Printer,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { CartItem, Order, PaymentMethod, RegionCameroon } from '../types';
import { CAMEROON_REGIONS } from '../data/mockData';
import { createOrderWhatsAppLink } from '../utils/whatsapp';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderComplete: (order: Order) => void;
}

type Step = 'DELIVERY_FORM' | 'PAYMENT_SELECTION' | 'USSD_SIMULATION' | 'CONFIRMATION';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderComplete,
}) => {
  if (!isOpen || cart.length === 0) return null;

  const [step, setStep] = useState<Step>('DELIVERY_FORM');
  const [buyerName, setBuyerName] = useState('Dieudonné Mbarga');
  const [buyerPhone, setBuyerPhone] = useState('677459012');
  const [deliveryRegion, setDeliveryRegion] = useState<RegionCameroon>('Littoral (Douala)');
  const [deliveryCity, setDeliveryCity] = useState('Douala');
  const [deliveryAddress, setDeliveryAddress] = useState('Marché Sandaga - Hall Vivres Frais');
  const [notes, setNotes] = useState('Livraison matinale souhaitée avant 8h.');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MTN_MOMO');
  const [momoPhone, setMomoPhone] = useState('677459012');
  const [ussdPin, setUssdPin] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Financial calculations
  const totalProducts = cart.reduce(
    (acc, item) => acc + item.product.pricePerUnit * item.quantity,
    0
  );
  const deliveryFee = 3000 + cart.length * 1500;
  const grandTotal = totalProducts + deliveryFee;

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !deliveryAddress) return;
    setStep('PAYMENT_SELECTION');
  };

  const handleStartPayment = () => {
    if (paymentMethod === 'CASH_ON_DELIVERY') {
      finalizeOrder('EN_ATTENTE');
    } else {
      setStep('USSD_SIMULATION');
    }
  };

  const handleConfirmUSSD = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      finalizeOrder('SECURISE_ESCROW');
    }, 1800);
  };

  const finalizeOrder = (paymentStatus: Order['paymentStatus']) => {
    const reference = `AGRI-CMR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      reference,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      buyerName,
      buyerPhone,
      buyerWhatsApp: buyerPhone,
      deliveryRegion,
      deliveryCity,
      deliveryAddress,
      items: cart.map((c) => ({
        productName: c.product.name,
        unit: c.product.unit,
        quantity: c.quantity,
        pricePerUnit: c.product.pricePerUnit,
        subtotal: c.product.pricePerUnit * c.quantity,
        farmerName: c.product.farmerName,
        farmerWhatsApp: c.product.farmerWhatsApp,
      })),
      totalProductsAmount: totalProducts,
      deliveryFee,
      totalAmount: grandTotal,
      paymentMethod,
      paymentPhone: momoPhone,
      paymentStatus,
      escrowGuaranteed: true,
      orderStatus: 'CONFIRMEE',
      notes,
    };

    setCompletedOrder(newOrder);
    onOrderComplete(newOrder);
    setStep('CONFIRMATION');
  };

  const firstFarmerWhatsApp = cart[0]?.product.farmerWhatsApp || '237677421988';
  const whatsappCoordinationUrl = completedOrder
    ? createOrderWhatsAppLink(completedOrder, firstFarmerWhatsApp)
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-black">
              ₵
            </div>
            <div>
              <h3 className="text-sm font-black">
                {step === 'DELIVERY_FORM' && '1. Point de Livraison au Cameroun'}
                {step === 'PAYMENT_SELECTION' && '2. Paiement Mobile Camerounais'}
                {step === 'USSD_SIMULATION' && '3. Validation Sécurisée du Transfert'}
                {step === 'CONFIRMATION' && 'Commande Confirmée & Reçu'}
              </h3>
              <p className="text-[10px] text-emerald-300">
                Paiement sécurisé via MTN MoMo / Orange Money
              </p>
            </div>
          </div>

          {step !== 'USSD_SIMULATION' && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Delivery Address Form */}
        {step === 'DELIVERY_FORM' && (
          <form onSubmit={handleDeliverySubmit} className="p-4 sm:p-6 space-y-4">
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <span className="text-stone-700 font-semibold">Total panier :</span>
              <span className="text-emerald-950 font-black text-sm">
                {grandTotal.toLocaleString('fr-FR')} FCFA{' '}
                <span className="text-[11px] font-normal text-stone-500">
                  (dont {deliveryFee.toLocaleString('fr-FR')} FCFA transport)
                </span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Nom complet du destinataire / Grossiste *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Numéro de téléphone WhatsApp (+237) *
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-stone-100 rounded-xl border border-stone-300 text-stone-600 font-bold">
                    +237
                  </span>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="6XXXXXXXX"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Région de réception *
                  </label>
                  <select
                    value={deliveryRegion}
                    onChange={(e) => setDeliveryRegion(e.target.value as RegionCameroon)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                  >
                    {CAMEROON_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Ville ou Commune *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="Ex: Douala, Yaoundé, Bafoussam..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Point de collecte / Adresse exacte *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Ex: Marché Sandaga, Carrefour Ndokoti, Marché Mfoundi..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Instructions pour le transporteur
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Appeler à l'arrivée au marché..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>Choisir le paiement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Mobile Payment Method Selection */}
        {step === 'PAYMENT_SELECTION' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="text-xs text-stone-600 space-y-1">
              <p>Sélectionnez votre opérateur de paiement mobile au Cameroun :</p>
            </div>

            {/* Payment Method Cards */}
            <div className="space-y-2.5">
              {/* MTN Mobile Money */}
              <div
                onClick={() => setPaymentMethod('MTN_MOMO')}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'MTN_MOMO'
                    ? 'border-yellow-500 bg-yellow-50/50 shadow-xs'
                    : 'border-stone-200 hover:border-yellow-400 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ffcc00] flex items-center justify-center font-black text-stone-900 text-xs shadow-xs">
                    MoMo
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900">
                      MTN Mobile Money
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Code USSD prompt *126# • Instantané & Sans frais cachés
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'MTN_MOMO'
                      ? 'border-yellow-600 bg-yellow-500 text-stone-950 font-bold text-xs'
                      : 'border-stone-300'
                  }`}
                >
                  {paymentMethod === 'MTN_MOMO' && '✓'}
                </div>
              </div>

              {/* Orange Money */}
              <div
                onClick={() => setPaymentMethod('ORANGE_MONEY')}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'ORANGE_MONEY'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                    : 'border-stone-200 hover:border-orange-400 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff7900] flex items-center justify-center font-black text-white text-xs shadow-xs">
                    OM
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900">
                      Orange Money Cameroun
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Code USSD prompt *150# • Validation par notification
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'ORANGE_MONEY'
                      ? 'border-orange-600 bg-orange-500 text-white font-bold text-xs'
                      : 'border-stone-300'
                  }`}
                >
                  {paymentMethod === 'ORANGE_MONEY' && '✓'}
                </div>
              </div>

              {/* Cash à la livraison */}
              <div
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-stone-200 hover:border-emerald-400 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center font-black text-white text-xs shadow-xs">
                    Cash
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900">
                      Paiement Cash à Réception
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Contrôle des cageots/sacs avant règlement au chauffeur
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-emerald-700 bg-emerald-600 text-white font-bold text-xs'
                      : 'border-stone-300'
                  }`}
                >
                  {paymentMethod === 'CASH_ON_DELIVERY' && '✓'}
                </div>
              </div>
            </div>

            {/* Mobile phone input for prompt */}
            {paymentMethod !== 'CASH_ON_DELIVERY' && (
              <div className="space-y-1 text-xs">
                <label className="font-bold text-stone-700 block">
                  Numéro de compte {paymentMethod === 'MTN_MOMO' ? 'MTN MoMo' : 'Orange Money'}
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-stone-100 rounded-xl border border-stone-300 text-stone-600 font-bold">
                    +237
                  </span>
                  <input
                    type="tel"
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    placeholder="6XXXXXXXX"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-bold text-stone-900"
                  />
                </div>
              </div>
            )}

            {/* Escrow Guarantee Box */}
            <div className="bg-emerald-950 text-white p-3.5 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sécurité Tontine & Escrow AgriLink</span>
              </div>
              <p className="text-emerald-200/90 text-[11px] leading-relaxed">
                Vos {grandTotal.toLocaleString('fr-FR')} FCFA sont bloqués sur un compte tiers de confiance. Ils ne sont versés à l'agriculteur que lorsque vous confirmez la bonne réception de la marchandise au point relais.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep('DELIVERY_FORM')}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
              >
                Retour
              </button>

              <button
                onClick={handleStartPayment}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition active:scale-95"
              >
                <span>
                  {paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'Valider la commande Cash'
                    : `Payer ${grandTotal.toLocaleString('fr-FR')} FCFA`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: USSD Phone Prompt Simulation */}
        {step === 'USSD_SIMULATION' && (
          <div className="p-4 sm:p-6 space-y-4 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 animate-pulse">
              <Smartphone className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-black text-stone-900">
                Notification USSD sur votre téléphone (+237 {momoPhone})
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Une demande d'autorisation de débit a été transmise via{' '}
                {paymentMethod === 'MTN_MOMO' ? 'MTN MoMo (*126#)' : 'Orange Money (*150#)'}.
              </p>
            </div>

            {/* Simulated Phone Pop-up Screen */}
            <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl border border-stone-700 text-left max-w-xs mx-auto shadow-inner space-y-2 text-xs font-mono">
              <div className="text-[10px] text-stone-400 border-b border-stone-800 pb-1 flex justify-between">
                <span>DEMANDE DE PAIEMENT</span>
                <span className="text-amber-400">AGRI LINK</span>
              </div>
              <p className="text-white text-xs font-bold">
                Autorisez-vous le paiement de {grandTotal.toLocaleString('fr-FR')} FCFA à AGRI LINK ESCROW CAMEROUN ?
              </p>
              <div className="pt-2">
                <label className="text-[10px] text-stone-400 block mb-1">
                  Entrez votre Code PIN secret :
                </label>
                <input
                  type="password"
                  maxLength={5}
                  value={ussdPin}
                  onChange={(e) => setUssdPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-stone-800 text-white font-black tracking-widest text-center py-1.5 rounded-lg border border-stone-600 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setStep('PAYMENT_SELECTION')}
                disabled={isProcessingPayment}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
              >
                Annuler
              </button>

              <button
                onClick={handleConfirmUSSD}
                disabled={isProcessingPayment}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-2 shadow-md transition active:scale-95"
              >
                {isProcessingPayment ? (
                  <span>Validation du réseau CamTel/MTN...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Approuver & Valider</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmation & Official Receipt */}
        {step === 'CONFIRMATION' && completedOrder && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                Commande Validée avec Succès !
              </h3>
              <p className="text-xs text-stone-500">
                Réf: <span className="font-mono font-bold text-emerald-900">{completedOrder.reference}</span>
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-3 font-sans">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <span className="font-extrabold text-stone-800">Reçu de Transaction</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                  {completedOrder.paymentStatus === 'SECURISE_ESCROW'
                    ? 'FONDS SOUS SÉQUESTRE'
                    : 'ENREGISTRÉ CASH'}
                </span>
              </div>

              <div className="space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Destinataire :</span>
                  <span className="font-bold text-stone-900">{completedOrder.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Téléphone :</span>
                  <span className="font-bold text-stone-900">{completedOrder.buyerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lieu de livraison :</span>
                  <span className="font-bold text-stone-900">{completedOrder.deliveryCity} ({completedOrder.deliveryAddress})</span>
                </div>
                <div className="flex justify-between">
                  <span>Moyen de paiement :</span>
                  <span className="font-bold text-stone-900">
                    {completedOrder.paymentMethod === 'MTN_MOMO'
                      ? 'MTN Mobile Money'
                      : completedOrder.paymentMethod === 'ORANGE_MONEY'
                      ? 'Orange Money'
                      : 'Cash à réception'}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-2 border-t border-stone-200 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Articles :</span>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-stone-700">
                    <span>
                      {it.quantity} {it.unit} de {it.productName}
                    </span>
                    <span className="font-semibold">
                      {it.subtotal.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-emerald-950">
                <span>Total réglé</span>
                <span>{completedOrder.totalAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {/* Direct WhatsApp Coordination Button */}
            <div className="space-y-2">
              <a
                href={whatsappCoordinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Informer le Producteur sur WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                Fermer et retourner au marché
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
