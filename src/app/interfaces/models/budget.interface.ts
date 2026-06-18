import { Color } from "../../shared/types/colors";
import { Expense } from "./expense.interface";

export interface Budget {
    id: number;
    name: string;
    budgetLimit: number;
    spent: number;
    householdId:number;
    color: Color;
    expenses:Expense[];
}