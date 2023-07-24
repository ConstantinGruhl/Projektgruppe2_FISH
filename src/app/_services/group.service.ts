import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private baseUrl = 'http://localhost:3000/group';

  constructor(private http: HttpClient) {}

  listGroups(): Observable<any> {
    return this.http.get(`${this.baseUrl}/listGroups`);
  }

  usersWithPlayTime(groupId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/usersWithPlayTime/${groupId}`);
  }

  createGroup(newGroup: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createGroup`, newGroup);
  }

  deleteGroup(groupId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteGroup/${groupId}`);
  }

  updateGroup(groupId: string, newDescription: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateGroup/${groupId}`, {description: newDescription});
  }

  addProfilesToGroup(profilesToAdd: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addProfilesToGroup`, profilesToAdd);
  }

  getProfilesInGroup(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usersInGroup/${groupId}`);
  }

  deleteUser(userId: number, groupId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteUser/${userId}/${groupId}`);
  }
    getGroupsForUser(userId: number): Observable<any> {
      return this.http.get(`${this.baseUrl}/groupsForUser/${userId}`);
    }
}
