import { BudgetCategory } from "./budget-category.interface";

export interface Expense {
    id: number;
    name: string;
    budgetCategory: BudgetCategory;
    amount: number;
    date: Date

}