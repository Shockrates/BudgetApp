import { Component, inject, OnInit } from '@angular/core';
import { HouseholdLayoutComponent } from "../household-layout/household-layout.component";
import { HouseholdService } from '../../../services/household.service';
import { Household } from '../../../interfaces/models/household.interface';
import { HouseholdTableCardComponent } from '../household-table-item/household-table-item.component';
import { HouseholdItemConfig } from '../../../interfaces/ui-config/household-item-config.interface';

@Component({
  selector: 'app-household-dashboard',
  imports: [HouseholdLayoutComponent, HouseholdTableCardComponent],
  templateUrl: './household-dashboard.component.html',
  styleUrl: './household-dashboard.component.css'
})
export class HouseholdDashboardComponent implements OnInit {



  private householdService = inject(HouseholdService);

  households: Household[] = [];
  householdItems: HouseholdItemConfig[] = [];


  ngOnInit(): void {
    this.householdService.households$.subscribe({
      next: (res: Household[]) => {
        this.households = res;
        this.buildHouseholdItems(this.households);

      },
      error: (error: any) => {
        console.error(error);

      }
    })

  }

  buildHouseholdItems(households: Household[]) {
    this.householdItems = households.map((item: Household) => {
      return {
        id: item.id,
        name: item.name,
        membersCount: item.membersCount,
        isSelected: false
      }
    })
  }
}
