import { Injectable } from '@angular/core';
import { TokenPayload } from './interfaces/token-payload';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getPayload(): TokenPayload | null {
      const token = this.getToken();
  
      if (!token) {
        return null;
      }
  
      try {
        const payload = jwtDecode<TokenPayload>(token);
        console.log('Payload OK en getpayload: ', payload);
        return payload;
      } catch (error) {
        console.log('Error decodificando en getpayload: ', error);
        return null;
      }
    }
}
