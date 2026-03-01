import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
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

@Component({
  selector: 'app-home',
  imports: [FormWrapperComponent, ReactiveFormsModule, BudgetCardComponent, ExpenseTableComponent, BudgetFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


  private userService = inject(UserService);
  private budgetService = inject(BudgetService);
  private expenseService = inject(ExpenseService);
  private uiService = inject(UiService);
  private router = inject(Router);

  user: string = '';
  budgetCategories: BudgetCategory[] = [];
  budgets: Budget[] = [];
  budgetCards: BudgetCardConfig[] = [];
  expenseTableData: ExpenseTableDataConfig[] = [];

  ngOnInit(): void {
    this.user = this.userService.getUser().name || 'Guest';
    this.budgetCategories = this.budgetService.getBudgetCategories();
    this.budgets = this.budgetService.getBudgets();
    this.buildBudgetCards(this.budgets);
    console.log('Budget Categories Loading:', this.budgets);

    this.budgetService.getBudgetCategoryData().subscribe({
      next: (res: BudgetCategory[]) => {
        this.budgetCategories = res;

      },
      error: (error: any) => {
        console.error(error);

      }
    })
    this.budgetService.getBudgetData().subscribe({
      next: (res: Budget[]) => {
        this.budgets = res;
        this.buildBudgetCards(this.budgets);
        console.log('New Budget Category Added:', this.budgets);
      },
      error: (error: any) => {
        console.error(error);

      }
    })
    const expenses = this.expenseService.getExpenses();
    this.expenseTableData = this.expenseService.buildExpenseTable(expenses);
    this.expenseService.getExpenseData().subscribe({
      next: (res: Expense[]) => {
        this.expenseTableData = this.expenseService.buildExpenseTable(res);
      },
      error: (error: any) => {
        console.error(error)
      }
    })


  }

  budgetForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    budget: new FormControl(null, [Validators.required])
  })

  expenseForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
    budgetCategoryId: new FormControl(null, [Validators.required])
  })

  addBudget() {
    const budget: Budget = {
      id: uuidv4(),
      name: this.budgetForm.value.name,
      budget: parseInt(this.budgetForm.value.budget),
      spent: 0,
      color: this.uiService.generateRandomColor(this.budgets.length + 1)
    }
    this.budgetService.addBudget(budget);
    this.budgetForm.reset();

  }

  addExpense() {
    const category = this.budgetService.getBudgetCategoryById(this.expenseForm.value.budgetCategoryId)
    const expense: Expense = {
      id: uuidv4(),
      name: this.expenseForm.value.name,
      budgetCategory: category,
      amount: parseFloat(this.expenseForm.value.amount),
      date: new Date()
    }
    this.expenseService.addExpense(expense);
    this.expenseForm.reset();
  }

  buildBudgetCards(budgets: Budget[]) {
    this.budgetCards = budgets.map((item: Budget) => {
      return {
        name: item.name,
        budget: item.budget,
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
