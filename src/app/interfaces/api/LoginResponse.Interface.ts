export interface LoginResponse {
    message: string,
    data: {
        id: string,
        token: string,
        userName: string,
        userEmail: string
    }
}