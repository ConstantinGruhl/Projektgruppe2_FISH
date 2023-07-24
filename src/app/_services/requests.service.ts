import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  baseURL: string = 'http://localhost:3000/requests'; // hier die URL Ihrer API einsetzen

  constructor(private httpClient: HttpClient) { }

  addAppointment(id: number, appointmentData: any): Observable<any> {
       return this.httpClient.post(`${this.baseURL}/add/${id}`, appointmentData);
  }

  addGroup(groupData: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/addGroup`, groupData);
  }

  addProfiles(profileData: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/addProfiles`, profileData);
  }

  listAll(idProfile: number): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/listAll/${idProfile}`);
  }

  acceptAppointment(idProfile: number, idAppointmentRequest: number): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/accept/${idProfile}/${idAppointmentRequest}`, {});
  }

  denyAppointment(idProfile: number, idAppointmentRequest: number): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/deny/${idProfile}/${idAppointmentRequest}`, {});
  }

  getAcceptedRequests(profileId: number): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/acceptedRequests/${profileId}`);
  }

  // Hinzugefügte Methode
  getProfilesForAppointment(idAppointmentRequest: number): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/profiles/${idAppointmentRequest}`);
  }
}
