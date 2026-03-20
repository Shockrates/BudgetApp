export type authStatus = 'default' | 'loading' | 'success' | 'error'

export interface AuthSuccessConfig {
    message: string;
    redirectUrl: string;
    status: authStatus;
}
