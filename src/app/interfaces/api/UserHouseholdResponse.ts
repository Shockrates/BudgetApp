import { Household } from "../models/household.interface"

export interface UserHouseholdResponse {
    message: string,
    data: {
        id: string,
        userHouseholds: Household[]
    }
}