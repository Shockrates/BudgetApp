import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const jwtToken = localStorage.getItem('JWT_TOKEN');

  if (!jwtToken) {
    return next(req);
  }

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${jwtToken}`,
    }
  });
  return next(clonedReq);


};
