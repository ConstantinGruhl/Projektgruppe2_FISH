import { Component, OnInit } from '@angular/core';
import { FriendService } from '../_services/friends.service';
import { UserService } from '../_services/user.service';
import { ProfileService } from '../_services/profile.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {
  searchResults: any[] = [];
  friends: any[] = [];
  areThereFriends: boolean = false;
  noFriendsError: string = '';

  constructor(
    private friendService: FriendService,
    private userService: UserService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const currentUserId = this.userService.getCurrentID();
    this.getFriends(currentUserId);
  }

  getFriends(userId: number): void {
    this.friendService.getFriendList(userId).subscribe(
      response => {
        this.areThereFriends = true;
        this.friends = response.friends;
      },
      error => {
        if (error.status === 404 && error.error.message === 'No friends found for this user') {
          this.noFriendsError = 'Du hast noch keine Freunde. Bitte füge welche hinzu!';
        }
      }
    );
  }

  removeFriend(friendId: number): void {
    const currentUserId = this.userService.getCurrentID();

    this.friendService.deleteFriend(currentUserId, friendId).subscribe(
      response => {
        this.friends = this.friends.filter(friend => friend.idProfile !== friendId);
      },
      error => {
        console.error(error);
      }
    );
  }

  onSearch(value: string): void {
    this.searchResults = [];
    const searchPattern = new RegExp(value, 'i');

    this.profileService.listUsers().subscribe(
      response => {
        for (let user of response) {
          if (!this.isFriend(user.idProfile) && user.idProfile !== this.userService.getCurrentID()) {
            if (searchPattern.test(user.Name)) {
              this.searchResults.push(user);
            }
          }
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  addToFriends(user: any): void {
    const currentUserId = this.userService.getCurrentID();

    this.friendService.addFriend(currentUserId, user.idProfile).subscribe(
      response => {
        this.searchResults = this.searchResults.filter(u => u.idProfile !== user.idProfile);
        this.getFriends(currentUserId);
      },
      error => {
        console.error(error);
      }
    );
  }

  isFriend(userId: number): boolean {
    return this.friends.some(friend => friend.idProfile === userId);
  }
}
