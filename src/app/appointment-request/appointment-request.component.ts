import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-appointment-request',
  templateUrl: './appointment-request.component.html',
  styleUrls: ['./appointment-request.component.css']
})
export class AppointmentRequestComponent {
  @Input() request: any = {};
  @Output() acceptApp: EventEmitter<any> = new EventEmitter<any>();
  @Output() declineApp: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  acceptAppRequest(): void {
    this.acceptApp.emit(this.request);
  }

  declineAppRequest(): void {
    this.declineApp.emit(this.request);
  }
}
