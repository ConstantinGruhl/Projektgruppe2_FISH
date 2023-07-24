import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private baseUrl = 'http://localhost:3000/friends';

  constructor(private http: HttpClient) { }

  addFriend(idProfile_Sender: number, idProfile_Receiver: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/addFriend`, { idProfile_Sender, idProfile_Receiver });
  }

  acceptFriendRequest(idProfile_Sender: number, idProfile_Receiver: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/acceptFriendRequest`, { idProfile_Sender, idProfile_Receiver });
  }

  denyFriendRequest(idProfile_Sender: number, idProfile_Receiver: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/denyFriendRequest`, { body: { idProfile_Sender, idProfile_Receiver } });
  }

  getFriendList(idProfile: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/friendList/${idProfile}`);
  }

  deleteFriend(idProfile_Sender: number, idProfile_Receiver: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteFriend`, { body: { idProfile_Sender, idProfile_Receiver } });
  }

  getFriendRequests(idProfile: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/requests/${idProfile}`);
  }

  getFriendsWithPlaytime(idProfile: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/friendsWithPlaytime/${idProfile}`);
  }
}
