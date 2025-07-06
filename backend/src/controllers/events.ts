import { Request, Response } from 'express';

import {
    createEvent,
    createEventReaction,
    fetchEvents,
    fetchMostPopularEvents,
    fetchNewestEvents,
    getEventById,
    getEventReactionsForVisitor,
    incrementEventViews,
    modifyEvent,
    removeEvent,
    removeEventReaction,
    updateEventDislikes,
    updateEventLikes
} from "../services/events";
import { EventDTO, EventReactionType, EventType, TagJoinedType, TagType, User, UserType } from "../types/types";
import { createTag, fetchAllEventTags, findTagByName, linkTagToEvent, removeTagsFromEvent } from "../services/tags";
import { getCategoryByName } from "../services/categories";
import { AuthenticatedRequest } from "../middlewares/checkForToken";
import { CookieRequest } from "../middlewares/checkVisitorCookie";
import { getUserByEmail } from "../services/users";

export const getAllEvents = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    const { eventsFromDB, totalFromDB } = await fetchEvents(offset, limit, search);

    if (!eventsFromDB.success) {
        res.status(eventsFromDB.status || 500).json({ success: false, error: eventsFromDB.error });
        return;
    }

    if (!totalFromDB.success) {
        res.status(totalFromDB.status || 500).json({ success: false, error: totalFromDB.error });
        return;
    }

    const total = Number(totalFromDB.data[0].count);

    const events: EventType[] = eventsFromDB.data;

    const tagsFromDB = await fetchAllEventTags();

    if (!tagsFromDB.success) {
        res.status(tagsFromDB.status || 500).json({ success: false, error: tagsFromDB.error });
        return;
    }

    const tags: TagJoinedType[] = tagsFromDB.data;

    events.map(event => {
        const tagsForEvent = tags.filter(tag => tag.eventId === event.id);
        event.tags = tagsForEvent.map(tag => tag.name);
    });

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
        success: true,
        data: events,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        }
    });
};

export const addEvent = async (req: AuthenticatedRequest, res: Response) => {
    const eventData: EventDTO = req.body;
    const { title, description, eventDate, location, category, tags, maxCapacity } = eventData;

    const userEmail = req.userData;

    if (!userEmail) {
        return res.status(401).json({
            success: false,
            error: { message: 'Unauthorized: No user data found' }
        });
    }

    if (!title || !description || !eventDate || !location || !category) {
        return res.status(400).json({
            success: false,
            error: { message: 'Event data is required' }
        });
    }

    const categoryDB = await getCategoryByName(category);

    if (!categoryDB.success) {
        return res.status(categoryDB.status || 500).json({ success: false, error: categoryDB.error });
    }

    if (categoryDB.data.length === 0) {
        return res.status(400).json({
            success: false,
            error: { message: 'Category does not exist' }
        });
    }

    const eventFromDB = await createEvent(userEmail, title, description, eventDate, location, category, maxCapacity);

    if (!eventFromDB.success) {
        return res.status(eventFromDB.status || 500).json({ success: false, error: eventFromDB.error });
    }

    const event: EventType = eventFromDB.data[0];

    if (tags && tags.length > 0) {
        await Promise.all(tags.map(async (tag) => {
            const tagResult = await findTagByName(tag);
            if (!tagResult.success) {
                return res.status(tagResult.status || 500).json({ success: false, error: tagResult.error });
            }

            let tagData: TagType = tagResult.data[0];

            if (!tagData) {
                const createResult = await createTag(tag);
                if (!createResult.success) {
                    return res.status(createResult.status || 500).json({ success: false, error: createResult.error });
                }
                tagData = createResult.data[0];
            }

            if (tagData && tagData.id) {
                await linkTagToEvent(tagData.id, event.id);
            }
        }));
    }

    return res.status(201).json({
        success: true,
        data: { event, tags },
        message: 'Event created successfully'
    });
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response) => {
    const eventData: Partial<EventDTO> = req.body;
    const id: string = req.params.id;

    const userEmail = req.userData;

    if (!userEmail) {
        return res.status(401).json({
            success: false,
            error: { message: 'Unauthorized: No user data found' }
        });
    }

    const existingEventResult = await getEventById(id);

    if (!existingEventResult.success) {
        return res.status(existingEventResult.status || 500).json({ success: false, error: existingEventResult.error });
    }

    const existingEvent = existingEventResult.data[0];

    if (!existingEvent) {
        return res.status(404).json({
            success: false,
            error: { message: 'Event not found' }
        });
    }
    const userFromDB = await getUserByEmail(userEmail);

    if (!userFromDB.success) {
        return res.status(userFromDB.status || 500).json({ success: false, error: userFromDB.error });
    }

    const user: User = userFromDB.data[0];

    if (user.email !== existingEvent.authorEmail || user.userType !== UserType.ADMIN) {
        return res.status(403).json({
            success: false,
            error: { message: 'Forbidden: You do not have permission to modify this event' }
        });
    }

    const updatedEventResult = await modifyEvent(id, eventData);

    if (!updatedEventResult.success) {
        return res.status(updatedEventResult.status || 500).json({ success: false, error: updatedEventResult.error });
    }

    if (eventData.tags && eventData.tags.length > 0) {
        const removeResult = await removeTagsFromEvent(id);
        if (!removeResult.success) {
            return res.status(removeResult.status || 500).json({ success: false, error: removeResult.error });
        }

        await Promise.all(eventData.tags.map(async (tag) => {
            const tagResult = await findTagByName(tag);
            if (!tagResult.success) {
                return res.status(tagResult.status || 500).json({ success: false, error: tagResult.error });
            }

            let tagData = tagResult.data[0];

            if (!tagData) {
                const createResult = await createTag(tag);
                if (!createResult.success) {
                    return res.status(createResult.status || 500).json({ success: false, error: createResult.error });
                }
                tagData = createResult.data[0];
            }

            if (tagData && tagData.id) {
                await linkTagToEvent(tagData.id, id);
            }
        }));
    }

    return res.status(200).json({
        success: true,
        data: updatedEventResult.data,
        message: 'Event updated successfully'
    });
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const userEmail = req.userData;

    if (!userEmail) {
        return res.status(401).json({
            success: false,
            error: { message: 'Unauthorized: No user data found' }
        });
    }

    const existingEventFromDB = await getEventById(id);

    if (!existingEventFromDB.success) {
        return res.status(existingEventFromDB.status || 500).json({ success: false, error: existingEventFromDB.error });
    }

    const existingEvent = existingEventFromDB.data[0];

    if (!existingEvent) {
        return res.status(404).json({
            success: false,
            error: { message: 'Event not found' }
        });
    }

    const userFromDB = await getUserByEmail(userEmail);

    if (!userFromDB.success) {
        return res.status(userFromDB.status || 500).json({ success: false, error: userFromDB.error });
    }

    const user: User = userFromDB.data[0];

    if (user.email !== existingEvent.authorEmail || user.userType !== UserType.ADMIN) {
        return res.status(403).json({
            success: false,
            error: { message: 'Forbidden: You do not have permission to delete this event' }
        });
    }

    const deleteResponseDB = await removeEvent(id);

    if (!deleteResponseDB.success) {
        return res.status(deleteResponseDB.status || 500).json({ success: false, error: deleteResponseDB.error });
    }

    return res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
    });
};

export const getTheNewestEvents = async (req: Request, res: Response) => {
    const eventsFromDB = await fetchNewestEvents();

    if (!eventsFromDB.success) {
        return res.status(eventsFromDB.status || 500).json({ success: false, error: eventsFromDB.error });
    }

    const events: EventType[] = eventsFromDB.data;

    const tagsFromDB = await fetchAllEventTags();

    if (!tagsFromDB.success) {
        res.status(tagsFromDB.status || 500).json({ success: false, error: tagsFromDB.error });
        return;
    }

    const tags: TagJoinedType[] = tagsFromDB.data;

    events.map(event => {
        const tagsForEvent = tags.filter(tag => tag.eventId === event.id);
        event.tags = tagsForEvent.map(tag => tag.name);
    });

    return res.status(200).json({
        success: true,
        data: events,
    });
};

export const getTheMostPopularEvents = async (req: Request, res: Response) => {
    const eventsFromDB = await fetchMostPopularEvents();
    if (!eventsFromDB.success) {
        return res.status(eventsFromDB.status || 500).json({ success: false, error: eventsFromDB.error });
    }
    const events: EventType[] = eventsFromDB.data;
    const tagsFromDB = await fetchAllEventTags();
    if (!tagsFromDB.success) {
        res.status(tagsFromDB.status || 500).json({ success: false, error: tagsFromDB.error });
        return;
    }
    const tags: TagJoinedType[] = tagsFromDB.data;
    events.map(event => {
        const tagsForEvent = tags.filter(tag => tag.eventId === event.id);
        event.tags = tagsForEvent.map(tag => tag.name);
    });

    return res.status(200).json({
        success: true,
        data: events,
    });
};

export const incrementViews = async (req: CookieRequest, res: Response) => {
    const { id } = req.params;

    const visitorId = req.visitorId;

    if (!visitorId) {
        return res.status(400).json({
            success: false,
            error: { message: 'Visitor ID is required' }
        });
    }

    const eventFromDB = await getEventById(id);
    if (!eventFromDB.success) {
        return res.status(eventFromDB.status || 500).json({ success: false, error: eventFromDB.error });
    }

    const event = eventFromDB.data[0];

    if (!event) {
        return res.status(404).json({
            success: false,
            error: { message: 'Event not found' }
        });
    }

    const isAlreadyViewed = await getEventReactionsForVisitor(id, visitorId, true);

    if (!isAlreadyViewed.success) {
        return res.status(isAlreadyViewed.status || 500).json({ success: false, error: isAlreadyViewed.error });
    }

    const existingReaction = isAlreadyViewed.data;

    if (existingReaction.length > 0 && existingReaction.includes(EventReactionType.VIEW)) {
        return res.status(400).json({
            success: false,
            error: { message: 'You have already viewed this event' }
        });
    }

    const responseDB = await incrementEventViews(id);

    if (!responseDB.success) {
        return res.status(responseDB.status || 500).json({ success: false, error: responseDB.error });
    }

    return res.status(200).json({
        success: true,
        message: 'Event views incremented successfully'
    });
};

export const likeEvent = async (req: CookieRequest, res: Response) => {
    const { id } = req.params;

    const visitorId = req.visitorId;

    if (!visitorId) {
        return res.status(400).json({
            success: false,
            error: { message: 'Visitor ID is required' }
        });
    }

    const eventFromDB = await getEventById(id);
    if (!eventFromDB.success) {
        return res.status(eventFromDB.status || 500).json({ success: false, error: eventFromDB.error });
    }

    const event = eventFromDB.data[0];

    if (!event) {
        return res.status(404).json({
            success: false,
            error: { message: 'Event not found' }
        });
    }

    const reactionFromDB = await getEventReactionsForVisitor(id, visitorId);

    if (!reactionFromDB.success) {
        return res.status(reactionFromDB.status || 500).json({ success: false, error: reactionFromDB.error });
    }

    const existingReaction = reactionFromDB.data[0];

    if (existingReaction) {
        if (existingReaction === EventReactionType.LIKE) {
            return res.status(400).json({
                success: false,
                error: { message: 'You have already liked this event' }
            });
        } else if (existingReaction === EventReactionType.DISLIKE) {
            // If the visitor has disliked the event, we need to remove the like first
            const removeReactionResponseDB = await removeEventReaction(id, visitorId);
            if (!removeReactionResponseDB.success) {
                return res.status(removeReactionResponseDB.status || 500).json({
                    success: false,
                    error: removeReactionResponseDB.error
                });
            }

            const updateLikeResponseDB = await updateEventDislikes(id, "-");
            if (!updateLikeResponseDB.success) {
                return res.status(updateLikeResponseDB.status || 500).json({
                    success: false,
                    error: updateLikeResponseDB.error
                });
            }
        }
    }

    const responseCreateDB = await createEventReaction(id, visitorId, EventReactionType.LIKE);

    if (!responseCreateDB.success) {
        return res.status(responseCreateDB.status || 500).json({ success: false, error: responseCreateDB.error });
    }

    const responseDB = await updateEventLikes(id, "+");

    if (!responseDB.success) {
        return res.status(responseDB.status || 500).json({ success: false, error: responseDB.error });
    }

    return res.status(200).json({
        success: true,
        message: 'Event liked successfully'
    });
};

export const dislikeEvent = async (req: CookieRequest, res: Response) => {
    const { id } = req.params;

    const visitorId = req.visitorId;

    if (!visitorId) {
        return res.status(400).json({
            success: false,
            error: { message: 'Visitor ID is required' }
        });
    }

    const eventFromDB = await getEventById(id);
    if (!eventFromDB.success) {
        return res.status(eventFromDB.status || 500).json({ success: false, error: eventFromDB.error });
    }

    const event = eventFromDB.data[0];

    if (!event) {
        return res.status(404).json({
            success: false,
            error: { message: 'Event not found' }
        });
    }

    const reactionFromDB = await getEventReactionsForVisitor(id, visitorId);

    if (!reactionFromDB.success) {
        return res.status(reactionFromDB.status || 500).json({ success: false, error: reactionFromDB.error });
    }

    const existingReaction = reactionFromDB.data[0];

    if (existingReaction) {
        if (existingReaction === EventReactionType.DISLIKE) {
            return res.status(400).json({
                success: false,
                error: { message: 'You have already disliked this event' }
            });
        } else if (existingReaction === EventReactionType.LIKE) {
            // If the visitor has liked the event, we need to remove the like first
            const removeReactionResponseDB = await removeEventReaction(id, visitorId);
            if (!removeReactionResponseDB.success) {
                return res.status(removeReactionResponseDB.status || 500).json({
                    success: false,
                    error: removeReactionResponseDB.error
                });
            }

            const updateLikeResponseDB = await updateEventLikes(id, "-");
            if (!updateLikeResponseDB.success) {
                return res.status(updateLikeResponseDB.status || 500).json({
                    success: false,
                    error: updateLikeResponseDB.error
                });
            }
        }
    }

    const responseCreateDB = await createEventReaction(id, visitorId, EventReactionType.DISLIKE);

    if (!responseCreateDB.success) {
        return res.status(responseCreateDB.status || 500).json({ success: false, error: responseCreateDB.error });
    }

    const responseDB = await updateEventDislikes(id, "+");

    if (!responseDB.success) {
        return res.status(responseDB.status || 500).json({ success: false, error: responseDB.error });
    }

    return res.status(200).json({
        success: true,
        message: 'Event disliked successfully'
    });
};