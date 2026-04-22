import { Color } from "../../shared/types/colors";

export interface BudgetCreate{
        categoryName: string;
        budgetLimit: number;
        householdId: number;
        color: Color;
}