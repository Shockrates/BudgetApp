import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BudgetApp';

  //TO DO: BETTER IMPLEMENT HIDE NAVV BAR ON SUCCESS PAGE
  hideNavbar = false;
  router = inject(Router)

  ngOnInit() {
  this.router.events.subscribe(() => {
    this.hideNavbar = this.router.url.includes('/auth-success');
  });
}
}
