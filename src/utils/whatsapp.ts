import { Product, Order } from '../types';

/**
 * Normalizes Cameroonian phone numbers for WhatsApp.
 * e.g. "677421988" -> "237677421988"
 * "+237 677 42 19 88" -> "237677421988"
 */
export function formatCameroonWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('237')) {
    return cleaned;
  }
  if (cleaned.length === 9) {
    return `237${cleaned}`;
  }
  return cleaned;
}

/**
 * Creates a direct WhatsApp link with pre-filled message for an agricultural product
 */
export function createProductWhatsAppLink(product: Product, customMessage?: string): string {
  const number = formatCameroonWhatsAppNumber(product.farmerWhatsApp || product.farmerPhone);
  
  const text = customMessage || 
    `Bonjour ${product.farmerName}, je vous contacte depuis la plateforme AGRI LINK CAM au sujet de votre produit : *${product.name}* (${product.pricePerUnit.toLocaleString('fr-FR')} FCFA / ${product.unit}) situé à ${product.locationName}.\n\nEst-il toujours disponible en stock ? Je souhaiterais discuter de la commande et de la livraison.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Creates a WhatsApp link for order tracking / delivery coordination
 */
export function createOrderWhatsAppLink(order: Order, recipientPhone: string): string {
  const number = formatCameroonWhatsAppNumber(recipientPhone);
  const itemsSummary = order.items
    .map(i => `- ${i.quantity} ${i.unit} de ${i.productName}`)
    .join('\n');

  const text = `Bonjour, voici le point sur la commande AGRI LINK CAM (Réf: *${order.reference}*) :\n${itemsSummary}\n\nMontant total : *${order.totalAmount.toLocaleString('fr-FR')} FCFA*\nPaiement : ${order.paymentMethod === 'MTN_MOMO' ? 'MTN MoMo' : order.paymentMethod === 'ORANGE_MONEY' ? 'Orange Money' : 'Cash à la livraison'}\nLieu de livraison : ${order.deliveryCity} (${order.deliveryRegion})\n\nMerci de confirmer la prise en charge.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Creates a general farmer inquiry WhatsApp link
 */
export function createFarmerDirectWhatsAppLink(name: string, phone: string): string {
  const number = formatCameroonWhatsAppNumber(phone);
  const text = `Bonjour ${name}, je vous contacte depuis la plateforme AGRI LINK CAM pour une mise en relation agricole.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
