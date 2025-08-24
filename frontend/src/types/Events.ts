export interface EventCard {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    eventDate: string;
    location: string;
    views: number;
    authorEmail: string;
    categoryName: string;
    maxCapacity: number | undefined;
    likeCount: number;
    dislikeCount: number;
    tags: string[];
}
