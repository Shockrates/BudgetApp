import { Component, inject, OnInit, signal } from '@angular/core';
import { HouseholdLayoutComponent } from "../household-layout/household-layout.component";
import { HouseholdService } from '../../../services/household.service';
import { Household } from '../../../interfaces/models/household.interface';
import { HouseholdTableCardComponent } from '../household-table-item/household-table-item.component';
import { HouseholdItemConfig } from '../../../interfaces/ui-config/household-item-config.interface';
import { Router } from '@angular/router';

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
  selectedHouseholdId = signal<string | null>(null);
  router = inject(Router);


  ngOnInit(): void {
    this.householdService.households$.subscribe({
      next: (res: Household[]) => {
        this.households = res;
        this.buildHouseholdItems(this.households);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
    const active = this.householdService.getActiveHousehold();
    if (active) {
      this.selectedHouseholdId.set(active.id)


    }
  }

  onSelectItem(id: string) {
    if (this.selectedHouseholdId() === id) {
      this.selectedHouseholdId.set(null);
    } else {
      this.selectedHouseholdId.set(id);
    }
  }

  handleSelect() {
    const selectedHousehold = this.households.find(household => household.id === this.selectedHouseholdId())
    if (selectedHousehold) {
      this.householdService.setActiveHousehold(selectedHousehold);
      this.router.navigateByUrl('');
    }

  }

  buildHouseholdItems(households: Household[]) {
    this.householdItems = households.map((item: Household) => {
      return {
        id: item.id,
        name: item.name,
        membersCount: item.membersCount,
      }
    })
  }


}
