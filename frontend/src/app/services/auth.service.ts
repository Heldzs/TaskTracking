import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'access_token';
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>('http://localhost:8000/api/auth/token/', { username, password });
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.next(false);
  }
}