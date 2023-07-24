import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GroupService } from '../_services/group.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-group-dropdown',
  templateUrl: './group-dropdown.component.html',
  styleUrls: ['./group-dropdown.component.css']
})
export class GroupDropdownComponent implements OnInit {
  groups: any[] = [];
  selected: string = '0';
  groupID: number = 0;
  areThereGroups: boolean = false;

  @Output() selectedGroupID = new EventEmitter<number>();

  constructor(private groupService: GroupService , private userService: UserService) { }

  ngOnInit(): void {
    this.selectedGroupID.emit(this.groupID);
    this.refreshGroups();
  }

  refreshGroups(): void {
    const userId = this.userService.getCurrentID();

    this.groupService.getGroupsForUser(userId).subscribe(
      response => {
        this.areThereGroups = true;
        this.groups = response;
      },
      error => {
        console.error(error);
      }
    );
  }

  getSelectedGroupName(): string {
    const group = this.groups.find(g => g.idGroup == this.selected);
    return group ? group.Name : 'default';
  }

  update(e: any): void {
    this.selected = e.target.value;
    this.groupID = this.selected === 'default' ? 0 : Number(this.selected);
    this.selectedGroupID.emit(this.groupID);
  }
}

