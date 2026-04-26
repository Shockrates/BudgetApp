import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, BehaviorSubject, tap, EMPTY, distinctUntilChanged } from 'rxjs';
import { Budget } from '../interfaces/models/budget.interface';
import { BudgetCategory } from '../interfaces/models/budget-category.interface';
import { HttpClient } from '@angular/common/http';
import { BudgetResponse } from '../interfaces/api/budget-response';
import { HouseholdService } from './household.service';
import { BudgetCreate } from '../interfaces/api/budgetCreate.interface';
import { BudgetListResponse } from '../interfaces/api/budgetListResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  public BUDGETS: string = 'BUDGETS';
  public BUDGET_CATEGORIES = 'BUDGET_CATEGORIES';
  private readonly BUDGET_URL = 'api/categories';

  http = inject(HttpClient);
  householdService = inject(HouseholdService);

  // Changed to BehaviorSubject to maintain current state and allow late subscribers
  private budgetSubject: BehaviorSubject<Budget[]> = new BehaviorSubject<Budget[]>([]);
  public budgets$ = this.budgetSubject.asObservable();
  private budgetCategorySubject: BehaviorSubject<BudgetCategory[]> = new BehaviorSubject<BudgetCategory[]>([]);
  public budgetCategoriess$ = this.budgetCategorySubject.asObservable();

  private budgetsLoaded = false;


  constructor() {
    this.watchActiveHousehold();
  }

  private watchActiveHousehold() {
    this.householdService.activeHouseholds$.pipe(
      distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
      tap(household => {
        this.budgetsLoaded = false;
        if (household?.id) {
          this.loadBudgets();
        } else {
          this.setBudgets([]);
        }
      })
    ).subscribe();
  }
  addBudget(budget: BudgetCreate): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(`${this.BUDGET_URL}`, budget).pipe(
      tap(res => {
        console.log("CREATING BUDGET...", res.data);
        const currentBudgets = this.budgetSubject.getValue();
        const newBudget = res.data


        this.setBudgets([...currentBudgets, newBudget]);
      }),
      catchError(err => {
        console.error('Failed to add budget', err);
        throw err;
      })
    );
  }


  loadBudgets(): void {

    if (this.budgetsLoaded) {
      return;
    }
    console.log('LOADING BUDGETS...');
    const activeHousehold = this.householdService.getActiveHousehold();
    if (!activeHousehold || !activeHousehold.id) {
      console.warn('Cannot load budgets: No active household');
      this.setBudgets([]);
      return;
    }

    this.budgetsLoaded = true;
    const url = `${this.BUDGET_URL}/household/${activeHousehold.id}`;

    this.http.get<BudgetListResponse>(url).pipe(
      map(response => response.data),
      tap(budgets => {
        this.setBudgets(budgets);

      }),
      catchError(err => {
        console.error('Failed to load budgets', err);
        this.budgetsLoaded = false; // allow retry
        return EMPTY;
      })
    ).subscribe();
  }

  /**
   * Get budget count from cached data (no API call needed)
   * Synchronized with budgetSubject
   */
  getBudgetsCount(): number {
    return this.budgetSubject.getValue().length;
  }

  /**
   * Update budget amount via API
   * Returns Observable for async handling
   */
  updateBudgetAmount(budgetId: number, spent: number): Observable<Budget> {
    return this.http.put<Budget>(`${this.BUDGET_URL}/${budgetId}`, { spent }).pipe(
      tap(updatedBudget => {
        const budgets = this.budgetSubject.getValue();
        const index = budgets.findIndex(x => x.id === budgetId);
        if (index > -1) {
          budgets[index] = updatedBudget;
          this.setBudgets([...budgets]);
        }
      }),
      catchError(err => {
        console.error(`Failed to update budget ${budgetId}`, err);
        throw err;
      })
    );
  }

  /**
   * Get budget categories from cached data
   * Read from BehaviorSubject for synchronous access
   */
  getBudgetCategories(): BudgetCategory[] {
    return this.budgetCategorySubject.getValue();
  }

  /**
   * Get budget by ID from cached data
   * Synchronous read from BehaviorSubject
   */
  getBudgetById(budgetId: number): Budget {
    const budgets = this.budgetSubject.getValue();
    const index = budgets.findIndex(x => x.id === budgetId);
    if (index > -1) {
      return budgets[index];
    }
    throw Error('This Budget does not exist');
  }

  /**
   * Get budget category by ID from cached data
   * Synchronous read from BehaviorSubject
   */
  getBudgetCategoryById(id: number): BudgetCategory {
    const categories = this.budgetCategorySubject.getValue();
    const index = categories.findIndex(x => x.id === id);
    if (index > -1) {
      return categories[index];
    }
    throw Error('Category does not exist');
  }

  /**
   * Internal method to update budget state and localStorage
   * Called after successful API operations
   */
  private setBudgets(budgets: Budget[]) {
    localStorage.setItem(this.BUDGETS, JSON.stringify(budgets));

    const budgetCategories: BudgetCategory[] = budgets.map((item: Budget) => {
      return {
        color: item.color,
        id: item.id,
        categoryName: item.name
      } as BudgetCategory;
    });
    this.setBudgetCategories(budgetCategories);
    this.budgetSubject.next(budgets);
  }

  /**
   * Internal method to update budget categories state
   */
  private setBudgetCategories(budgetCategories: BudgetCategory[]) {
    localStorage.setItem(this.BUDGET_CATEGORIES, JSON.stringify(budgetCategories));
    this.budgetCategorySubject.next(budgetCategories);
  }

  /**
   * Observable stream of budget data
   * Use in components with async pipe to avoid manual subscriptions
   */
  getBudgetData(): Observable<Budget[]> {
    return this.budgetSubject.asObservable();
  }

  /**
   * Observable stream of budget category data
   * Use in components with async pipe to avoid manual subscriptions
   */
  getBudgetCategoryData(): Observable<BudgetCategory[]> {
    return this.budgetCategorySubject.asObservable();
  }

  /**
   * Delete a budget via API
   * Returns Observable for async handling
   */
  deleteBudgetById(budgetId: number): Observable<void> {
    return this.http.delete<void>(`${this.BUDGET_URL}/${budgetId}`).pipe(
      tap(() => {
        const budgets = this.budgetSubject.getValue();
        const filteredBudgets = budgets.filter((item) => item.id !== budgetId);
        this.setBudgets(filteredBudgets);
      }),
      catchError(err => {
        console.error(`Failed to delete budget ${budgetId}`, err);
        throw err;
      })
    );
  }
}
