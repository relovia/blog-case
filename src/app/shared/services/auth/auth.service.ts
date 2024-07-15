import { Injectable } from '@angular/core';
import {
  AuthenticationControllerService,
  GetUserByIdResponse,
  LoginRequest,
  LoginResponse,
  UserControllerService,
} from '../api';
import { TokenService } from '../token/token.service';
import { Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private authService: AuthenticationControllerService,
    private userService: UserControllerService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = this.tokenService.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getUser(): Observable<GetUserByIdResponse> {
    return this.userService.getUserById({ id: 1 });
  }

  // Check if the token is expired
  private isTokenExpired(token: string): boolean {
    const payload = this.getPayloadFromToken(token);
    if (!payload) return true;

    const expirationTime = payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > expirationTime;
  }

  // Log the user in
  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = {
      email,
      password,
    };

    return this.authService.login({ loginRequest }).pipe(
      tap((response) => {
        this.tokenService.setToken(response.token!);
      })
    );
  }

  // Log the user out
  logout(): void {
    this.tokenService.clearTokens();
    this.router.navigate(['/login']);
  }

  // Get the role of the user from the token
  getRole(): string | null {
    const token = this.tokenService.getToken();
    if (!token) return null;

    try {
      const payload = this.getPayloadFromToken(token);
      console.log('payload', payload);
      console.log("Payload's role: ", payload.role);
      return payload.role || null;
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return null;
    }
  }

  // When token is expired, refresh the token
  refreshToken(): Observable<LoginResponse | null> {
    const token = this.tokenService.getToken();
    if (!token) return of(null);

    return this.authService.refreshToken().pipe(
      tap((response) => {
        this.tokenService.setToken(response.token!);
      })
    );
  }

  private getPayloadFromToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(payload);
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return null;
    }
  }
}
