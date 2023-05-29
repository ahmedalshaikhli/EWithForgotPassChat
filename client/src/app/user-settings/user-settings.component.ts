import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account/account.service';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent  implements OnInit  {
  currentUser$: Observable<User>;
  isAdmin$: Observable<boolean>;

  user: any;

  constructor(public accountService: AccountService) {}

  

  async ngOnInit(): Promise<void> {
    try {
      const data$ = await this.accountService.getCurrentUserForSetting();
      data$.subscribe(
        data => this.user = data,
        error => console.error('Failed to fetch user data', error)
      );
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  }

  
}
  


