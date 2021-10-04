export interface User {
    email: string;
    name: string;
    enterpriseName: string;
    postalCode: string;
    telephone: string;
    password: string;
    passwordConfirmation: string;
    termsConditions: boolean;
    id?: string;
}