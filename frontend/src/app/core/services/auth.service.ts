import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  experienceYears?: number;
  currentRole?: string;
  targetRole?: string; // For frontend compatibility
  targetRoleId?: string; // Backend field
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  experienceYears?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'skillpath_token';
  private readonly USER_KEY = 'skillpath_user';

  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);
  isLoading = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Fix for object targetRole - extract string ID if it's an object
        if (user.targetRole && typeof user.targetRole === 'object') {
          user.targetRole = user.targetRole._id || null;
          user.targetRoleId = user.targetRole;
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
        
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (e) {
        this.clearAuth();
      }
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    // Extract the ID string - backend might return populated object or string
    const targetRoleIdValue = typeof response.user.targetRoleId === 'string'
      ? response.user.targetRoleId
      : (response.user.targetRoleId as any)?._id || response.user.targetRole;
    
    // Map targetRoleId to targetRole for frontend compatibility
    const user = {
      ...response.user,
      targetRole: targetRoleIdValue,
      targetRoleId: targetRoleIdValue
    };
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    this.isLoading.set(false);
    this.router.navigate(['/dashboard']);
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  // Refresh user data from backend
  refreshUser(): Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/auth/me`).pipe(
      tap((response: any) => {
        const userData = response.user || response;
        
        // Extract the ID string - backend might return populated object or string
        const targetRoleIdValue = typeof userData.targetRoleId === 'string'
          ? userData.targetRoleId
          : (userData.targetRoleId as any)?._id || userData.targetRole;
        
        // Map targetRoleId to targetRole for frontend compatibility
        const user = {
          ...userData,
          targetRole: targetRoleIdValue,
          targetRoleId: targetRoleIdValue
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  // Update user profile
  updateProfile(data: { name?: string; experienceYears?: number; currentRole?: string }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/profile`, data).pipe(
      tap((response: any) => {
        if (response.success && response.user) {
          const user = this.currentUser();
          if (user) {
            const updatedUser = { ...user, ...response.user };
            localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
            this.currentUser.set(updatedUser);
          }
        }
      })
    );
  }

  // Set target role
  setTargetRole(roleId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/target-role`, { roleId }).pipe(
      tap((response: any) => {
        if (response.success && response.user) {
          const user = this.currentUser();
          if (user) {
            // Extract the ID string - backend might return populated object or string
            const targetRoleIdValue = typeof response.user.targetRoleId === 'string' 
              ? response.user.targetRoleId 
              : (response.user.targetRoleId as any)?._id || roleId;
            
            // Update user with string ID only
            const updatedUser = { 
              ...user,
              targetRole: targetRoleIdValue,
              targetRoleId: targetRoleIdValue
            };
            localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
            this.currentUser.set(updatedUser);
          }
        }
      })
    );
  }
}

