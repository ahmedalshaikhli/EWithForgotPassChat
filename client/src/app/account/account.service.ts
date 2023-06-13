import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, ReplaySubject, take, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address, User } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  private isAdminSource = new ReplaySubject<boolean>(1);
  isAdmin$ = this.isAdminSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }


  isAdmin(token: string): boolean {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.role.indexOf('Admin') > -1) {
        return true;
      }
    }
  }


  loadCurrentUser(token: string | null) {
    if (token == null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(this.baseUrl + 'account', {headers}).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.isAdminSource.next(this.isAdmin(user.token));
        }
      })
    );
  }

  login(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', values).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          this.isAdminSource.next(this.isAdmin(user.token));
        }
      })
    );
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(this.baseUrl + 'account/emailExists?email=' + email);
  }

  getUserAddress() {
    return this.http.get<Address>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: Address) {
    return this.http.put(this.baseUrl + 'account/address', address);
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}account/reset-password`;
    const requestBody = {
      email: email,
      token: token,
      newPassword: newPassword
    };
    return this.http.post(url, requestBody);
  }


  forgotPassword(email: string) {
    const body = { email: email };
    return this.http.post(this.baseUrl + 'account/forgotpassword', body, { responseType: 'text' }).pipe(
      catchError(error => {
        console.log('Error response:', error); // Log the error response
        
        // Check if the error response is actually a success
        if (error.status >= 200 && error.status < 300) {
          console.log('Email was sent successfully');
          return of(error);
        }
  
        throw error;
      })
    );
  }

  async getCurrentUserForSetting(): Promise<Observable<any>> {
    let email: string | null = null;
  
    await this.currentUser$.pipe(take(1)).toPromise().then(user => {
      if (user && user.token) {
        email = this.getEmailFromToken(user.token);
      }
    });
  
    if (!email) {
      return throwError('Failed to get user email from the token');
    }
  
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(this.baseUrl + 'account/getcurrentusersetting', { params });
  }

  getEmailFromToken(token: string): string | null {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log('Token:', token);
      console.log('Decoded token:', decodedToken);
  
      return decodedToken.email;
    }
    return null;
  }

//update user info in setting
  updateUserInformation(userUpdate: any): Observable<any> {
    return this.http.put(this.baseUrl + 'account/update-user', userUpdate);
  }

  deleteUserByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.delete(this.baseUrl + 'account/delete-user', { params });
  }

  deleteAccount(email: string): Promise<any> {
    const url = `${this.baseUrl}account/delete-account`;
  
    const params = new HttpParams().set('email', email);
  
    return this.http.delete(url, { params })
      .toPromise()
      .catch(error => {
        throw new Error('Failed to delete account');
      });
  }
}
