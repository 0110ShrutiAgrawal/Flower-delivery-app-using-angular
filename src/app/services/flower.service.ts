import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { IFlower } from '../models/flower';
import { catchError } from 'rxjs/operators';
import { ICartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class FlowerService {

  private url: string = '/assets/api/data.json';
  public hasUserName = false;
  public userName = '';
  public cartItems = [];
  public customError = {
    status: 500,
    message: 'Sorry! Something went wrong :('
  }

  userNameChange: Subject<string> = new Subject<string>();

  cartItemsChange: Subject<ICartItem[]> = new Subject<ICartItem[]>();

  constructor(private httpClient: HttpClient) {
    this.cartItemsChange.subscribe((value: ICartItem[]) => {
      this.cartItems.push(value);
    });
    this.userNameChange.subscribe((name) => {
      this.userName = name;
    });
  }

  public getFlowersList = (): Observable<IFlower[]> => {
    return this.httpClient.get<IFlower[]>(this.url).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err || this.customError);
      })
    );
  }

  public setUserName = (name) => {
    this.userNameChange.next(name);
  }

  public setCartItem = (item) => {
    this.cartItemsChange.next(item);
  }

  public removeCartItem = (item) => {
    this.cartItems = this.cartItems.filter((menu) => menu.id != item.id);
  }

}
