import { Color } from "../../shared/types/colors";

export interface BudgetCardConfig {
    name: String;
    budget: number;
    spent: number;
    color: Color;
    onClick: () => any;
}