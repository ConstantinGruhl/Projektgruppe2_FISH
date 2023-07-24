import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GamesAndPlatformsService {
  private baseURL = 'http://localhost:3000/gamesAndPlatforms'; 

  constructor(private http: HttpClient) { }

  addGame(name: string) {
    return this.http.post(`${this.baseURL}/addGame`, { Name: name });
  }

  addPlatform(name: string) {
    return this.http.post(`${this.baseURL}/addPlatform`, { Name: name });
  }

  addGameAndPlatform(profileId: string, idGame: string, idPlatform: string) {
    return this.http.post(`${this.baseURL}/add/${profileId}`, { idGame, idPlatform });
  }

  deleteGameAndPlatform(profileId: string, idGame: string, idPlatform: string) {
    return this.http.delete(`${this.baseURL}/delete/${profileId}`, { body: { idGame, idPlatform } });
  }

  listAllGamesAndPlatforms(profileId: string) {
    return this.http.get(`${this.baseURL}/listAll/${profileId}`);
  }
}
