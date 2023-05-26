import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match.validator';
import { AccountService } from '../account.service';
import { Router , ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})


export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  private email: string;
private token: string;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private activatedRoute: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.email = this.activatedRoute.snapshot.queryParamMap.get('email');
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const newPassword = this.resetPasswordForm.controls.newPassword.value;
    this.accountService.resetPassword(this.email, this.token, newPassword).subscribe(
      data => {
        // Handle successful password reset
        alert('Password successfully reset');
        console.log('Password successfully reset');
        this.router.navigate(['/account/login']); // Navigate to login component
      },
      error => {
        // Handle password reset error
        console.error('Error resetting password', error);
      }
    );
  }
}
