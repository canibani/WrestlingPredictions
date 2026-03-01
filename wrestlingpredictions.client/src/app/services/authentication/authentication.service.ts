import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Login } from '../../models/authentication/login.model';
import { Register } from '../../models/authentication/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = 'https://localhost:59547/api/authentication';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private tokenKey = 'auth_token';
  private accessToken: string | null = "";
  constructor(private http: HttpClient) { }

  // Change to sign in later
  register(request: Register): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      request,
      { withCredentials: true }
    );
  }

  login(request: Login): Observable<any> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request,
      { withCredentials: true }
    ).pipe(
      tap((response: LoginResponse) => this.setToken(response.accessToken))
    );
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.startExpiryTimer(token);
  }
  //logout(): Observable<any> {
  //  return this.http.post(
  //    `${this.apiUrl}/logout`,
  //    {},
  //    { withCredentials: true }
  //  );
  //}

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  logoutTimer: any;

  startExpiryTimer(token: string) {
    const decoded = jwtDecode<JwtPayload>(token);

    const expiresAt = decoded.exp * 1000; // convert to ms
    const timeout = expiresAt - Date.now();

    if (timeout <= 0) {
      this.logout();
      return;
    }

    this.logoutTimer = setTimeout(() => {
      this.logout();
      alert("Session expired. Please login again.");
    }, timeout);
  }
}


export interface LoginResponse {
  accessToken: string;
}
interface JwtPayload {
  exp: number;
}
