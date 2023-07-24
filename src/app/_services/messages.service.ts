import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'http://localhost:3000/messages'; 

  constructor(private http: HttpClient) {}

  notifyFriendRequest(idProfileReceiver: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifyFriendRequest`, { idProfile_Receiver: idProfileReceiver });
  }

  openRequests(idProfile: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/openRequests/${idProfile}`);
  }

  acceptedRequests(idProfile: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/acceptedRequests/${idProfile}`);
  }
}
