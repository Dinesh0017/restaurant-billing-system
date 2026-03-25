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
  categoryName: string;
};

export type BillType = {
  id: number;
  billNumber: string;
  customerName?: string | null;
  total: number;
  createdAt: string;
};