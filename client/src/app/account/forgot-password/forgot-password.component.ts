import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService,private router: Router) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
  
    const email = this.forgotPasswordForm.controls.email.value;
    this.accountService.forgotPassword(email).subscribe(
      data => {
        // Handle successful forgot password request
        console.log('Forgot password request sent successfully sent! check your email');
        alert('Forgot password request sent successfully sent! check your email');
        this.router.navigate(['/account/login']); // Navigate to login component
      },
      error => {
        // Handle forgot password request error
        console.error('Error sending forgot password request');
      }
    );
  }
}