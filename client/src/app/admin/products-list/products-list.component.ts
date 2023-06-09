import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { ShopService } from 'src/app/shop/shop.service';
import { AdminService } from '../admin.service';

/* import {ShopService} from '../shop/shop.service';
import {AdminService} from './admin.service';
import {IProduct} from '../shared/models/product';
import {ShopParams} from '../shared/models/shopParams'; */

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products !: IProduct[];
  totalCount !: number;
  shopParams: ShopParams;

  constructor(private shopService: ShopService, private adminService: AdminService) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).subscribe(response => {
      this.products = response.data;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    });
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }
  }

  deleteProduct(id: number) {
    this.adminService.deleteProduct(id).subscribe((response: any) => {
      this.products.splice(this.products.findIndex(p => p.id === id), 1);
      this.totalCount--;
    });
  }
}