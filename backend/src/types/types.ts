export enum UserType {
    ADMIN = 'ADMIN',
    EVENT_CREATOR = 'EVENT_CREATOR',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    NOT_ACTIVE = 'NOT_ACTIVE',
}

export type User = {
    email: string;
    name: string;
    lastName: string;
    userType: UserType;
    status: UserStatus;
    password: string;
}
