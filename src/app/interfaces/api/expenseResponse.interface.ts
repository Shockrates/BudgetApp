import { Expense } from "../models/expense.interface"
import { PaginationMetaConfig } from "../ui-config/pagination-meta-config.interface";

// API DTO - represents actual API response structure
export interface ExpenseDTO {
    expenseId: number;
    expenseAmount: number;
    expenseDate: string; // ISO date string from API
    expenseDescription: string;
    categorySummary: {
        categoryId: number;
        categoryName: string;
        color: string;
    };
    userSummary?: any; // Optional
}

export interface ExpenseResponse {
    message: string,
    data: {
        content: ExpenseDTO[]; // API response uses DTO
        meta: PaginationMetaConfig;
    }
}