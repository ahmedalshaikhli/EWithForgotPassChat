import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {ProductFormValues} from '../shared/models/product';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { User } from '../shared/models/user';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  user: User[] = [];
  constructor(private http: HttpClient) { }

  createProduct(product: ProductFormValues) {
    return this.http.post(this.baseUrl + 'products', product);
  }

  updateProduct(product: ProductFormValues, id: number) {
    return this.http.put(this.baseUrl + 'products/' + id, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + 'products/' + id);
  }
  uploadImage(file: File, id: number) {
    const formData = new FormData();
    formData.append('photo', file, 'image.png');
    return this.http.put(this.baseUrl + 'products/' + id + '/photo', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteProductPhoto(photoId: number, productId: number) {
    return this.http.delete(this.baseUrl + 'products/' + productId + '/photo/' + photoId);
  }

  setMainPhoto(photoId: number, productId: number) {
    return this.http.post(this.baseUrl + 'products/' + productId + '/photo/' + photoId, {});
  }


  getTotalUsersCount(searchTerm: string): Observable<number> {
    const params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '0')
      .set('searchTerm', searchTerm);
  
    return this.http
      .get<{ users: User[]; totalCount: number }>(this.baseUrl + 'account/all-users', { params })
      .pipe(map((response) => response.totalCount));
  }

  getAllUsers(pageIndex: number = 0, pageSize: number = 10, searchTerm: string = '') {
    const url = this.baseUrl + `account/all-users?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`;
    return this.http.get<any>(url);
  }
  getUserById(id: string) {
    const user =this.user.find(p => p.id === id);

    if(user) return of(user);
  
    return this.http.get<User>(this.baseUrl + 'account/edit' + id);
  }


  updateUser(id: string, user: any): Observable<any> {
    const url = `${this.baseUrl}account/edit/${id}`;
    return this.http.put(url, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}account/delete/${id}`);
  }

  getOrders() {
    return this.http.get<any>(this.baseUrl + 'orders/all');
  }
  getAllOrders(pageIndex: number = 0, pageSize: number = 10, searchTerm: string = '') {
    const url = this.baseUrl + `orders/allorders?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`;
    return this.http.get<any>(url);
  }
  getUserOrderByEmail(buyerEmail:string) {
    return this.http.get<any>(this.baseUrl + 'orders/email/' + buyerEmail);
  }
  

}