import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/';
  constructor(private http: HttpClient) {}
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register/`, userData);
  }
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}token/`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      })
    );
  }
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
