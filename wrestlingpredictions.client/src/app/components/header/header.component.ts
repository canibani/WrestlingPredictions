import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    //// Reactive update
    //this.authService.loggedIn$.subscribe(value => {
    //  this.loggedIn = value;
    //});

    // Optional: handle page refresh
    this.loggedIn = this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }
}
