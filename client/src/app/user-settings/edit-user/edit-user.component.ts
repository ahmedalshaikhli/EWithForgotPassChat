import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: any;
  editUserForm: FormGroup;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.editUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      address: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipcode: ['', Validators.required],
      }),
    });
  }
  
  async ngOnInit(): Promise<void> {
    try {
      const userObservable = await this.accountService.getCurrentUserForSetting();
      userObservable.subscribe((userData) => {
        this.user = userData;
  
        // Set the form values once the user data is fetched
        this.editUserForm.patchValue({
          email: this.user.email,
          displayName: this.user.displayName,
          address: {
            firstName: this.user.address?.firstName,
            lastName: this.user.address?.lastName,
            street: this.user.address?.street,
            city: this.user.address?.city,
            state: this.user.address?.state,
            zipcode: this.user.address?.zipcode,
          },
        });
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      const updatedUserData = this.editUserForm.value;
      this.accountService.updateUserInformation(updatedUserData).subscribe(
        (response) => {
          console.log('User information updated successfully:', response);
          this.toastr.success('User information updated successfully');
          this.router.navigate(['/user-settings']);
        },
        (error) => {
          console.error('Failed to update user information:', error);
          this.toastr.error('Failed to update user information');
        }
      );
    } else {
      console.log('The form is not valid.');
    }
  }



}
