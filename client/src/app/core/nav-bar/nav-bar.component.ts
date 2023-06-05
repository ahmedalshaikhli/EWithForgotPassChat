import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { Basket, BasketItem } from 'src/app/shared/models/basket';
import { Brand } from 'src/app/shared/models/brand';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { User } from 'src/app/shared/models/user';
import { ShopService } from 'src/app/shop/shop.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  brands: Brand[] = [];
  shopParams: ShopParams;
  basket$: Observable<Basket>;
  currentUser$: Observable<User>;
  isAdmin$: Observable<boolean>;

  constructor(
    public basketService: BasketService,
    public accountService: AccountService,
    private shopService: ShopService
  ) {
    this.shopParams = shopService.getShopParams();
  }

  ngOnInit() {
    this.getBrands();
    this.basket$ = this.basketService.basketSource$;
    this.currentUser$ = this.accountService.currentUser$;
    this.isAdmin$ = this.accountService.isAdmin$;
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: response => this.brands = [{id: 0, name: 'All'}, ...response],
      error: error => console.log(error)
    })
  }

  getCount(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  onBrandSelected(brandId: number) {
    this.shopService.setBrandId(brandId);
  }
}