import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FriendService } from '../_services/friends.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css']
})
export class FriendRequestComponent {
  @Input() user: any = "";
  @Output() accept: EventEmitter<string> = new EventEmitter<string>();
  @Output() decline: EventEmitter<string> = new EventEmitter<string>();



  friendRequests: any;
  message!: string;

  constructor(private friendService: FriendService, private userService: UserService) { }

  acceptRequest(user: any): void {
    this.accept.emit(user);
  }




  declineRequest(user: string): void {
    this.decline.emit(user);
}
}
