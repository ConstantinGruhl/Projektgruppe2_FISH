import { Component, OnInit,Input } from '@angular/core';
import { PlayRequestComponent } from '../play-request/play-request.component';
import { GroupComponent } from '../group/group.component';
import { NotificationWindowComponent } from '../notification-window/notification-window.component';
import { UserService } from '../_services/user.service';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private userService: UserService, private refreshService: RefreshService) { }
  ngOnInit(): void { }

  get currentUser(): string {
    return this.userService.getCurrentUser();
  }

  logout(): void {
    this.userService.logout();
  }

  displaynotif = false;
  onPressnotif() {
    this.displaynotif = !this.displaynotif;
    this.refreshService.refresh();
  }

  displayreq = false;
  onPressreq() {
    this.displayreq = !this.displayreq;
    this.refreshService.refresh();
  }

  displaygroup = false;
  onPressgroup() {
    this.displaygroup = !this.displaygroup;
    this.refreshService.refresh();
  }

  handleRequestClose() {
    this.onPressreq();
    this.refreshService.refresh();
  }

  handleNotificationClose() {
    this.onPressnotif();
    this.refreshService.refresh();
  }

  handleGroupClose() {
    this.onPressgroup();
    this.refreshService.refresh();
  }
}
