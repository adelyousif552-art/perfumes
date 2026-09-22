export type CartLineId = string;

export type AddToCartInput = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  selectedOptions: Record<string, string>;
  quantity?: number;
};

export type CartLine = Omit<AddToCartInput, "quantity"> & {
  id: CartLineId;
  quantity: number;
};
