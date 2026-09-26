import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  MessageCircle,
  Phone,
  ShieldCheck,
  Tag,
  Clock,
  CheckCheck,
  Check,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Conversation, ChatMessage } from '../types';
import { formatCameroonWhatsAppNumber } from '../utils/whatsapp';

interface MessagingViewProps {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  onSendMessage: (conversationId: string, content: string, offer?: { amount: number; unit: string }) => void;
  onUpdateOfferStatus: (conversationId: string, messageId: string, status: 'ACCEPTEE' | 'REFUSEE') => void;
  isOnline: boolean;
}

const QUICK_AGRICULTURAL_MESSAGES = [
  'Quel est votre meilleur prix de gros pour 10 sacs ?',
  'Le produit est-il disponible pour chargement immédiat ?',
  'Pouvez-vous acheminer vers la gare routière / marché de gros ?',
  'Pouvez-vous m\'envoyer une photo du lot au champ sur WhatsApp ?',
  'Je valide la commande avec acompte sécurisé sur l\'application.',
];

export const MessagingView: React.FC<MessagingViewProps> = ({
  conversations,
  messages,
  activeConversationId,
  setActiveConversationId,
  onSendMessage,
  onUpdateOfferStatus,
  isOnline,
}) => {
  const [inputText, setInputText] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(4500);
  const [offerUnit, setOfferUnit] = useState<string>('régime (x 20)');

  const currentConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const currentMessages = currentConv ? messages[currentConv.id] || [] : [];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentConv) return;
    onSendMessage(currentConv.id, inputText.trim());
    setInputText('');
  };

  const handleSendOffer = () => {
    if (!currentConv || offerAmount <= 0) return;
    onSendMessage(
      currentConv.id,
      `Proposition d'offre commerciale ferme :`,
      { amount: offerAmount, unit: offerUnit }
    );
    setShowOfferModal(false);
  };

  const waNumber = currentConv ? formatCameroonWhatsAppNumber(currentConv.otherPartyWhatsApp) : '';
  const waDirectUrl = currentConv
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Bonjour ${currentConv.otherPartyName}, je poursuis notre échange entamé sur la messagerie AGRI LINK CAM concernant votre offre agricole.`
      )}`
    : '#';

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[750px] max-h-[82vh]">
      {/* Left Sidebar: Conversations List */}
      <div className="w-full md:w-80 border-r border-stone-200 flex flex-col bg-stone-50/50 shrink-0">
        <div className="p-3.5 border-b border-stone-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-800" />
              <span>Messagerie & Négociations</span>
            </h2>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {conversations.length}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Échangez avec les producteurs et négociez vos tarifs en direct.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {conversations.map((c) => {
            const isSelected = c.id === currentConv?.id;
            return (
              <div
                key={c.id}
                onClick={() => setActiveConversationId(c.id)}
                className={`p-3.5 transition cursor-pointer flex items-start gap-3 ${
                  isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-700' : 'hover:bg-stone-100/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={c.otherPartyAvatar}
                    alt={c.otherPartyName}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-stone-900 truncate">
                      {c.otherPartyName}
                    </span>
                    <span className="text-[10px] text-stone-400 shrink-0">
                      {c.lastMessageTime}
                    </span>
                  </div>

                  <span className="text-[10px] text-emerald-800 font-semibold block truncate">
                    {c.otherPartyRole}
                  </span>

                  {c.relatedProductName && (
                    <span className="inline-block text-[10px] bg-amber-100 text-stone-800 font-medium px-1.5 py-0.2 rounded mt-0.5 truncate max-w-full">
                      📦 {c.relatedProductName}
                    </span>
                  )}

                  <p className="text-xs text-stone-500 truncate mt-1">
                    {c.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      {currentConv ? (
        <div className="flex-1 flex flex-col bg-stone-50/30">
          {/* Header of Active Chat */}
          <div className="p-3 sm:p-4 bg-white border-b border-stone-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentConv.otherPartyAvatar}
                alt={currentConv.otherPartyName}
                className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-stone-900 truncate">
                    {currentConv.otherPartyName}
                  </h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                </div>
                <p className="text-[11px] text-stone-500 truncate">
                  {currentConv.otherPartyRole} • {currentConv.otherPartyPhone}
                </p>
              </div>
            </div>

            {/* Direct External Actions (WhatsApp & Phone) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowOfferModal(true)}
                className="hidden sm:inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-stone-950 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Faire une offre</span>
              </button>

              <a
                href={`tel:${currentConv.otherPartyPhone.replace(/\s+/g, '')}`}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                title="Appeler directement"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* Dedicated WhatsApp Direct Button */}
              <a
                href={waDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs"
                title="Basculer sur WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMessages.map((msg) => {
              const isMe = msg.senderId === 'buyer-me';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-stone-400 font-semibold mb-1 px-1">
                    {msg.senderName} • {msg.timestamp}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-emerald-800 text-white rounded-tr-none'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.content}</p>

                    {/* Commercial Offer Card if message is an offer */}
                    {msg.isOffer && (
                      <div
                        className={`mt-2.5 p-3 rounded-xl border ${
                          isMe
                            ? 'bg-emerald-900/60 border-emerald-700/80 text-white'
                            : 'bg-amber-50 border-amber-200 text-stone-900'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                          <Tag className="w-3.5 h-3.5" /> Offre de prix négociée
                        </div>
                        <div className="text-base font-black">
                          {msg.offerAmount?.toLocaleString('fr-FR')} FCFA
                          <span className="text-xs font-normal"> / {msg.offerUnit}</span>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-black/10">
                          <span className="text-[10px] font-bold">
                            Statut :{' '}
                            {msg.offerStatus === 'ACCEPTEE' ? (
                              <span className="text-emerald-300 font-black">
                                ✓ ACCEPTÉE
                              </span>
                            ) : msg.offerStatus === 'REFUSEE' ? (
                              <span className="text-red-400 font-black">
                                ✗ REFUSÉE
                              </span>
                            ) : (
                              <span className="text-amber-300 font-bold">
                                En attente d'approbation
                              </span>
                            )}
                          </span>

                          {!isMe && msg.offerStatus === 'EN_ATTENTE' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  onUpdateOfferStatus(currentConv.id, msg.id, 'ACCEPTEE')
                                }
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Accepter
                              </button>
                              <button
                                onClick={() =>
                                  onUpdateOfferStatus(currentConv.id, msg.id, 'REFUSEE')
                                }
                                className="px-2 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-bold flex items-center gap-1"
                              >
                                <X className="w-3 h-3" /> Refuser
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator (offline queued or delivered) */}
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1 px-1">
                    {msg.isOfflineQueued ? (
                      <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> En attente de réseau (sauvegardé)
                      </span>
                    ) : (
                      <span className="text-stone-400 flex items-center gap-0.5">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-700" /> Transmis
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Chips */}
          <div className="px-3 pt-2 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
              Réponses types :
            </span>
            {QUICK_AGRICULTURAL_MESSAGES.map((text, i) => (
              <button
                key={i}
                onClick={() => setInputText(text)}
                className="text-[11px] text-stone-700 bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 px-2.5 py-1 rounded-full whitespace-nowrap transition"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input Box Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setShowOfferModal(true)}
              className="sm:hidden p-2 rounded-xl bg-amber-100 text-amber-900"
              title="Faire une offre"
            >
              <Tag className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={
                isOnline
                  ? 'Écrivez votre message à l\'agriculteur...'
                  : 'Message hors-ligne (sera transmis dès retour du réseau)...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-bold transition shadow-xs flex items-center justify-center shrink-0"
              aria-label="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400">
          <MessageSquare className="w-12 h-12 mb-3" />
          <p className="text-sm font-semibold">Sélectionnez une discussion pour débuter</p>
        </div>
      )}

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <h3 className="font-black text-sm text-stone-900 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>Soumettre une offre commerciale</span>
              </h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Proposez un prix ferme pour l'achat de volume. Le producteur pourra accepter ou refuser directement.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Prix unitaire proposé (FCFA)
                </label>
                <input
                  type="number"
                  step="100"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-900 text-base"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Unité & Volume négocié
                </label>
                <input
                  type="text"
                  placeholder="Ex: sac 50kg (x 10), régime (x 25)..."
                  value={offerUnit}
                  onChange={(e) => setOfferUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSendOffer}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-black shadow-md"
              >
                Envoyer l'Offre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
