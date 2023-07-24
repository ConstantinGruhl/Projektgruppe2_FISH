import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public errorMessage: string = "";

  constructor(
    private accountService: AccountService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

loginUser(): void {
  const userName = (document.getElementById('form2Example17') as HTMLInputElement).value;
  const password = (document.getElementById('form2Example27') as HTMLInputElement).value;

  this.accountService.login(userName, password).subscribe(
    response => {
      this.userService.setCurrentUser(response.user.Name, response.user.idProfile);
      this.errorMessage = "";
    },
    error => {
      this.errorMessage = error.error.message;
    }
  );
}
}
