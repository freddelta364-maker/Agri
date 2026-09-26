import React from 'react';
import {
  Wifi,
  WifiOff,
  Gauge,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Package,
  Layers,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'MARKETPLACE' | 'MARKET_PRICES' | 'FARMER_STOCKS' | 'MESSAGING' | 'ORDERS';
  setActiveTab: (tab: 'MARKETPLACE' | 'MARKET_PRICES' | 'FARMER_STOCKS' | 'MESSAGING' | 'ORDERS') => void;
  cartCount: number;
  openCart: () => void;
  isOnline: boolean;
  lowDataMode: boolean;
  toggleLowDataMode: () => void;
  pendingSyncCount: number;
  triggerSync: () => void;
  userRole: 'ACHETEUR' | 'AGRICULTEUR';
  setUserRole: (role: 'ACHETEUR' | 'AGRICULTEUR') => void;
  unreadMessagesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  isOnline,
  lowDataMode,
  toggleLowDataMode,
  pendingSyncCount,
  triggerSync,
  userRole,
  setUserRole,
  unreadMessagesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-lg border-b border-emerald-800">
      {/* Offline Alert Strip if offline or syncing */}
      {!isOnline && (
        <div className="bg-amber-500 text-stone-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-950 animate-ping shrink-0" />
            <span>Mode Hors-Ligne Actif — Les données locales sont disponibles. Les nouvelles commandes ou récoltes seront synchronisées dès retour du réseau.</span>
          </div>
          {pendingSyncCount > 0 && (
            <span className="bg-amber-600/40 text-stone-950 px-2 py-0.5 rounded-full text-[11px] font-bold">
              {pendingSyncCount} en attente
            </span>
          )}
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setActiveTab('MARKETPLACE')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-950 border border-emerald-400/40 p-1 flex items-center justify-center shadow-md shadow-emerald-950/40">
              <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                {/* Sprout & Seed */}
                <path d="M16 26V14" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M16 18C11 18 8 13 10 9C14 9 16 13 16 17" fill="#4ade80" />
                <path d="M16 15C21 14 24 10 21 6C18 7 16 11 16 14" fill="#facc15" />
                {/* Cameroon Red Star */}
                <polygon points="16,3 17,6 20,6 18,8 19,11 16,9 13,11 14,8 12,6 15,6" fill="#ef4444" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-base sm:text-lg text-white">
                  AGRI LINK <span className="text-amber-400">CAM</span>
                </span>
                {/* Cameroon Tri-color subtle dot pill */}
                <div className="hidden sm:flex items-center rounded-sm overflow-hidden h-3 w-5 border border-white/20">
                  <div className="bg-emerald-600 h-full w-1/3" />
                  <div className="bg-red-600 h-full w-1/3 flex items-center justify-center">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                  </div>
                  <div className="bg-yellow-400 h-full w-1/3" />
                </div>
              </div>
              <p className="text-[10px] text-emerald-200/80 hidden sm:block font-medium">
                Marché Vivrier & Filières Agricoles du Cameroun
              </p>
            </div>
          </div>

          {/* Quick Controls: Connectivity, Low-Data, Role Switcher, PWA */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Low-data / Slow Connection Saver */}
            <button
              onClick={toggleLowDataMode}
              title={lowDataMode ? 'Mode Bas Débit Actif (Images optimisées)' : 'Activer Mode Bas Débit (2G/3G Edge)'}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition ${
                lowDataMode
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950 border border-emerald-700/60'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {lowDataMode ? 'Bas Débit ON' : 'Éco Données'}
              </span>
            </button>

            {/* Network status indicator */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                isOnline
                  ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-700'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline text-[11px]">En ligne</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-300">Hors-ligne</span>
                </>
              )}
            </div>

            {/* Offline sync button if pending */}
            {isOnline && pendingSyncCount > 0 && (
              <button
                onClick={triggerSync}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-stone-950 px-2 py-1 rounded-lg text-xs font-bold transition animate-pulse"
                title="Synchroniser les actions hors-ligne"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync ({pendingSyncCount})</span>
              </button>
            )}

            {/* Role Switcher (Buyer/Wholesaler vs Farmer/Coop) */}
            <div className="hidden sm:flex bg-emerald-950/80 p-0.5 rounded-xl border border-emerald-700/60 text-xs font-semibold">
              <button
                onClick={() => setUserRole('ACHETEUR')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  userRole === 'ACHETEUR'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-300/80 hover:text-white'
                }`}
              >
                Acheteur
              </button>
              <button
                onClick={() => setUserRole('AGRICULTEUR')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  userRole === 'AGRICULTEUR'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-emerald-300/80 hover:text-white'
                }`}
              >
                Agriculteur
              </button>
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md transition active:scale-95 flex items-center justify-center"
              aria-label="Voir le panier"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-900 shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-2 pt-2 border-t border-emerald-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('MARKETPLACE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'MARKETPLACE'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Marché & Produits</span>
          </button>

          <button
            onClick={() => setActiveTab('MARKET_PRICES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'MARKET_PRICES'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Cours des Vivres (Régions)</span>
          </button>

          <button
            onClick={() => setActiveTab('FARMER_STOCKS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'FARMER_STOCKS'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Gestion des Stocks</span>
          </button>

          <button
            onClick={() => setActiveTab('MESSAGING')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'MESSAGING'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Messagerie</span>
            {unreadMessagesCount > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.2 text-[10px] font-black">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'ORDERS'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Commandes & Reçus</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
