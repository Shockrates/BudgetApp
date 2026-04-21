import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BudgetService } from '../services/budget.service';
import { filter, map, take, tap } from 'rxjs';
import { Budget } from '../interfaces/models/budget.interface';

export const budgetResolver: ResolveFn<Budget> = (route, state) => {

  const budgetService = inject(BudgetService);

  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('Budget ID is required');
  }

  budgetService.loadBudgets();



  return budgetService.budgets$.pipe(
    tap(budget => {
      console.log('RESOLVER RUNS, budget: ' + budget + " " + id);
    }),
    map((budgets) => {
      console.log('Looking for id:', typeof (id));
      console.log('Available ids:', budgets.map(b => typeof (b.id)));
      return budgets.find(b => String(b.id) === String(id));
    }),
    //map((budgets): Budget | undefined => budgets.find(b => String(b.id) === String(id))),
    filter((budget): budget is Budget => !!budget),
    take(1)
  );

};
