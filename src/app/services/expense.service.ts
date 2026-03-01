import { inject, Injectable } from '@angular/core';
import { BudgetService } from './budget.service';
import { Observable, Subject } from 'rxjs';
import { Expense } from '../interfaces/models/expense.interface';
import { ExpenseTableDataConfig } from '../interfaces/ui-config/expense-table-config.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  EXPENSES: string = 'EXPENSES'
  expenseSubject: Subject<Expense[]> = new Subject();
  budgetService = inject(BudgetService);

  constructor() { }

  getExpenseData(): Observable<Expense[]> {
    return this.expenseSubject;
  }

  getExpenses(): Expense[] {
    return JSON.parse(localStorage.getItem(this.EXPENSES) || '[]') as Expense[];
  }


  getExpensesByBudgetId(budgetId: string): Expense[] {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter((expense: Expense) => expense.budgetCategory.id === budgetId);
    return filteredExpenses;
  }

  addExpense(expense: Expense) {
    try {
      const budget = this.budgetService.getBudgetById(expense.budgetCategory.id);
      const expenses = this.getExpenses();
      expenses.push(expense);
      this.setExpenses(expenses);
      this.updateBudgets(expenses, budget.id);
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  updateBudgets(expenses: Expense[], budgetId: string) {
    const budgetExpenses = expenses.filter((expense) => expense.budgetCategory.id === budgetId);
    const totalExpensesAmount = budgetExpenses.reduce((sum: number, current: Expense) => sum + current.amount, 0);
    this.budgetService.updateBudgetAmount(budgetId, totalExpensesAmount);
  }

  buildExpenseTable(expenses: Expense[]) {
    return expenses.map((item: Expense) => {
      return {
        id: item.id,
        name: item.name,
        amount: item.amount,
        date: item.date,
        budget: item.budgetCategory.name,
        color: item.budgetCategory.color
      }
    }) as ExpenseTableDataConfig[]
  }

  setExpenses(expenses: Expense[]) {
    localStorage.setItem(this.EXPENSES, JSON.stringify(expenses));
    this.expenseSubject.next(expenses);
  }

  deleteExpenseById(expenseId: string) {
    const expenses = this.getExpenses();
    //Need to be a seperate method
    const expense = expenses.filter((expense: Expense) => expense.id === expenseId)[0]
    if (!expense) {
      throw Error('can not delete a expense that does not exist ');
      return;
    }
    const filteredExpenses = expenses.filter((expense: Expense) => expense.id != expenseId);
    this.setExpenses(filteredExpenses);
    this.updateBudgets(filteredExpenses, expense.budgetCategory.id);
  }

  deleteExpenseByBudgetId(budgetId: string) {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter((expense: Expense) => expense.budgetCategory.id != budgetId);
    this.setExpenses(filteredExpenses);
  }

}
