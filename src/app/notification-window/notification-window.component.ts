import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FriendService } from '../_services/friends.service';
import { RequestsService } from '../_services/requests.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-notification-window',
  templateUrl: './notification-window.component.html',
  styleUrls: ['./notification-window.component.css']
})
export class NotificationWindowComponent implements OnInit {
  userId = this.userService.getCurrentID();

  @Output() closeNotification = new EventEmitter<void>();
  friendRequests: any[] = [];
  areThereRequests: boolean = false;
  appointmentRequests: any[] = [];
  areThereAppointmentRequests: boolean = false;

  constructor(
    private friendService: FriendService,
    private userService: UserService,
    private requestsService: RequestsService) { }

  ngOnInit(): void {
    console.log(this.areThereRequests)
    this.friendService.getFriendRequests(this.userId).subscribe(
      data => {
        this.areThereRequests = true;
        this.friendRequests = data.requests;
      },
      error => {
        this.areThereRequests = false;
        console.log(error);
        console.error('Es gab einen Fehler beim Abrufen der Freundesanfragen!', error);
      }
    );

    if (this.userId !== 0) {
      this.requestsService.listAll(this.userId).subscribe(
        response => {
          this.areThereAppointmentRequests = true;
          this.appointmentRequests = response.data;
        },
        error => {
          this.areThereAppointmentRequests = false;
          console.log(error);
          console.error('Es gab einen Fehler beim Abrufen der Terminanfragen!', error);
        }
      );
    }
  }

  onPressClose() {
    this.closeNotification.emit();
  }

 acceptRequest(user: any): void {
   const currentUserId = this.userService.getCurrentID();
   this.friendService.acceptFriendRequest(user.idProfile_Sender, currentUserId).subscribe(
     response => {
       this.friendRequests = this.friendRequests.filter(req => req !== user);
     },
     error => {
       console.error('Fehler beim Annehmen der Freundschaftsanfrage', error);
     }
   );
 }

 declineRequest(user: any): void {
   const currentUserId = this.userService.getCurrentID();
   this.friendService.denyFriendRequest(user.idProfile_Sender, currentUserId).subscribe(
     response => {
       this.friendRequests = this.friendRequests.filter(req => req !== user);
     },
     error => {
       console.error('Fehler beim Ablehnen der Freundschaftsanfrage', error);
     }
   );
 }


  acceptAppRequest(user: any): void {
    const currentUserId = this.userService.getCurrentID();
    this.requestsService.acceptAppointment(currentUserId, user.idAppointmentRequests).subscribe(
      response => {
        this.appointmentRequests = this.appointmentRequests.filter(req => req !== user);
      },
      error => {
        console.error('Fehler beim Annehmen der Terminanfrage', error);
      }
    );
  }

  declineAppRequest(user: any): void {
    const currentUserId = this.userService.getCurrentID();
    this.requestsService.denyAppointment(currentUserId, user.idAppointmentRequests).subscribe(
      response => {
        this.appointmentRequests = this.appointmentRequests.filter(req => req !== user);
      },
      error => {
        console.error('Fehler beim Ablehnen der Terminanfrage', error);
      }
    );
  }
}
