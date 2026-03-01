import { Component, inject, OnInit } from '@angular/core';
import { BudgetCardConfig } from '../../interfaces/ui-config/budget-card-config.interface';
import { ExpenseTableDataConfig } from '../../interfaces/ui-config/expense-table-config.interface';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith, switchMap, tap } from 'rxjs';
import { BudgetService } from '../../services/budget.service';
import { BudgetCardComponent } from '../../components/budget-card/budget-card.component';
import { FormWrapperComponent } from "../../components/form-wrapper/form-wrapper.component";
import { Expense } from '../../interfaces/models/expense.interface';
import { v4 as uuidv4 } from 'uuid';
import { ExpenseTableComponent } from '../../components/expense-table/expense-table.component';
import { UiService } from '../../services/ui.service';


@Component({
  selector: 'app-budget-details',
  imports: [ReactiveFormsModule, BudgetCardComponent, FormWrapperComponent, ExpenseTableComponent],
  templateUrl: './budget-details.component.html',
  styleUrl: './budget-details.component.css'
})
export class BudgetDetailsComponent implements OnInit {

  budgetCard!: BudgetCardConfig;
  expenseTableData: ExpenseTableDataConfig[] = [];
  budgetId: string = '';

  router = inject(Router);
  expenseService = inject(ExpenseService);
  budgetService = inject(BudgetService);
  activatedRoute = inject(ActivatedRoute);
  uiService = inject(UiService);

  expenseForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    amount: new FormControl(null, [Validators.required]),

  })

  ngOnInit(): void {

    this.activatedRoute.params.pipe(
      map((params: Params) => params['id']),
      tap((id: string) => {
        this.budgetId = id;
        this.initializeData()
      }),
      switchMap(() => this.expenseService.getExpenseData().pipe(
        startWith(null)
      )),
      map(() => {
        const expenses = this.expenseService.getExpensesByBudgetId(this.budgetId);
        return this.expenseService.buildExpenseTable(expenses);
      })
    ).subscribe((tableData: ExpenseTableDataConfig[]) => {
      this.expenseTableData = tableData;
    });


  }


  addExpense() {
    const category = this.budgetService.getBudgetCategoryById(this.budgetId);
    const expense: Expense = {
      id: uuidv4(),
      name: this.expenseForm.value.name,
      budgetCategory: category,
      amount: parseInt(this.expenseForm.value.amount),
      date: new Date()
    }

    this.expenseService.addExpense(expense);
    this.expenseForm.reset();

    this.initializeData();
  }

  initializeData() {
    const budget = this.budgetService.getBudgetById(this.budgetId);

    this.budgetCard = {
      name: budget.name,
      budget: budget.budget,
      spent: budget.spent,
      color: budget.color,
      onClick: () => {
        this.deleteBudget()
      }
    }
  }

  deleteBudget() {
    this.expenseService.deleteExpenseByBudgetId(this.budgetId);
    this.budgetService.deleteBudgetById(this.budgetId);
    this.router.navigateByUrl('');
  }

  handleDelete($event: ExpenseTableDataConfig) {
    this.expenseService.deleteExpenseById($event.id);
    this.initializeData();
  }


}
