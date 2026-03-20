import { Component, Input } from '@angular/core';
import { Household } from '../../../interfaces/models/household.interface';

@Component({
  selector: 'app-household-table-card',
  imports: [],
  templateUrl: './household-table-card.component.html',
  styleUrl: './household-table-card.component.css'
})
export class HouseholdTableCardComponent {

  @Input() household!: Household 

   ngOnInit(): void {
    if (!this.household) {
      return;
    }
  }
}
