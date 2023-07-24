import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaytimeService {
  private apiUrl = 'http://localhost:3000/playtime';

  constructor(private http: HttpClient) {}

  createPlaytime(idProfile: number, playTimeStart: string, playTimeEnd: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, {
      idProfile: idProfile,
      playTime_Start: playTimeStart,
      playTime_End: playTimeEnd
    });
  }

  getPlaytime(idProfile: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getPlaytime/${idProfile}`);
  }

}
