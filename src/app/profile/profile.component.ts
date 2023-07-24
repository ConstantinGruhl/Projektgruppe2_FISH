import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  username: string = '';
  email: string = '';
  password: string = '';
  newPassword: string = '';
  profilePicture: File | undefined;

  onFileSelected(event: any) {
    this.profilePicture = event.target.files[0];
  }

  updateProfile() {
    if (this.newPassword !== '') {
      if (this.newPassword === this.password) {
        alert('Das neue Passwort muss sich vom aktuellen Passwort unterscheiden.');
        return;
      }
      if (this.password === '') {
        alert('Bitte geben Sie das aktuelle Passwort ein.');
        return;
      }
    }
    alert('Profil erfolgreich aktualisiert!');
  }
}
