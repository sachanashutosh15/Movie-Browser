import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { vars } from '../environment/api.config';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const updatedReq = req.clone({
      headers: new HttpHeaders({ authorization: `Bearer ${vars.accessToken}` }),
    });
    return next.handle(updatedReq);
  }
}
