import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-all-order-details',
  templateUrl: './all-order-details.component.html',
  styleUrls: ['./all-order-details.component.scss']
})
export class AllOrderDetailsComponent implements OnInit {
  buyerEmail: string;
  order: any;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
   
   
  ) {}

  ngOnInit(): void {
    this.buyerEmail= this.route.snapshot.paramMap.get('email');
    this.getUserDetails();
  }
 

  getUserDetails(): void {
    this.adminService.getUserOrderByEmail(this.buyerEmail).subscribe((order) => {
      this.order = order;
      console.log(this.order);
    },
    (error: any) => {
      console.error(error);
    }
    );
  }

  

 
}