import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Projektgruppe2';
  isRegisterRoute: boolean = false;
  isPRRoute: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRegisterRoute = this.route.snapshot.firstChild?.routeConfig?.path === ('register');
        this.isPRRoute = this.route.snapshot.firstChild?.routeConfig?.path === ( 'ResetPassword' );
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.userService.getCurrentUser() !== 'Nicht angemeldet';
  }

  get currentUser(): string {
    return this.userService.getCurrentUser();
  }
}
