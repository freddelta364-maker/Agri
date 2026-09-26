import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MarketplaceView } from './components/MarketplaceView';
import { MarketPricesView } from './components/MarketPricesView';
import { FarmerStockView } from './components/FarmerStockView';
import { MessagingView } from './components/MessagingView';
import { OrdersView } from './components/OrdersView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { NewProductModal } from './components/NewProductModal';

import {
  Product,
  CartItem,
  Order,
  MarketPrice,
  FarmerStockRecord,
  Conversation,
  ChatMessage,
} from './types';
import { StorageService } from './services/storage';
import { useNetwork } from './hooks/useNetwork';
import { MessageCircle, Phone, Sparkles, Wheat } from 'lucide-react';
import { formatCameroonWhatsAppNumber } from './utils/whatsapp';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<
    'MARKETPLACE' | 'MARKET_PRICES' | 'FARMER_STOCKS' | 'MESSAGING' | 'ORDERS'
  >('MARKETPLACE');

  // User Role
  const [userRole, setUserRole] = useState<'ACHETEUR' | 'AGRICULTEUR'>('ACHETEUR');

  // Data states from persistent LocalStorage
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [cart, setCart] = useState<CartItem[]>(() => StorageService.getCart());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [marketPrices] = useState<MarketPrice[]>(() => StorageService.getMarketPrices());
  const [farmerStocks, setFarmerStocks] = useState<FarmerStockRecord[]>(() =>
    StorageService.getFarmerStocks()
  );
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    StorageService.getConversations()
  );
  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    const list = StorageService.getConversations();
    return list[0]?.id || 'conv-1';
  });

  // Cached messages in memory
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(() => {
    const map: Record<string, ChatMessage[]> = {};
    const convs = StorageService.getConversations();
    convs.forEach((c) => {
      map[c.id] = StorageService.getChatMessages(c.id);
    });
    return map;
  });

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  // Network & Low Data Hook
  const {
    isOnline,
    lowDataMode,
    toggleLowDataMode,
    pendingSyncCount,
    setPendingSyncCount,
    triggerSync,
  } = useNetwork();

  // Save Cart on change
  useEffect(() => {
    StorageService.saveCart(cart);
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderComplete = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    StorageService.saveOrder(order);
    setCart([]);
    StorageService.clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  // Farmer stocks operations (with offline support)
  const handleAddFarmerStock = (newStock: FarmerStockRecord) => {
    setFarmerStocks((prev) => [newStock, ...prev]);
    StorageService.saveFarmerStock(newStock);

    if (!isOnline) {
      StorageService.addToOfflineQueue({
        type: 'ADD_STOCK',
        payload: newStock,
      });
      setPendingSyncCount((c) => c + 1);
    }
  };

  const handleUpdateFarmerStock = (updatedStock: FarmerStockRecord) => {
    setFarmerStocks((prev) =>
      prev.map((s) => (s.id === updatedStock.id ? updatedStock : s))
    );
    StorageService.saveFarmerStock(updatedStock);

    if (!isOnline) {
      StorageService.addToOfflineQueue({
        type: 'UPDATE_STOCK',
        payload: updatedStock,
      });
      setPendingSyncCount((c) => c + 1);
    }
  };

  const handleDeleteFarmerStock = (stockId: string) => {
    setFarmerStocks((prev) => prev.filter((s) => s.id !== stockId));
    StorageService.deleteFarmerStock(stockId);
  };

  // Adding product to marketplace
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    StorageService.saveProduct(newProd);

    if (!isOnline) {
      StorageService.addToOfflineQueue({
        type: 'ADD_PRODUCT',
        payload: newProd,
      });
      setPendingSyncCount((c) => c + 1);
    }
  };

  // Messaging operations
  const handleSendMessage = (
    conversationId: string,
    content: string,
    offer?: { amount: number; unit: string }
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'buyer-me',
      senderName: userRole === 'AGRICULTEUR' ? 'Moi (Agriculteur)' : 'Moi (Acheteur)',
      senderRole: userRole === 'AGRICULTEUR' ? 'AGRICULTEUR' : 'GROSSISTE',
      content,
      timestamp: timeStr,
      isOffer: !!offer,
      offerAmount: offer?.amount,
      offerUnit: offer?.unit,
      offerStatus: offer ? 'EN_ATTENTE' : undefined,
      isOfflineQueued: !isOnline,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    StorageService.saveChatMessage(newMsg);

    if (!isOnline) {
      StorageService.addToOfflineQueue({
        type: 'SEND_MESSAGE',
        payload: newMsg,
      });
      setPendingSyncCount((c) => c + 1);
    }
  };

  const handleUpdateOfferStatus = (
    conversationId: string,
    messageId: string,
    status: 'ACCEPTEE' | 'REFUSEE'
  ) => {
    setMessagesMap((prev) => {
      const convMsgs = prev[conversationId] || [];
      const updated = convMsgs.map((m) =>
        m.id === messageId ? { ...m, offerStatus: status } : m
      );
      return { ...prev, [conversationId]: updated };
    });
  };

  // Switch to chat from product card
  const handleOpenDirectChatFromProduct = (product: Product) => {
    // Find or create conversation for this farmer
    const existingConv = conversations.find(
      (c) => c.otherPartyId === product.farmerId || c.otherPartyName === product.farmerName
    );

    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setActiveTab('MESSAGING');
    } else {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        otherPartyId: product.farmerId,
        otherPartyName: product.farmerName,
        otherPartyRole: `Agriculteur (${product.region})`,
        otherPartyPhone: product.farmerPhone,
        otherPartyWhatsApp: product.farmerWhatsApp,
        otherPartyAvatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
        relatedProductName: product.name,
        lastMessage: `Demande d'information pour ${product.name}`,
        lastMessageTime: 'À l\'instant',
        unreadCount: 0,
      };

      const updatedConvs = [newConv, ...conversations];
      setConversations(updatedConvs);
      setActiveConversationId(newConv.id);
      setActiveTab('MESSAGING');
    }
  };

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Floating direct WhatsApp support link
  const floatingWaUrl = `https://wa.me/237677421988?text=${encodeURIComponent(
    'Bonjour AGRI LINK CAM, j\'ai besoin d\'assistance pour acheter ou vendre des produits vivriers au Cameroun.'
  )}`;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans selection:bg-emerald-700 selection:text-white pb-14 sm:pb-0">
      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        isOnline={isOnline}
        lowDataMode={lowDataMode}
        toggleLowDataMode={toggleLowDataMode}
        pendingSyncCount={pendingSyncCount}
        triggerSync={triggerSync}
        userRole={userRole}
        setUserRole={setUserRole}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Main Application Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {activeTab === 'MARKETPLACE' && (
          <MarketplaceView
            products={products}
            lowDataMode={lowDataMode}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenDirectChat={handleOpenDirectChatFromProduct}
            onOpenNewProductModal={() => setIsNewProductOpen(true)}
            userRole={userRole}
          />
        )}

        {activeTab === 'MARKET_PRICES' && (
          <MarketPricesView marketPrices={marketPrices} />
        )}

        {activeTab === 'FARMER_STOCKS' && (
          <FarmerStockView
            stocks={farmerStocks}
            onAddStock={handleAddFarmerStock}
            onUpdateStock={handleUpdateFarmerStock}
            onDeleteStock={handleDeleteFarmerStock}
            isOnline={isOnline}
          />
        )}

        {activeTab === 'MESSAGING' && (
          <MessagingView
            conversations={conversations}
            messages={messagesMap}
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
            onSendMessage={handleSendMessage}
            onUpdateOfferStatus={handleUpdateOfferStatus}
            isOnline={isOnline}
          />
        )}

        {activeTab === 'ORDERS' && (
          <OrdersView
            orders={orders}
            onOpenMarketplace={() => setActiveTab('MARKETPLACE')}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, qty) => handleAddToCart(p, qty)}
          onOpenDirectChat={handleOpenDirectChatFromProduct}
          lowDataMode={lowDataMode}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        lowDataMode={lowDataMode}
      />

      {/* Mobile Payment & Checkout Modal */}
      <PaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderComplete={handleOrderComplete}
      />

      {/* New Product Publishing Modal */}
      <NewProductModal
        isOpen={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Floating One-Touch WhatsApp Direct Contact Button (User request requirement) */}
      <a
        href={floatingWaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white transition active:scale-95 group"
        title="Contacter directement sur WhatsApp"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="hidden sm:inline font-bold text-xs pr-1">WhatsApp Direct</span>
      </a>

      {/* Footer */}
      <footer className="mt-12 bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
              AC
            </div>
            <span className="font-extrabold text-white">AGRI LINK CAM</span>
            <span className="text-stone-500">• Terroirs & Vivres du Cameroun</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Paiements : MTN Mobile Money (*126#) • Orange Money (*150#)</span>
            <span>•</span>
            <span>Version Hors-ligne PWA Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
