export interface User {
    id:string;
    email: string;
    displayName: string;
    token: string;
}

export interface Address {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
}