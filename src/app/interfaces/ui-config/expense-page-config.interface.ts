import { Expense } from "../models/expense.interface";
import { PaginationMetaConfig } from "./pagination-meta-config.interface";

export interface ExpensePageConfig{
    data: Expense[];
    meta: PaginationMetaConfig;
}