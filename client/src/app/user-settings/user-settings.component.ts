import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account/account.service';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent  implements OnInit  {
  currentUser$: Observable<User>;
  isAdmin$: Observable<boolean>;

  user: any;

  constructor(public accountService: AccountService,private router: Router) {}

  

  async ngOnInit(): Promise<void> {
    try {
      const data$ = await this.accountService.getCurrentUserForSetting();
      data$.subscribe(
        data => this.user = data,

      
        error => console.error('Failed to fetch user data', error)
      );
      console.log( this.user);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  }
  async deleteAccount(): Promise<void> {
    try {
      const observable = await this.accountService.getCurrentUserForSetting();
      observable.subscribe((currentUser: any) => {
        const email = currentUser?.email;
  
        if (!email) {
          throw new Error('Failed to get user email');
        }
  
        const confirmDelete = confirm('Are you sure you want to delete your account?');
        if (!confirmDelete) {
          return; // User canceled account deletion
        }
  
        this.accountService.deleteAccount(email)
      .then(() => {
        alert('your account was deleted');
        this.router.navigate(['/account/register']); // Navigate to the home page
      })
      .catch(error => {
        console.error('Failed to delete account', error);
        // Show an error message or handle the error
      });
      });
    } catch (error) {
      console.error('Failed to delete account', error);
      // Show an error message or handle the error
    }
  }
}
