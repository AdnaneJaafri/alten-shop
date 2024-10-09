import {
  Component,
  effect,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from "./services/cart.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent],
})
export class AppComponent {
  title = "ALTEN SHOP";

  itemsCount = 0;
  constructor(private router: Router, private cartService: CartService) {
    effect(() => {
      const cart = this.cartService.cart();
      this.itemsCount = cart.items.length;
    });
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }
}
