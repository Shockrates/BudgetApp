import { inject, Injectable } from '@angular/core';
import { BudgetService } from './budget.service';
import { BehaviorSubject, catchError, EMPTY, Observable, Subject, tap } from 'rxjs';
import { Expense } from '../interfaces/models/expense.interface';
import { ExpenseTableDataConfig } from '../interfaces/ui-config/expense-table-config.interface';
import { HttpClient } from '@angular/common/http';
import { ExpensePageConfig } from '../interfaces/ui-config/expense-page-config.interface';
import { PaginationMetaConfig } from '../interfaces/ui-config/pagination-meta-config.interface';
import { ExpenseResponse, ExpenseDTO } from '../interfaces/api/expenseResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  EXPENSES: string = 'EXPENSES';
  private readonly EXPENSE_URL = 'api/expenses';

  //expenseSubject: Subject<Expense[]> = new Subject();
  private expenseSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expenseSubject.asObservable();

  private paginationSubject = new BehaviorSubject<PaginationMetaConfig | null>(null);
  paginatio$ = this.paginationSubject.asObservable();

  private budgetService = inject(BudgetService);
  private http = inject(HttpClient);

  private lastKey: string | null = null;
  private lastValue: ExpenseResponse | null = null;

  constructor() { }

  loadExpenses(params: {
    householdId: number;
    startDate: string;
    endDate: string;
    page: number;
    size: number;
  }): void {

    const key = this.buildKey(params);

    // Return cached result if same query
    if (this.lastKey === key && this.lastValue) {
      // Map cached DTO to Expense model
      const mappedExpenses = this.mapDtoToExpense(this.lastValue.data.content);
      this.expenseSubject.next(mappedExpenses);
      this.paginationSubject.next(this.lastValue.data.meta);
      return;
    }

    //this.loadingSubject.next(true);

    console.log('Fetching expenses from API with params:', params);

    // Build query params without householdId (already in URL path)
    const queryParams = {
      startDate: params.startDate,
      endDate: params.endDate,
      page: params.page,
      size: params.size
    };

    this.http.get<ExpenseResponse>(`${this.EXPENSE_URL}/household/${params.householdId}`, { params: queryParams }).pipe(
      tap(res => {
        console.log('API response received:', res);
        // Map API DTO to Expense model
        const mappedExpenses = this.mapDtoToExpense(res.data.content);
        console.log('Mapped expenses:', mappedExpenses);
        this.expenseSubject.next(mappedExpenses);
        this.paginationSubject.next(res.data.meta);

        // store last query only
        this.lastKey = key;
        this.lastValue = res;

        //this.errorSubject.next(null);
      }),
      catchError(err => {
        console.error('Failed to load expenses', err);
        //this.errorSubject.next(err);
        return EMPTY;
      }),
      //finalize(() => this.loadingSubject.next(false))
    ).subscribe();


  }

  getExpenseData(): Observable<Expense[]> {
    return this.expenseSubject;
  }

  getExpenses(): Expense[] {
    return JSON.parse(localStorage.getItem(this.EXPENSES) || '[]') as Expense[];
  }


  getExpensesByBudgetId(budgetId: number): Expense[] {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter((expense: Expense) => expense.categorySummary.id === budgetId);
    return filteredExpenses;
  }

  addExpense(expense: Expense) {
    try {
      const budget = this.budgetService.getBudgetById(expense.categorySummary.id);
      const expenses = this.getExpenses();
      expenses.push(expense);
      this.setExpenses(expenses);
      this.updateBudgets(expenses, budget.id);
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  updateBudgets(expenses: Expense[], budgetId: number) {
    const budgetExpenses = expenses.filter((expense) => expense.categorySummary.id === budgetId);
    const totalExpensesAmount = budgetExpenses.reduce((sum: number, current: Expense) => sum + current.expenseAmount, 0);
    this.budgetService.updateBudgetAmount(budgetId, totalExpensesAmount);
  }

  buildExpenseTable(expenses: Expense[]) {
    return expenses.map((item: Expense) => {
      return {
        id: item.id,
        name: item.expenseDescription,
        amount: item.expenseAmount,
        date: item.expenseDate,
        budget: item.categorySummary.categoryName,
        color: item.categorySummary.color
      }
    }) as ExpenseTableDataConfig[]
  }

  setExpenses(expenses: Expense[]) {
    localStorage.setItem(this.EXPENSES, JSON.stringify(expenses));
    this.expenseSubject.next(expenses);
  }

  deleteExpenseById(expenseId: number) {
    const expenses = this.getExpenses();
    //Need to be a seperate method
    const expense = expenses.filter((expense: Expense) => expense.id === expenseId)[0]
    if (!expense) {
      throw Error('can not delete a expense that does not exist ');
      return;
    }
    const filteredExpenses = expenses.filter((expense: Expense) => expense.id != expenseId);
    this.setExpenses(filteredExpenses);
    this.updateBudgets(filteredExpenses, expense.categorySummary.id);
  }

  deleteExpenseByBudgetId(budgetId: number) {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter((expense: Expense) => expense.categorySummary.id != budgetId);
    this.setExpenses(filteredExpenses);
  }

  // HELPER METHODS
  private buildKey(params: any): string {
    return JSON.stringify(params);
  }

  // Maps API DTO to domain Expense model
  private mapDtoToExpense(dtos: ExpenseDTO[]): Expense[] {
    return dtos.map(dto => ({
      id: dto.expenseId,
      expenseDescription: dto.expenseDescription,
      expenseAmount: dto.expenseAmount,
      expenseDate: new Date(dto.expenseDate),
      categorySummary: {
        id: dto.categorySummary.categoryId, // Map categoryId → id
        categoryName: dto.categorySummary.categoryName,
        color: dto.categorySummary.color
      }
    }));
  }

}
