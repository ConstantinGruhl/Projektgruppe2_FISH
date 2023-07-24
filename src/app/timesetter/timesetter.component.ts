import { Component, OnInit } from '@angular/core';
import { PlaytimeService } from '../_services/playtime.service';
import { CalenderComponent } from '../calender/calender.component'
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-timesetter',
  templateUrl: './timesetter.component.html',
  styleUrls: ['./timesetter.component.css']
})
export class TimesetterComponent implements OnInit {
  isTimeSet = false;
  public timeOn: string = '';
  public timeOff: string = '';

  displayfalse = true;
  display = false;
  public errorMessage: string = '';

  public get isTheTimeSet(){
    return this.isTimeSet;
  }

  constructor(private playtimeService: PlaytimeService, private userService: UserService) { }

  ngOnInit(): void {
    this.checkIfTimeSet();
  }

  checkIfTimeSet(): void {
      const idProfile = this.userService.getCurrentID();

      this.playtimeService.getPlaytime(idProfile).subscribe(
        response => {
          if (response && response.playtimes && response.playtimes.length > 0) {
            this.isTimeSet = true;
            this.display = true;
            this.displayfalse = false;
          } else {
            this.isTimeSet = false;
            this.display = false;
            this.displayfalse = true;
          }
        },
        error => {
          console.error(error);
          this.errorMessage = error.error.message;
        });
    }

  timeStringToDate(time: string): string{
    let now: Date = new Date();
    let date: string = now.getUTCFullYear() + '-' +
        ('0' + (now.getUTCMonth() + 1)).slice(-2) + '-' +
        ('0' + now.getUTCDate()).slice(-2) + ' ' +
        time + ':00';

    return date;
  }

  handleClose() {
    this.display = !this.display;
    this.displayfalse = !this.displayfalse;
  }

  saveOnTime(time: string) {
    this.timeOn = time;
  }

  saveOffTime(time: string){
    this.timeOff = time;
  }

  onPressCalender(){
    this.display = !this.display;
    this.displayfalse = !this.displayfalse;
  }

  onPress() {
    this.errorMessage = '';

    const idProfile = this.userService.getCurrentID();
    const playTimeStart = this.timeStringToDate(this.timeOn);
    const playTimeEnd = this.timeStringToDate(this.timeOff);

    this.playtimeService.createPlaytime(idProfile, playTimeStart, playTimeEnd)
      .subscribe(
        response => {
          this.display = !this.display;
          this.displayfalse = !this.displayfalse;
        },
        error => {
          console.error(error);
          this.errorMessage = error.error.message;
        });
  }
}
