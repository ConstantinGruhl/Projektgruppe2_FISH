import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseURL: string = 'http://localhost:3000/profile';

  constructor(private httpClient: HttpClient) { }

  listUsers(): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/listUsers`);
  }

  getUser(idProfile: number): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/${idProfile}`);
  }

  createUser(newProfile: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/createUser`, newProfile);
  }

  deleteUser(deleteProfile: any): Observable<any> {
    return this.httpClient.request('delete', `${this.baseURL}/deleteUser`, { body: deleteProfile });
  }
}
