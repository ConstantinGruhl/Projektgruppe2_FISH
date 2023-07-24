import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: string;
  private currentID: number;
  private _isLoggedIn: boolean;

  constructor() {
    this.currentUser = localStorage.getItem('currentUser') || "Nicht angemeldet";
    this.currentID = Number(localStorage.getItem('currentID')) || 0;
    this._isLoggedIn = Boolean(localStorage.getItem('_isLoggedIn')) || false;
  }

  setCurrentUser(user: string | "Nicht angemeldet", id: number | 0): void {
    if(user && user !== "Nicht angemeldet" && id !== 0) {
      this.currentUser = user;
      this.currentID = id;
      this._isLoggedIn = true;

      localStorage.setItem('currentUser', user);
      localStorage.setItem('currentID', id.toString());
      localStorage.setItem('_isLoggedIn', 'true');
    } else {
      this.currentUser = "Nicht angemeldet";
      this.currentID = 0;
      this._isLoggedIn = false;

      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentID');
      localStorage.removeItem('_isLoggedIn');
    }
  }

  getCurrentUser(): string | "Nicht Angemeldet" {
    return this.currentUser;
  }

  getCurrentID(): number | 0 {
    return this.currentID;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  logout(): void {
    this.currentUser = "Nicht angemeldet";
    this.currentID = 0;
    this._isLoggedIn = false;

    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentID');
    localStorage.removeItem('_isLoggedIn');
  }
}
