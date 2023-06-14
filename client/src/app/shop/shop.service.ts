import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Brand } from '../shared/models/brand';
import { Pagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { Type } from '../shared/models/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;
  brandSelected = new EventEmitter<number>();
  products: IProduct[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  pagination?: Pagination<IProduct[]>;
  shopParams = new ShopParams();
  productCache = new Map<string, Pagination<IProduct[]>>();

  constructor(private http: HttpClient) { }

  getProducts(useCache = true): Observable<Pagination<IProduct[]>> {
    if (!useCache) this.productCache = new Map();

    if (this.productCache.size > 0 && useCache) {
      const cacheKey = this.getCacheKeyFromParams();
      if (this.productCache.has(cacheKey)) {
        this.pagination = this.productCache.get(cacheKey);
        if (this.pagination) return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if (this.shopParams.brandId > 0) params = params.append('brandId', String(this.shopParams.brandId));
    if (this.shopParams.typeId) params = params.append('typeId', String(this.shopParams.typeId));
    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', String(this.shopParams.pageNumber));
    params = params.append('pageSize', String(this.shopParams.pageSize));
    if (this.shopParams.search) params = params.append('search', this.shopParams.search);

    return this.http.get<Pagination<IProduct[]>>(this.baseUrl + 'products', { params }).pipe(
      map(response => {
        const cacheKey = this.getCacheKeyFromParams();
        this.productCache.set(cacheKey, response);
        this.pagination = response;
        return response;
      })
    );
  }

  private getCacheKeyFromParams(): string {
    return Object.values(this.shopParams).join('-');
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number): Observable<IProduct> {
    const product = [...this.productCache.values()]
      .reduce((acc, paginatedResult) => {
        return { ...acc, ...paginatedResult.data.find(x => x.id === id) };
      }, {} as IProduct);

    if (Object.keys(product).length !== 0) return of(product);

    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands(): Observable<Brand[]> {
    if (this.brands.length > 0) return of(this.brands);

    return this.http.get<Brand[]>(this.baseUrl + 'products/brands').pipe(
      map(brands => {
        this.brands = brands;
        return brands;
      })
    );
  }

  getTypes(): Observable<Type[]> {
    if (this.types.length > 0) return of(this.types);

    return this.http.get<Type[]>(this.baseUrl + 'products/types').pipe(
      map(types => {
        this.types = types;
        return types;
      })
    );
  }

  setBrandId(brandId: number) {
    this.shopParams.pageNumber = 1;
    this.shopParams.brandId = brandId;
    this.brandSelected.emit(brandId);
    this.getProducts();
  }
}