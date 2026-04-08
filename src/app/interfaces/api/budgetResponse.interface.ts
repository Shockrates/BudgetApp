import { Budget } from "../models/budget.interface";

export interface BudgetResponse {
    message: string,
    data: Budget[]
}