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

export type Category = {
    description: string;
    name: string;
}

export type ActivityStatus = {
    status: "ACTIVE" | "NOT_ACTIVE";
}

export type EventType = {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    event_date: string;
    location: string;
    views: number;
    authorEmail: string;
    categoryName: string;
    maxCapacity: number;
    likeCount: number;
    dislikeCount: number;
}

export type TotalCount = {
    count: string;
}
