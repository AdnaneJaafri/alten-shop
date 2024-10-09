import { Injectable, signal } from '@angular/core';
import {
  CartItem,
  ShoppingCart,
} from '../interfaces/shop.interface';
import { Product } from 'app/products/data-access/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = signal<ShoppingCart>({
    items: [],
    totalAmount: this.calculateTotalAmount([]),
  });

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart.update(() => JSON.parse(savedCart));
    }
  }

  updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  private calculateTotalAmount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  addItem(product: Product) {
    const item: CartItem = {
      image: product.image,
      productId: product.id.toString(),
      productName: product.name,
      price: product.price,
      quantity: 1,
    };

    this.cart.update((currentCart) => {
      const itemsCopy = [...currentCart.items]; // Create a shallow copy
      const existingItemIndex = itemsCopy.findIndex(
        (i) => i.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        // Create a new item object with updated quantity
        const updatedItem = {
          ...itemsCopy[existingItemIndex],
          quantity: itemsCopy[existingItemIndex].quantity + 1,
        };
        // Replace the item in the array
        itemsCopy[existingItemIndex] = updatedItem;
      } else {
        itemsCopy.push(item);
      }

      const newTotalAmount = this.calculateTotalAmount(itemsCopy);

      // Return a new object for the cart with updated properties
      return {
        ...currentCart,
        items: itemsCopy,
        totalAmount: newTotalAmount,
      };
    });
    this.updateLocalStorage();
  }

  removeItem(productId: string) {
    this.cart.update((currentCart) => {
      // Create a shallow copy of the items array to avoid direct mutation
      const itemsCopy = [...currentCart.items];

      // Find the index of the item to remove
      const itemIndex = itemsCopy.findIndex((i) => i.productId === productId);

      // Proceed only if the item exists
      if (itemIndex !== -1) {
        // Remove the item by filtering it out of the itemsCopy array
        const updatedItems = itemsCopy.filter((i) => i.productId !== productId);

        // Calculate the new total amount after removing the item
        const newTotalAmount = this.calculateTotalAmount(updatedItems);

        // Return a new cart object with the updated items and total amount
        return {
          ...currentCart,
          items: updatedItems,
          totalAmount: newTotalAmount,
        };
      }

      // If the item wasn't found, return the current cart unchanged
      return currentCart;
    });
    this.updateLocalStorage();
  }

  updateQuantity(productId: string, newQuantity: number) {
    this.cart.update((currentCart) => {
      const item = currentCart.items.find((i) => i.productId === productId);

      if (item) {
        const priceDiff = item.price * (newQuantity - item.quantity);
        item.quantity = newQuantity;
        currentCart.totalAmount += priceDiff;
      }
      return currentCart;
    });
    this.updateLocalStorage();
  }
}
