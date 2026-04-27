import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { BudgetService } from '../services/budget.service';
import { catchError, filter, map, of, take, tap } from 'rxjs';
import { Budget } from '../interfaces/models/budget.interface';
import { formatDate } from '../shared/helper/date.utils';

export const budgetResolver: ResolveFn<Budget> = (route, state) => {

  const budgetService = inject(BudgetService);
  const router = inject(Router);

  const id = Number(route.paramMap.get('id'));

  if (!id) {
    throw new Error('Budget ID is required');
  }

  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  //budgetService.loadBudgets();



  // return budgetService.budgets$.pipe(
  //   // tap(budget => {
  //   //   console.log('RESOLVER RUNS, budget: ' + budget + " " + id);
  //   // }),
  //   map((budgets) => {

  //     return budgets.find(b => String(b.id) === String(id));
  //   }),
  //   tap(budget => {
  //     console.log('RESOLVER RUNS, budget: ' , budget , " " , id);
  //   }),
  //   //map((budgets): Budget | undefined => budgets.find(b => String(b.id) === String(id))),
  //   filter((budget): budget is Budget => !!budget),
  //   take(1)
  // );

  return budgetService.loadBudgetById({
      budgetId: id,
      startDate: formatDate(lastMonth),
      endDate: formatDate(today),
    })

};
