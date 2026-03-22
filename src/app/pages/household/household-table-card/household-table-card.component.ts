import { Component, Input } from '@angular/core';
import { Household } from '../../../interfaces/models/household.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-household-table-card',
  imports: [CommonModule],
  templateUrl: './household-table-card.component.html',
  styleUrl: './household-table-card.component.css'
})
export class HouseholdTableCardComponent {

  @Input() household!: Household

  isSelected: boolean = false;

  ngOnInit(): void {
    if (!this.household) {
      return;
    }
  }

  handleOnSelect(): void {
    if (!this.isSelected) {
      this.isSelected = true;
    } else {
      this.isSelected = false;
    }
  }
}
