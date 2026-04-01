import { Household } from "../models/household.interface"

export interface HouseholdResponse {
    message: string,
    data: Household
}