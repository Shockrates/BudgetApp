import { Household } from "../models/household.interface"
import { UserResponse } from "./userResponse.interface"

export interface UserHouseholdResponse {
    message: string,
    data: {
        user: UserResponse
        userHouseholds: Household[]
    }
}