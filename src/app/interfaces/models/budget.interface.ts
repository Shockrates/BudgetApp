import { Color } from "../../shared/types/colors";

export interface Budget {
    id: string;
    name: string;
    budgetLimit: number;
    spent: number;
    color: Color;
}