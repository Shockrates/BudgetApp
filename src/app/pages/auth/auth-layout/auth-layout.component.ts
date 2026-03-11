import { Component, inject } from '@angular/core';
import { AuthLayoutStateService } from '../../../services/state/auth-layout-state.service';

@Component({
  selector: 'app-auth-layout',
  imports: [],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {


  public layoutState = inject(AuthLayoutStateService);




}
