import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: any;
  editUserForm: FormGroup;
  userProfilePhoto: File;
preview: string | ArrayBuffer;
  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.editUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      userProfilePhoto: [''],
      address: this.fb.group({
        firstName: [''],
        lastName: [''],
        street: [''],
        city: [''],
        state: [''],
        zipcode: [''],
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
          UserProfilePhoto: this.user.userProfilePhoto,
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
  
  onSelectFile(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files && eventTarget.files.length > 0) {
      const file = eventTarget.files[0];
      this.userProfilePhoto = file;
      this.editUserForm.get('userProfilePhoto').setValue(file.name); // set the form control value to the file name

      // Create an object of FileReader
      let reader = new FileReader();
      // Read the uploaded file as Data URL
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.preview = reader.result;
      }
    }
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      const formData = new FormData();
      Object.keys(this.editUserForm.value).forEach(key => {
        if (key === 'address') {
          Object.keys(this.editUserForm.get(key).value).forEach(subKey => {
            if (this.editUserForm.get(key).get(subKey).value) {
              formData.append(`address[${subKey}]`, this.editUserForm.get(key).get(subKey).value);
            }
          });
        } else if (this.editUserForm.get(key).value) {
          formData.append(key, this.editUserForm.get(key).value);
        }
      });
      if (this.userProfilePhoto) {
        formData.append('userProfilePhoto', this.userProfilePhoto);
      }
    
      this.accountService.updateUserInformation(formData).subscribe(
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
      this.toastr.error('The form is not valid.');
    }
  }
}