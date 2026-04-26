import { BudgetCategory } from "./budget-category.interface";

export interface Expense {
    id: number;
    expenseDescription: string;
    categorySummary: BudgetCategory;
    expenseAmount: number;
    expenseDate: Date

}