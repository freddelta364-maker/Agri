import {
  Product,
  CartItem,
  Order,
  MarketPrice,
  FarmerStockRecord,
  Conversation,
  ChatMessage,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_MARKET_PRICES,
  INITIAL_FARMER_STOCKS,
  INITIAL_CONVERSATIONS,
  INITIAL_CHAT_MESSAGES,
} from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'agri_link_cam_products_v1',
  CART: 'agri_link_cam_cart_v1',
  ORDERS: 'agri_link_cam_orders_v1',
  MARKET_PRICES: 'agri_link_cam_market_prices_v1',
  FARMER_STOCKS: 'agri_link_cam_farmer_stocks_v1',
  CONVERSATIONS: 'agri_link_cam_conversations_v1',
  CHAT_MESSAGES: 'agri_link_cam_chat_messages_v1',
  LOW_DATA_MODE: 'agri_link_cam_low_data_v1',
  OFFLINE_QUEUE: 'agri_link_cam_offline_queue_v1',
};

// Safe JSON reading
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing to localStorage for ${key}`, e);
  }
}

export const StorageService = {
  // Products
  getProducts(): Product[] {
    const stored = safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return stored;
  },

  saveProduct(newProduct: Product): void {
    const products = this.getProducts();
    const updated = [newProduct, ...products.filter(p => p.id !== newProduct.id)];
    safeSet(STORAGE_KEYS.PRODUCTS, updated);
  },

  // Cart
  getCart(): CartItem[] {
    return safeGet<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  saveCart(cart: CartItem[]): void {
    safeSet(STORAGE_KEYS.CART, cart);
  },

  clearCart(): void {
    safeSet(STORAGE_KEYS.CART, []);
  },

  // Orders
  getOrders(): Order[] {
    return safeGet<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    safeSet(STORAGE_KEYS.ORDERS, [order, ...orders]);
  },

  // Market Prices
  getMarketPrices(): MarketPrice[] {
    const stored = safeGet<MarketPrice[]>(STORAGE_KEYS.MARKET_PRICES, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.MARKET_PRICES, INITIAL_MARKET_PRICES);
      return INITIAL_MARKET_PRICES;
    }
    return stored;
  },

  // Farmer Stocks (Gestion des stocks)
  getFarmerStocks(): FarmerStockRecord[] {
    const stored = safeGet<FarmerStockRecord[]>(STORAGE_KEYS.FARMER_STOCKS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.FARMER_STOCKS, INITIAL_FARMER_STOCKS);
      return INITIAL_FARMER_STOCKS;
    }
    return stored;
  },

  saveFarmerStock(stock: FarmerStockRecord): void {
    const stocks = this.getFarmerStocks();
    const existingIndex = stocks.findIndex(s => s.id === stock.id);
    let updated: FarmerStockRecord[];
    if (existingIndex >= 0) {
      updated = [...stocks];
      updated[existingIndex] = stock;
    } else {
      updated = [stock, ...stocks];
    }
    safeSet(STORAGE_KEYS.FARMER_STOCKS, updated);
  },

  deleteFarmerStock(id: string): void {
    const stocks = this.getFarmerStocks().filter(s => s.id !== id);
    safeSet(STORAGE_KEYS.FARMER_STOCKS, stocks);
  },

  // Conversations & Chat
  getConversations(): Conversation[] {
    const stored = safeGet<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
      return INITIAL_CONVERSATIONS;
    }
    return stored;
  },

  getChatMessages(conversationId: string): ChatMessage[] {
    const allMessages = safeGet<Record<string, ChatMessage[]>>(
      STORAGE_KEYS.CHAT_MESSAGES,
      INITIAL_CHAT_MESSAGES
    );
    return allMessages[conversationId] || [];
  },

  saveChatMessage(message: ChatMessage): void {
    const allMessages = safeGet<Record<string, ChatMessage[]>>(
      STORAGE_KEYS.CHAT_MESSAGES,
      INITIAL_CHAT_MESSAGES
    );
    const convMsgs = allMessages[message.conversationId] || [];
    allMessages[message.conversationId] = [...convMsgs, message];
    safeSet(STORAGE_KEYS.CHAT_MESSAGES, allMessages);

    // Update conversation lastMessage
    const convs = this.getConversations();
    const convIndex = convs.findIndex(c => c.id === message.conversationId);
    if (convIndex >= 0) {
      convs[convIndex].lastMessage = message.content;
      convs[convIndex].lastMessageTime = message.timestamp;
      safeSet(STORAGE_KEYS.CONVERSATIONS, [...convs]);
    }
  },

  // Low data mode preference
  getLowDataMode(): boolean {
    return safeGet<boolean>(STORAGE_KEYS.LOW_DATA_MODE, false);
  },

  setLowDataMode(val: boolean): void {
    safeSet(STORAGE_KEYS.LOW_DATA_MODE, val);
  },

  // Offline queue for syncing
  getOfflineQueue(): Array<{ type: string; payload: unknown; timestamp: number }> {
    return safeGet<Array<{ type: string; payload: unknown; timestamp: number }>>(
      STORAGE_KEYS.OFFLINE_QUEUE,
      []
    );
  },

  addToOfflineQueue(action: { type: string; payload: unknown }): void {
    const queue = this.getOfflineQueue();
    queue.push({ ...action, timestamp: Date.now() });
    safeSet(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  },

  clearOfflineQueue(): void {
    safeSet(STORAGE_KEYS.OFFLINE_QUEUE, []);
  }
};
