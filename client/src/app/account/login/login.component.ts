import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public restPasswordEmail!: string;
  isValidEmail!:boolean;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })
  returnUrl: string;

  constructor(private accountService: AccountService, private router: Router, 
    private activatedRoute: ActivatedRoute) {
      this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop'
  }

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl)
    })
  }

/*   checkValidEmail(event: string){
    const value = event;
    const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }


  confirmToSend(){
    if(this.checkValidEmail(this.restPasswordEmail)) {
      console.log(this.restPasswordEmail);

      this.restPasswordEmail ="";

      const buttonRef = document.getElementById("closeBtn");
      buttonRef?.click();
    }
  } */
}
