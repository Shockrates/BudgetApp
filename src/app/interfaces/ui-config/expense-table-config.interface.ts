import { Color } from "../../shared/types/colors";

export interface ExpenseTableDataConfig {
    id: number;
    name: string;
    amount: number;
    date: Date;
    budget: string;
    color: Color
}