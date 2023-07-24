import { Component, OnInit } from '@angular/core';
import { FriendService } from '../_services/friends.service';
import { UserService } from '../_services/user.service';
import { ProfileService } from '../_services/profile.service';
import { GroupService } from '../_services/group.service';

interface Group {
  name: string;
  members: any[];
  isExpanded: boolean;
}

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  searchResults: any[] = [];
  groupMembers: any[] = [];
  groups: Group[] = [];
  areThereFriends: boolean = false;
  errorMessage: string = '';

  constructor(
    private friendService: FriendService,
    private userService: UserService,
    private profileService: ProfileService,
    private groupService: GroupService
  ) { }

  ngOnInit(): void {

  }

  onSearch(value: string): void {
    this.searchResults = [];
    const searchPattern = new RegExp(value, 'i');
    const userId = this.userService.getCurrentID();

    this.friendService.getFriendList(userId).subscribe(
      response => {
        this.areThereFriends = true;
        this.searchResults = response.friends.filter((friend: {Name: string}) => searchPattern.test(friend.Name));
      },
      error => {
        console.error(error);
      }
    );
  }

  addToGroup(user: any): void {
    if (!this.groupMembers.includes(user)) {
      this.groupMembers.push(user);
    }
    this.searchResults = this.searchResults.filter(result => result.idProfile !== user.idProfile);
  }

  createGroup(groupName: string): void {
    if (!groupName || groupName.trim() === '') {
      this.errorMessage = 'Gruppenname darf nicht leer sein';
      return;
    }

    const currentUser = this.userService.getCurrentID();
    this.groupMembers.push({ idProfile: currentUser });

    this.groupService.createGroup({ name: groupName }).subscribe(
      response => {
        const groupId = response.idGroup;
        const profilesToAdd = this.groupMembers.map(member => ({ idProfile: member.idProfile, idGroup: groupId }));

        this.groupService.addProfilesToGroup(profilesToAdd).subscribe(
          response => {
            this.groups.push({name: groupName, members: [...this.groupMembers], isExpanded: false});
            this.groupMembers = [];
            this.errorMessage = '';
          },
          error => {
            console.error(error);
            this.errorMessage = 'Ein Fehler ist aufgetreten beim Hinzufügen von Profilen zur Gruppe';
          }
        );
      },
      error => {
        console.error(error);
        this.errorMessage = 'Ein Fehler ist aufgetreten beim Erstellen der Gruppe';
      }
    );
  }

}
