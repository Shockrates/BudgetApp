import { Budget } from "../models/budget.interface";

export interface BudgetListResponse {
    message: string,
    data: Budget[]
}