import { Component, OnInit } from '@angular/core';
import { FriendService } from '../_services/friends.service';
import { UserService } from '../_services/user.service';
import { RefreshService } from '../_services/refresh.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-friendslist',
  templateUrl: './friendslist.component.html',
  styleUrls: ['./friendslist.component.css']
})
export class FriendslistComponent implements OnInit {
  friends: any[] = [];
  areThereFriends:boolean = false;
  private ngUnsubscribe = new Subject();

  constructor(private friendService: FriendService, private userService: UserService,private refreshService: RefreshService ) { }

  ngOnInit(): void {
    // Hole die UserID aus dem UserService
    const userId = this.userService.getCurrentID();
    this.getFriendList(userId);
    this.refreshService.refreshSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.getFriendList(userId);
    });
  }

ngOnDestroy() {
  this.ngUnsubscribe.complete();
}

  getFriendList(userId: number): void {
    if (userId !== 0) {
      this.friendService.getFriendList(userId).subscribe(
        response => {
          this.areThereFriends = true;
          this.friends = response.friends;
        }
      );
    }
  }
}
