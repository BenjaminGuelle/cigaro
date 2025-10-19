import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, catchError, retry, throwError } from 'rxjs';
import { API_URL } from '../tokens/api.token';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  retryAttempts?: number;
  withCredentials?: boolean;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public errors?: any
  ) {
    super(message);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private buildHeaders(customHeaders?: Record<string, string>): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...customHeaders
    });
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, String(params[key]));
      });
    }
    return httpParams;
  }

  private handleError(error: HttpErrorResponse) {
    const apiError = new ApiError(
      error.status,
      error.error?.message || error.message || 'Une erreur est survenue',
      error.error?.errors
    );
    return throwError(() => apiError);
  }

  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    return firstValueFrom(
      this.http.get<T>(url, {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
        withCredentials: options?.withCredentials
      }).pipe(
        retry(options?.retryAttempts || 0),
        catchError(this.handleError)
      )
    );
  }

  async post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    return firstValueFrom(
      this.http.post<T>(url, body, {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
        withCredentials: options?.withCredentials
      }).pipe(
        retry(options?.retryAttempts || 0),
        catchError(this.handleError)
      )
    );
  }

  async put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    return firstValueFrom(
      this.http.put<T>(url, body, {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
        withCredentials: options?.withCredentials
      }).pipe(
        retry(options?.retryAttempts || 0),
        catchError(this.handleError)
      )
    );
  }

  async patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    return firstValueFrom(
      this.http.patch<T>(url, body, {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
        withCredentials: options?.withCredentials
      }).pipe(
        retry(options?.retryAttempts || 0),
        catchError(this.handleError)
      )
    );
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    return firstValueFrom(
      this.http.delete<T>(url, {
        headers: this.buildHeaders(options?.headers),
        params: this.buildParams(options?.params),
        withCredentials: options?.withCredentials
      }).pipe(
        retry(options?.retryAttempts || 0),
        catchError(this.handleError)
      )
    );
  }
}