import { Component, inject, OnInit } from '@angular/core';
import { HouseholdLayoutComponent } from "../household-layout/household-layout.component";
import { HouseholdService } from '../../../services/household.service';
import { Household } from '../../../interfaces/models/household.interface';
import { HouseholdTableCardComponent } from '../household-table-card/household-table-card.component';

@Component({
  selector: 'app-household-dashboard',
  imports: [HouseholdLayoutComponent, HouseholdTableCardComponent],
  templateUrl: './household-dashboard.component.html',
  styleUrl: './household-dashboard.component.css'
})
export class HouseholdDashboardComponent implements OnInit {



  private householdService = inject(HouseholdService);

  households: Household[] = [];


  ngOnInit(): void {
    this.householdService.households$.subscribe({
      next: (res: Household[]) => {
        this.households = res;

      },
      error: (error: any) => {
        console.error(error);

      }
    })

  }
}
