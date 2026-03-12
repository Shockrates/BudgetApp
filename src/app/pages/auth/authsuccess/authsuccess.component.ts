import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthSuccessConfig } from '../../../interfaces/ui-config/auth-success-config';

@Component({
  selector: 'app-authsuccess',
  imports: [],
  templateUrl: './authsuccess.component.html',
  styleUrl: './authsuccess.component.css'
})
export class AuthSuccessComponent implements OnInit {

   @Input() config!: AuthSuccessConfig;

   public successMessage:string  = "";

   ngOnInit(): void {
    this.successMessage = this.config.message;
  }

}
