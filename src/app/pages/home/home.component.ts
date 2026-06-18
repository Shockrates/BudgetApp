import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormWrapperComponent } from "../../components/form-wrapper/form-wrapper.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { ExpenseService } from '../../services/expense.service';
import { BudgetCategory } from '../../interfaces/models/budget-category.interface';
import { Budget } from '../../interfaces/models/budget.interface';
import { v4 as uuidv4 } from 'uuid';
import { BudgetCardConfig } from '../../interfaces/ui-config/budget-card-config.interface';
import { Router } from '@angular/router';
import { BudgetCardComponent } from "../../components/budget-card/budget-card.component";
import { UiService } from '../../services/ui.service';
import { Expense } from '../../interfaces/models/expense.interface';
import { ExpenseTableDataConfig } from '../../interfaces/ui-config/expense-table-config.interface';
import { ExpenseTableComponent } from '../../components/expense-table/expense-table.component';
import { BudgetFormComponent } from '../../components/budget-form/budget-form.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/models/user.interface';
import { HouseholdService } from '../../services/household.service';
import { Household } from '../../interfaces/models/household.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { formatDate } from '../../shared/helper/date.utils';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormWrapperComponent, ReactiveFormsModule, BudgetCardComponent, ExpenseTableComponent, BudgetFormComponent, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {



  private budgetService = inject(BudgetService);
  private expenseService = inject(ExpenseService);
  private authService = inject(AuthService);
  private householdService = inject(HouseholdService)
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  user!: User | null;
  activeHousehold!: Household | null;
  budgetCategories: BudgetCategory[] = [];
  budgets$ = this.budgetService.budgets$;

  budgetCards: BudgetCardConfig[] = [];
  expenseTableData: ExpenseTableDataConfig[] = [];

  //NEW EXPENSES CODE

  expenses$ = this.expenseService.expenses$;
  //loading$ = this.expenseService.loading$;
  //error$ = this.expenseService.error$;

  //NEW EXPENSES CODE

  ngOnInit(): void {



    this.user = this.authService.getCurrentUser();
    console.log('Current user:', this.user);

    this.activeHousehold = this.householdService.getActiveHousehold()
    console.log('Active household:', this.activeHousehold);

    this.budgetCategories = this.budgetService.getBudgetCategories();
    //this.budgets = this.budgetService.getBudgets();
    //this.buildBudgetCards(this.budgets);

    //NEW EXPENSES CODE
    if (!this.activeHousehold) {
      console.warn('No active household selected');
      return;
    }

    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 3);

    const loadParams = {
      householdId: this.activeHousehold.id,
      startDate: formatDate(lastMonth),
      endDate: formatDate(today),
      page: 0,
      size: 20
    };
    console.log('Loading expenses with params:', loadParams);
    this.expenseService.loadExpenses(loadParams);
    //NEW EXPENSES CODE


    this.budgetService.budgetCategories$.subscribe({
      next: (res: BudgetCategory[]) => {
        this.budgetCategories = res;

      },
      error: (error: any) => {
        console.error(error);

      }
    })

    this.budgetService.loadBudgets();
    this.budgetService.budgets$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: Budget[]) => {
          this.buildBudgetCards(res);
          console.log('New Budget Category Added:', res);
        },
        error: (error: any) => {
          console.error(error);

        }
      })
    const expenses = this.expenseService.getExpenses();
    this.expenseTableData = this.expenseService.buildExpenseTable(expenses);
    this.expenseService.getExpenseData().subscribe({
      next: (res: Expense[]) => {
        console.log('Expenses subscription received:', res);
        this.expenseTableData = this.expenseService.buildExpenseTable(res);
      },
      error: (error: any) => {
        console.error('Error in expenses subscription:', error)
      }
    })


  }


  expenseForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
    budgetCategoryId: new FormControl(null, [Validators.required])
  })



  addExpense() {
    const category = this.budgetService.getBudgetCategoryById(this.expenseForm.value.budgetCategoryId)
    const expense: Expense = {
      id: Math.floor(Math.random() * 1000000),
      expenseDescription: this.expenseForm.value.name,
      categorySummary: category,
      expenseAmount: parseFloat(this.expenseForm.value.amount),
      expenseDate: new Date()
    }
    this.expenseService.addExpense(expense);
    this.expenseForm.reset();
  }

  buildBudgetCards(budgets: Budget[]) {
    this.budgetCards = budgets.map((item: Budget) => {
      return {
        name: item.name,
        budget: item.budgetLimit,
        spent: item.spent,
        color: item.color,
        onClick: () => {
          this.router.navigateByUrl(`details/${item.id}`);
        }
      }
    })
  }

  handleDelete(expenseData: ExpenseTableDataConfig) {
    this.expenseService.deleteExpenseById(expenseData.id);

  }

}
