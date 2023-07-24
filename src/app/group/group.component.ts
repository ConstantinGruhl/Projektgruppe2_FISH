import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GroupDropdownComponent} from '../group-dropdown/group-dropdown.component';
import { FriendService } from '../_services/friends.service';
import { UserService } from '../_services/user.service';
import { ProfileService } from '../_services/profile.service';
import { GroupService } from '../_services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  selectedGroupID: number= 0;
  players: any [] = [];
  searchPlayerResults: any[] = [];
  group: any[] = [];
  addPlayerMode = false;

  @Output() closeGroup = new EventEmitter<void>();

  constructor(private friendService: FriendService,
              private userService: UserService,
              private groupService: GroupService,
              private profileService: ProfileService) { }

  ngOnInit(): void {
  }
  handleSelectedGroupID(id: number): void {
    this.selectedGroupID = id;

    this.groupService.getProfilesInGroup(id).subscribe(
      (response: any[]) => {
        this.players = response.map(player => player.Name);
        this.group = response;
      },
      error => {
        console.error(error);
      }
    );
  }

  deleteGroup(): void {
    if(this.selectedGroupID !== 0) {
      this.groupService.deleteGroup(this.selectedGroupID.toString()).subscribe(
        response => {
          this.selectedGroupID = 0;
          this.players = [];
          this.group = [];
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  onPressClose(){
    this.closeGroup.emit();
  }

  createNewGroup() {
  }

  removePlayer(index: number): void {
    const playerToRemove = this.group[index];

    this.groupService.deleteUser(playerToRemove.idProfile, this.selectedGroupID).subscribe(
      response => {
        this.players.splice(index, 1);
      },
      error => {
        console.error(error);
      }
    );
  }


  switchAddPlayerMode(){
    this.addPlayerMode = !this.addPlayerMode;
  }

  onSearchPlayer(value: string): void {
    this.searchPlayerResults = [];
    const searchPattern = new RegExp(value, 'i');
    const groupProfileIds = this.group.map(profile => profile.idProfile);

    const userId = this.userService.getCurrentID();

    this.friendService.getFriendList(userId).subscribe(
      response => {
        for (let friend of response.friends) {
          if (searchPattern.test(friend.Name) && !groupProfileIds.includes(friend.idProfile)) {
            this.searchPlayerResults.push(friend);
          }
        }
      },
      error => {
        console.error(error);
      }
    );
  }


  addPlayerToGroup(user: any): void {
    const profilesToAdd = [{ idProfile: user.idProfile, idGroup: this.selectedGroupID }];
    this.groupService.addProfilesToGroup(profilesToAdd).subscribe(
      response => {
        this.players.push(user.Name);
        this.group.push(user);

        this.searchPlayerResults = this.searchPlayerResults.filter(player => player.idProfile !== user.idProfile);
      },
      error => {
        console.error(error);
      }
    );
  }
}
