import { Component, Input, output } from '@angular/core';
import { Household } from '../../../interfaces/models/household.interface';
import { CommonModule } from '@angular/common';
import { HouseholdItemConfig } from '../../../interfaces/ui-config/household-item-config.interface';


@Component({
  selector: 'app-household-table-item',
  imports: [CommonModule],
  templateUrl: './household-table-item.component.html',
  styleUrl: './household-table-item.component.css'
})
export class HouseholdTableCardComponent {

  @Input() household!: HouseholdItemConfig;

  isSelected = output();

  ngOnInit(): void {
    if (!this.household) {
      return;
    }
  }

  handleOnSelect(): void {
    this.isSelected.emit();
  }
}
