export interface GiftCard {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  expiryDate: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  giftCards: GiftCard[];
} 