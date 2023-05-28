import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';


import { Location } from '@angular/common';
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userId: string;
  user: any = {};

  constructor(private userService: AdminService, private route: ActivatedRoute,private location: Location,private router: Router,) {}

  ngOnInit() {

    if (!this.user.address) {
      this.user.address = {
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',

      };
    }
    this.userId = this.route.snapshot.paramMap.get('id');
    // Fetch the user data
    this.userService.getUserById(this.userId).subscribe((user) => {
      this.user = user;
    });
  }
  goBack(): void {
    this.location.back();
  }
  onSave() {
    this.userService.updateUser(this.userId, this.user).subscribe(
      (updatedUser) => {
        console.log('User updated successfully', updatedUser);
        // Redirect or show a success message
      },
      (error) => {
        console.error('Error updating user', error);
        // Handle the error, show a message, etc.
      }
    );
  }
}