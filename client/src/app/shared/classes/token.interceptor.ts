import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: this.auth.getToken(),
        },
      });
    }
    return next.handle(req);
  }
}
