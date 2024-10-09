import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from 'app/interfaces/shop.interface';
import { CartService } from 'app/services/cart.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, CommonModule],
})
export class CartComponent {
  cartItems: CartItem[] = this.cartService.cart().items;
  totalAmount = this.cartService.cart().totalAmount;

  constructor(private router: Router, private cartService: CartService) {}

  removeItem(productId: string) {
    this.cartService.removeItem(productId);
    this.udpateCart();
  }

  udpateCart() {
    this.cartItems = this.cartService.cart().items;
    this.totalAmount = this.cartService.cart().totalAmount;
  }

  increaseQuantity(item: CartItem) {
    // Increase the quantity of the specified item in the cart and update cart data
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
    this.udpateCart();
  }

  decreaseQuantity(item: CartItem) {
    // Decrease the quantity of the specified item in the cart and update cart data
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.productId, item.quantity - 1);
      this.udpateCart();
    }
  }

  getProductImage(productId: string): string {
    return `https://picsum.photos/seed/${productId}/200/200`;
  }

  navigateToProducts() {
    this.router.navigate(['/products/list']);
  }

  calculateTotal(item: CartItem): number {
    return item.price * item.quantity;
  }
}
