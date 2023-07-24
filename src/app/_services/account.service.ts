import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly baseUrl = 'http://localhost:3000/account';

  constructor(private http: HttpClient) { }

register(firstname: string, lastname: string, accountname: string, profilename: string, password: string, email: string): Observable<any> {
  const user = {
    firstname,
    lastname,
    accountname,
    profilename,
    password,
    email
  };
  return this.http.post<any>(`${this.baseUrl}/register`, user);
}

  login(accountname: string, password: string): Observable<any> {
    const user = {
      accountname,
      password
    };
    return this.http.post<any>(`${this.baseUrl}/login`, user);
  }
}
