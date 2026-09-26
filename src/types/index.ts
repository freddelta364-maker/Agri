export type RegionCameroon =
  | 'Centre (Yaoundé)'
  | 'Littoral (Douala)'
  | 'Ouest (Bafoussam/Foumbot)'
  | 'Sud-Ouest (Buea/Kumba)'
  | 'Nord-Ouest (Bamenda)'
  | 'Grand-Nord (Maroua/Garoua)'
  | 'Est (Bertoua/Batouri)'
  | 'Sud (Ebolowa/Kribi)';

export type ProductCategory =
  | 'Tubercules & Féculents'
  | 'Légumes & Maraîchers'
  | 'Fruits & Régimes'
  | 'Épices & Aromates'
  | 'Céréales & Grains'
  | 'Cultures de Rente'
  | 'Huiles & Dérivés';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  region: RegionCameroon;
  locationName: string; // e.g. "Marché de Foumbot", "Penja - Secteur 3"
  pricePerUnit: number; // in FCFA
  unit: 'kg' | 'sac 50kg' | 'sac 100kg' | 'régime' | 'cageot' | 'filet' | 'bidon 20L' | 'bâton';
  stockQuantity: number;
  minOrderQuantity: number;
  harvestDate: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerWhatsApp: string; // Format: 2376XXXXXXXX
  isOrganic: boolean;
  qualityGrade: 'Grade 1 (Export/Supérieur)' | 'Grade 2 (Standard)' | 'Tout Venant';
  photoUrl: string;
  description: string;
  freshnessDaysRemaining: number;
  isUrgentSale?: boolean;
}

export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  cooperative?: string;
  region: RegionCameroon;
  locality: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  rating: number;
  totalSalesCount: number;
  avatar: string;
  bio: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'MTN_MOMO' | 'ORANGE_MONEY' | 'CASH_ON_DELIVERY';

export interface Order {
  id: string;
  reference: string;
  date: string;
  buyerName: string;
  buyerPhone: string;
  buyerWhatsApp: string;
  deliveryRegion: RegionCameroon;
  deliveryCity: string;
  deliveryAddress: string;
  items: {
    productName: string;
    unit: string;
    quantity: number;
    pricePerUnit: number;
    subtotal: number;
    farmerName: string;
    farmerWhatsApp: string;
  }[];
  totalProductsAmount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentPhone?: string;
  paymentStatus: 'EN_ATTENTE' | 'SECURISE_ESCROW' | 'PAYE' | 'ANNULE';
  escrowGuaranteed: boolean;
  orderStatus: 'CONFIRMEE' | 'EN_PREPARATION' | 'EN_TRANSIT' | 'LIVREE';
  notes?: string;
}

export interface MarketPrice {
  id: string;
  commodity: string;
  category: ProductCategory;
  unit: string;
  currentAvgPrice: number; // FCFA
  previousPrice: number;
  trend: 'HAUSSE' | 'BAISSE' | 'STABLE';
  changePercent: number;
  topMarket: string;
  regionalPrices: Record<string, number>;
  updatedAt: string;
  marketNotice: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'ACHETEUR' | 'AGRICULTEUR' | 'GROSSISTE';
  content: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerUnit?: string;
  offerStatus?: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';
  isOfflineQueued?: boolean;
}

export interface Conversation {
  id: string;
  otherPartyId: string;
  otherPartyName: string;
  otherPartyRole: string;
  otherPartyPhone: string;
  otherPartyWhatsApp: string;
  otherPartyAvatar: string;
  relatedProductName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface FarmerStockRecord {
  id: string;
  cropName: string;
  category: ProductCategory;
  parcelName: string;
  harvestDate: string;
  totalHarvested: number;
  reservedQuantity: number;
  availableQuantity: number;
  unit: 'kg' | 'sac 50kg' | 'sac 100kg' | 'régime' | 'cageot' | 'filet' | 'bidon 20L';
  unitPriceFCFA: number;
  storageLocation: string;
  expiryDate: string;
  condition: 'EXCELLENT' | 'BON' | 'VENTE_URGENTE';
  notes?: string;
  isSynced: boolean;
}
