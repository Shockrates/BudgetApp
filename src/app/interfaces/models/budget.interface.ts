import { Color } from "../../shared/types/colors";

export interface Budget {
    id: string;
    name: string;
    budget: number;
    spent: number;
    color: Color;
}