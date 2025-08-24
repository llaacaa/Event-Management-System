// @ts-ignore

export enum UserType {
    ADMIN = 'ADMIN',
    EVENT_CREATOR = 'EVENT_CREATOR',
    USER = 'USER',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    NOT_ACTIVE = 'NOT_ACTIVE',
}

export interface User {
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

export interface EventType {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    eventDate: string;
    location: string;
    views: number;
    authorEmail: string;
    categoryName: string;
    maxCapacity?: number;
    likeCount: number;
    dislikeCount: number;
    tags?: string[];
}

export interface EventDTO {
    title: string;
    description: string;
    eventDate: string;
    location: string;
    category: string;
    tags?: string[];
    maxCapacity?: number;
}

export type TotalCount = {
    count: string;
}

export interface TagType {
    id: string;
    name: string;
}

export interface TagJoinedType {
    name: string;
    eventId: string;
}

export enum EventReactionType {
    LIKE = 'like',
    DISLIKE = 'dislike',
    VIEW = 'view'
}

export enum CommentReactionType {
    LIKE = 'like',
    DISLIKE = 'dislike'
}
