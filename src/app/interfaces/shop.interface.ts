export interface CartItem {
    image: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}
  
export interface ShoppingCart {
    items: CartItem[];
    totalAmount: number;
}