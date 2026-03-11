import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-authsuccess',
  imports: [],
  templateUrl: './authsuccess.component.html',
  styleUrl: './authsuccess.component.css'
})
export class AuthSuccessComponent implements OnInit {

  router = inject(Router);

  ngOnInit(): void {
    timer(3000).subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }

}
