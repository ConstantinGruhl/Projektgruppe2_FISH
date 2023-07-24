import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { GroupService } from '../_services/group.service';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FriendService } from '../_services/friends.service';
import { UserService } from '../_services/user.service';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  hasUserWithPlaytime: boolean = false;
  selectedGroupID = new BehaviorSubject<number>(0);
  wasRendered = true;
  data: string[][] = [];
  people: (boolean | string)[][] = [];

  constructor(
    private groupService: GroupService,
    private friendService: FriendService,
    private userService: UserService,
    private refreshService: RefreshService
  ) {
    this.selectedGroupID.pipe(
      tap(() => {
        this.generateArr();
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.refreshService.refreshSubject.subscribe(() => {
      this.generateArr();
    });
    this.generateArr();
  }

  onPressClose() {
    this.close.emit();
  }

  handleSelectedGroupID(id: number): void {
    this.selectedGroupID.next(id);
  }

generateArr() {
  if (this.selectedGroupID.value === 0) {
    this.friendService.getFriendsWithPlaytime(this.userService.getCurrentID()).subscribe(
      (users: any[]) => {
        this.hasUserWithPlaytime = true;
        this.processUsers(users);
      },
      error => {
        this.hasUserWithPlaytime = false;
        console.error(error);
      }
    );
  } else {
    this.groupService.usersWithPlayTime(this.selectedGroupID.value).subscribe(
      (users: any[]) => {
        this.hasUserWithPlaytime = true;
        this.processUsers(users);
      },
      error => {
        this.hasUserWithPlaytime = false;
        console.error(error);
      }
    );
  }
}

processUsers(users: any[]) {
  this.data = users.map(user => {
      const startPlayTime = new Date(user.PlayTime_Start);
      const start = startPlayTime.getHours() + ':' + startPlayTime.getMinutes().toString().padStart(2, '0');
      const endPlayTime = new Date(user.PlayTime_End);
      const end = endPlayTime.getHours() + ':' + endPlayTime.getMinutes().toString().padStart(2, '0');
      return [user.Name, start, end];
  });

  this.processTimeSlots();
}

processTimeSlots() {
  const peopletest: (boolean | string)[][] = [];

  this.data.forEach(userData => {
    const userName = userData[0];
    const userTimes = userData.slice(1);

    const userTimeSlots = Array(48).fill(false);

    for (let j = 0; j < userTimes.length; j += 2) {

      const startTimeMinutes = this.getTimeInMinutes(userTimes[j]);
      const endTimeMinutes = this.getTimeInMinutes(userTimes[j + 1]) + 30;
      const startIndex = (startTimeMinutes - 480) / 30;
      const endIndex = (endTimeMinutes - 480) / 30;

      // mark the time slots as true
      for (let k = startIndex; k < endIndex; k++) {
        userTimeSlots[k >= 0 ? k : k + 48] = true;    }
    }

    peopletest.push([userName, ...userTimeSlots]);
  });

  this.people = peopletest;
}

getTimeInMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

shouldHighlight(user: any[], index: number): boolean {
  return user[index];
}

allUsersAvailableAt(index: number): boolean {
  return this.people.every((user: any[]) => user[index + 1] === true);
}
}
