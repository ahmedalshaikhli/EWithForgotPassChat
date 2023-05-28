import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userId: string;
  user: any = { address: {} };

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router, // Add this line
    private location: Location // Add this line
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getUserDetails();
  }
 

  getUserDetails(): void {
    this.adminService.getUserById(this.userId).subscribe((user) => {
      this.user = user;
    });
  }

  goBack(): void {
    this.location.back();
  }
}