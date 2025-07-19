import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class AuthService {

  private readonly TOKEN_KEY = 'jwt-token';
  private readonly ROLE_KEY='jwt-role';
  private jwtHelper: JwtHelperService = new JwtHelperService(); // Instanciar

  constructor(private http: HttpClient, private router: Router) {}

  register(credentials: { username: string; password: string }): Observable<any> {
    // Asumiendo que tu backend tiene un endpoint /registro para usuarios normales
    return this.http.post(`${environment.apiUrl}/registro-comprador`, credentials, { responseType: 'text' });
  }

  getLoggedInUsername(): string | null {
        const token = this.getToken();
        if (token && !this.jwtHelper.isTokenExpired(token)) {
          const decodedToken = this.jwtHelper.decodeToken(token);
          return decodedToken.sub; // 'sub' es el campo estándar para el sujeto (username)
        }
        return null;
      }

  hasRole(roleToCheck: string): boolean {
            const userRole = this.getRole();
            return userRole === roleToCheck;
          }

  login (credentials:{username:string; password:string}) {
    return this.http.post<{token:string, role: string}>(`${environment.apiUrl}/auth/login`, credentials);
  }

  saveToken(token:string) {
    const payload=JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, payload.role);
  }

  getToken(){
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(){
    return localStorage.getItem(this.ROLE_KEY);
  }

   logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole()==='ADMIN';
  }

  isUser(): boolean {
    return this.getRole() === 'USER';
  }

  isComprador(): boolean {
    return this.getRole() === 'COMPRADOR';
  }

  isVisitante(): boolean {
    return this.getRole() === 'VISITANTE';
  }



}
