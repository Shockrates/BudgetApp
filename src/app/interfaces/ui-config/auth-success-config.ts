export type authStatus = 'success' | 'default' 

export interface AuthSuccessConfig {
    message: string;
    redirectUrl: string;
    status: authStatus;
}
