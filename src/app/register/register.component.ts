import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public errorMessage: string = "";

  constructor(private accountService: AccountService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  registerUser(): void {
    const firstname = (document.getElementById('firstname') as HTMLInputElement).value;
    const lastname = (document.getElementById('lastname') as HTMLInputElement).value;
    const accountname = (document.getElementById('accountname') as HTMLInputElement).value;
    const profilename = (document.getElementById('profilename') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      this.errorMessage = "Die Passwörter stimmen nicht überein";
            return;
    }

    this.accountService.register(firstname, lastname, accountname, profilename, password, email).subscribe(
      response => {
        this.userService.setCurrentUser(response.user.Name, response.user.idProfile);
        this.errorMessage = "";
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
    this.router.navigateByUrl("/");
  }
}
