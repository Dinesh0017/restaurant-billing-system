export type CategoryType = {
  id: number;
  name: string;
  createdAt?: string;
};

export type ItemType = {
  id: number;
  name: string;
  price: number;
  stockQty: number;
  imageUrl?: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
};

export type CartItemType = {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  stockQty: number;
  imageUrl?: string | null;
  category: {
    id: number;
    name: string;
  };
};

export type BillType = {
  id: number;
  billNumber: string;
  customerName: string ;
  customerEmail: string;
  customerPhone: string;
  total: number;
  createdAt: string;
};