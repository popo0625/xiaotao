export interface ProductWithImages {
  id: string;
  title: string;
  price: number;
  grade: string;
  images: { url: string; type: string }[];
  categoryId: number;
  brand: string | null;
  series: string | null;
  modelNo: string | null;
  characterName: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    creditScore: number;
  };
}

export interface ConversationWithPartner {
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  productId?: string;
  productTitle?: string;
}
