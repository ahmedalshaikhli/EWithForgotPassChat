import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.scss']
})
export class AllOrdersComponent implements OnInit {
  orders: any[];
  errorMessage: string;
  constructor(private adminService: AdminService) {

  }
  
  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.adminService.getOrders()
      .subscribe(
        orders => {
          this.orders = orders;
        },
        error => {
          this.errorMessage = error.message;
          console.error(error);
        }
      );
  }
}