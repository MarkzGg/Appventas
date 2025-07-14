import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt-token';
  private readonly ROLE_KEY='jwt-role';

  constructor(private http: HttpClient, private router: Router) {}

  login (credentials:{username:string; password:string}) {
    return this.http.post<{token:string}>(`${environment.apiUrl}/auth/login`, credentials);
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

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole()==='ROLE_ADMIN';
  }


}
