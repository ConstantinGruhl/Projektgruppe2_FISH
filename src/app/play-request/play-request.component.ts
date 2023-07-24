import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GroupDropdownComponent } from '../group-dropdown/group-dropdown.component';
import { RequestsService } from '../_services/requests.service';
import { UserService } from '../_services/user.service';
import { BehaviorSubject } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-play-request',
  templateUrl: './play-request.component.html',
  styleUrls: ['./play-request.component.css']
})
export class PlayRequestComponent implements OnInit {

  @Output() closeRequest = new EventEmitter<void>();
  selectedGroupID = new BehaviorSubject<number>(0);

  handleSelectedGroupID(id: number): void {
    this.selectedGroupID.next(id);
    console.log(this.selectedGroupID.value);
  }

  constructor(private requestsService: RequestsService, private userService: UserService, private refreshService: RefreshService) { }
  userInputControl = new FormControl('Hey, ich habe gesehen, dass du heute spielen möchtest.', [Validators.maxLength(500)]);
  isTimeSet = false;

  username = '';
  public timeOn: string = '';
  public timeOff: string = '';
  public usr = '';
  public groupUsers: Array<string> = [];
  public errorMessage = '';

  get charactersRemaining(): number {
    return (this.userInputControl.value.length || 0);
  }

  saveOnTime(time: string){
    this.timeOn = time;
  }

  saveOffTime(time: string){
    this.timeOff = time;
  }

  timeSet(){
    this.isTimeSet = true;
  }

  setGroupUsers(users: Array<string>) {
      this.groupUsers = users;
  }

  timeStringToDate(time: string): string {
      let now: Date = new Date();
      let date: string = now.getUTCFullYear() + '-' +
          ('0' + (now.getUTCMonth() + 1)).slice(-2) + '-' +
          ('0' + now.getUTCDate()).slice(-2) + ' ' +
          time + ':00';

      return date;
  }

  ngOnInit(): void {
  }

 onPress() {
   if (this.userInputControl.invalid) {
     return;
   }

   const userId = this.userService.getCurrentID();
   const gameId = 1;
   const platformId = 1;

   const playTimeStart = this.timeStringToDate(this.timeOn);
   const playTimeEnd = this.timeStringToDate(this.timeOff);

   const appointmentData = {
     proposedStartTime: playTimeStart,
     proposedEndTime: playTimeEnd,
     description: this.userInputControl.value,
     gameId: gameId,
   };

   this.requestsService.addAppointment(userId, appointmentData).subscribe(
     (res) => {
       const groupId = this.selectedGroupID.value;
       const requestData = {
         requestId: res.idAppointmentRequest,
         groupId: groupId
       };

       this.requestsService.addGroup(requestData).subscribe(
         (res) => {
           this.requestsService.listAll(userId).subscribe(
             response => {
               const request = response.data.find((r: any) => r.idProfileSender_AppointmentRequest === userId);
               if (request) {
                 this.requestsService.acceptAppointment(userId, request.idAppointmentRequests).subscribe(
                   response => {
                     this.refreshService.refresh();
                     this.closeRequest.emit();
                   },
                   error => {
                     this.errorMessage = error.error.message;
                     console.error('Fehler beim Annehmen der Terminanfrage', error);
                   }
                 );
               } else {
                 console.log('Es wurde keine passende Anfrage gefunden.');
               }
             },
             error => {
               this.errorMessage = error.error.message;
               console.error('Fehler beim Laden der Anfragen', error);
             }
           );
         },
         (err) => {
           this.errorMessage = err.error.message;
           console.log(err);
         }
       );
     },
     (err) => {
       this.errorMessage = err.error.message;
       console.log(err);
     }
   );
 }



  onPressClose(){
    this.closeRequest.emit();
  }
}
