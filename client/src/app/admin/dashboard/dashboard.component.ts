import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ShopService } from 'src/app/shop/shop.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  totalCount: number = 0;
  totalUsersCount = 0;
  constructor(private adminService: AdminService,private shopService: ShopService) {}

  ngOnInit(): void {
    this.adminService.getTotalUsersCount('').subscribe((count) => {
      this.totalUsersCount = count;
      this.getProducts();
    });
  }
  getProducts(useCache: boolean = false) {
    this.shopService.getProducts(useCache).subscribe(response => {
      this.products = response.data;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    });
  }
}