import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { RestService } from './http/rest.service';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Customer } from '../models/Customer';
import { map } from 'rxjs/operators';
import { TokenStorageService } from '../token-storage.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { appConstants } from '../constants/appConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RestService {
    private currentCustomerSubject: BehaviorSubject<Customer>;
    public currentCustomer: Observable<Customer>;
    private isLogged = new Subject<boolean>();

    // Observable string streams
    isLoggedAnnounced$ = this.isLogged.asObservable();

    constructor (http: HttpClient,
      private tokenStorageToken: TokenStorageService,
      private localStorageService: LocalStorageService,
      private router: Router,
      private notificationService: NotificationService,
      @Inject('BASE_URL') baseUrl: string) {
        super(http, baseUrl);

      var storedCustomer = JSON.parse(this.localStorageService.getValueByKey(appConstants.storedCustomer));
      this.currentCustomerSubject = new BehaviorSubject<Customer>(storedCustomer);
      this.currentCustomer = this.currentCustomerSubject.asObservable();
    }

    public get currentCustomerValue(): Customer {
      return this.currentCustomerSubject.value;
    }

    login(email: string, password: string) {
      return this.post("customers/login", { email, password })
        .pipe(map(customer => {
          // login successful if there's a jwt token in the response
          if (customer && customer.data.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.localStorageService.setValue(appConstants.storedCustomer, JSON.stringify(customer.data));
            this.tokenStorageToken.saveToken(customer.data.token);
            this.currentCustomerSubject.next(customer.data);
            this.isLogged.next(true);
          }
          else {
            this.notificationService.showError(customer.data.validationResult.errors[0].errorMessage);
          }

        return customer;
      }));
    }

    logout() {
      // remove user from local storage to log user out
      localStorage.removeItem(appConstants.storedCustomer);
      this.tokenStorageToken.clearToken();
      this.currentCustomerSubject.next(null);

      //broadcasting to listeners
      this.isLogged.next(false);

      // redirects
      this.router.navigate(["/login"]);
    }
}

