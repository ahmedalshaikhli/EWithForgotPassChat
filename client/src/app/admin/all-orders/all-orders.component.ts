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
  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;
  searchTerm = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getOrders();

    console.log(this.getOrders());
  }

  searchOrders(): void {
    this.pageIndex = 0; // Reset the page index when performing a new search
    this.getOrders();
  }

  onPageChanged(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getOrders();
  }

  resetSearch(): void {
    this.searchTerm = ''; // Clear the search term
    this.pageIndex = 0; // Reset the page index
    this.getOrders();
  }

  getOrders(): void {
    this.adminService
      .getAllOrders(this.pageIndex, this.pageSize, this.searchTerm)
      .subscribe(
        (response: any) => {
          this.orders = response.orders;
          this.totalCount = response.totalCount;
        },
        (error: any) => {
          this.errorMessage = error.message;
          console.error(error);
        }
      );
  }
}