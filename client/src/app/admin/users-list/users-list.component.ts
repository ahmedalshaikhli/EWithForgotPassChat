import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/shared/models/UserDto';
import { AdminService } from '../admin.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: any[];
  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;
  searchTerm = '';

  constructor(private adminService: AdminService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers(this.pageIndex, this.pageSize, this.searchTerm).subscribe(response => {
      this.users = response.users;
      this.totalCount = response.totalCount;
    });
  }

  searchUsers() {
    this.pageIndex = 0; // Reset the page index when performing a new search
    this.loadUsers();
  }

  onPageChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadUsers();
  }

  resetSearch() {
    this.searchTerm = ''; // Clear the search term
    this.pageIndex = 0; // Reset the page index
    this.loadUsers();
  }


  showUserDetails(userId: string) {
    this.router.navigate(['/users/details', userId]);
  }

  editUser(userId: string) {
    this.router.navigate(['/users/edit', userId]);
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe(
        () => {
          console.log('User deleted successfully');
          // Remove the deleted user from the users array
          this.users = this.users.filter((user) => user.id !== userId);
        },
        (error) => {
          console.error('Error deleting user', error);
          // Handle the error, show a message, etc.
        }
      );
    }
  }
}