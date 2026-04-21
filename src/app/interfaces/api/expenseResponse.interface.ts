import { Expense } from "../models/expense.interface"
import { PaginationMetaConfig } from "../ui-config/pagination-meta-config.interface";

export interface ExpenseResponse {
    message: string,
    data: {
        content: Expense[];
        meta: PaginationMetaConfig;
    }
}