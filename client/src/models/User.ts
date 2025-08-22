export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    user_type: 'USER' | 'ADMIN';
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    lastLogin?: string;
    phoneNumber?: string;
    avatar?: string;
}

export interface UserForm {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    userType: 'USER' | 'ADMIN';
    isActive: boolean;
    phoneNumber?: string;
}
