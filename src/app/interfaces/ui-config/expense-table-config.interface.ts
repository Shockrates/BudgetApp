import { Color } from "../../shared/types/colors";

export interface ExpenseTableDataConfig {
    id: string;
    name: string;
    amount: number;
    date: Date;
    budget: string;
    color: Color
}