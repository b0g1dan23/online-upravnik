import {
    HttpEvent,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptorFn,
    HttpHandlerFn
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NestError } from '../store/user/user.model';

export class NestErrorResponse implements NestError {
    statusCode: number;
    message: string;
    error: string;

    constructor(httpError: HttpErrorResponse) {
        const nestError = httpError.error as NestError;
        this.statusCode = nestError?.statusCode ?? httpError.status;
        this.message = nestError?.message ?? httpError.message;
        this.error = nestError?.error ?? httpError.statusText;
    }
}

export const nestErrorInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    return next(req).pipe(
        catchError((httpError: HttpErrorResponse) => {
            const normalized = new NestErrorResponse(httpError);
            return throwError(() => normalized);
        })
    );
};