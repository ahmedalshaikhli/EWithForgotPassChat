import { Component, Input } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
  @Input() product?: IProduct;
  apiUrl = "https://localhost:4200";
  constructor(private basketService: BasketService) {}

  addItemToBasket() {
    this.product && this.basketService.addItemToBasket(this.product);
  }

  openShareDialog(product: IProduct): void {
    const shareUrl = `${this.apiUrl}/shop/${product.id}`;

    // Create a share dialog using the Web Share API
    const shareData = {
      title: product.name,
      text: 'Check out this product',
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Link shared successfully.'))
        .catch((error) => console.log('Error sharing link:', error));
    } else {
      // Fallback: Use a custom share dialog or provide instructions to the user
      console.log('Web Share API is not supported.');
    }
  }
}