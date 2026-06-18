import { Component, inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Budget } from '../../interfaces/models/budget.interface';
import { v4 as uuidv4 } from 'uuid';
import { UiService } from '../../services/ui.service';
import { BudgetService } from '../../services/budget.service';
import { BudgetCreate } from '../../interfaces/api/budgetCreate.interface';
import { HouseholdService } from '../../services/household.service';
import { BudgetCardConfig } from '../../interfaces/ui-config/budget-card-config.interface';

@Component({
  selector: 'app-budget-form',
  imports: [ReactiveFormsModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css'
})
export class BudgetFormComponent {

  private uiService = inject(UiService);
  private householdService = inject(HouseholdService);
  private budgetService = inject(BudgetService);

  @Input() config!: BudgetCardConfig;

  budgetForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    budget: new FormControl(null, [Validators.required])
  })

  ngOnChanges() {
  if (this.config) {
    this.budgetForm.patchValue({
      name: this.config.name,
      budget: this.config.budget
    });
  }
}

  addBudget() {
    const budgetCount = this.budgetService.getBudgetsCount();
    const budget: BudgetCreate = {
      categoryName: this.budgetForm.value.name,
      budgetLimit: parseInt(this.budgetForm.value.budget),
      householdId: this.householdService.getActiveHouseholdOrThorw().id,
      color: this.uiService.generateRandomColor(budgetCount + 1)
    }
    this.budgetService.addBudget(budget).subscribe({
    next: () => {
      this.budgetForm.reset(); 
    },
    error: (err) => {
      console.error('Create failed', err);
    }
  });
    

  }
}
