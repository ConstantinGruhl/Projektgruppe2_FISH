import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../_services/requests.service';
import { UserService } from '../_services/user.service';
import { map, forkJoin } from 'rxjs';
import { RefreshService } from '../_services/refresh.service'; // RefreshService importieren

@Component({
  selector: 'app-accepted-requests',
  templateUrl: './accepted-requests.component.html',
  styleUrls: ['./accepted-requests.component.css']
})
export class AcceptedRequestsComponent implements OnInit {
  hasAcceptedRequests: boolean = false;
  public acceptedRequests: any[] = [];

  constructor(private requestsService: RequestsService, private userService: UserService, private refreshService: RefreshService) { } // RefreshService im Konstruktor injizieren

  ngOnInit(): void {
    this.refreshService.refreshSubject.subscribe(() => {
      this.getAcceptedRequests();
    });
    this.getAcceptedRequests();
  }

  getStatusInGerman(status: string): string {
    switch (status) {
      case 'accepted':
        return 'Akzeptiert';
      case 'sent':
        return 'Gesendet';
      case 'denied':
        return 'Abgelehnt';
      default:
        return status;
    }
  }

  addTwoHours(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    let newHours = hours + 2;
    if (newHours >= 24) newHours -= 24;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  getAcceptedRequests(): void {
    const userId = this.userService.getCurrentID();

    this.requestsService.getAcceptedRequests(userId).subscribe(
      (data: any) => {
        const requestObservables = data.data.map((request: any) => {
          const ProposedStartTime = this.addTwoHours(request.ProposedStartTime.substring(11, 16));
          const ProposedEndTime = this.addTwoHours(request.ProposedEndTime.substring(11, 16));

          return this.requestsService.getProfilesForAppointment(request.idAppointmentRequests).pipe(
            map((profileData: any) => {
              return {
                ...request,
                ProposedStartTime,
                ProposedEndTime,
                profiles: profileData.data
              };
            })
          );
        });
        forkJoin(requestObservables).subscribe(
          (requests: any) => {
            this.acceptedRequests = requests;
            this.hasAcceptedRequests = this.acceptedRequests.length > 0;
          },
          (error: any) => {
            console.error(error);
          }
        );
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
