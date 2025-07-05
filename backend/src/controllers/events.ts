import { Request, Response } from 'express';

import { createEvent, fetchEvents, getEventById, modifyEvent, removeEvent } from "../services/events";
import { EventDTO, EventType, TagJoinedType, TagType } from "../types/types";
import { createTag, fetchAllEventTags, findTagByName, linkTagToEvent, removeTagsFromEvent } from "../services/tags";
import { getCategoryByName } from "../services/categories";
import { AuthenticatedRequest } from "../middlewares/checkForToken";

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

    if (userEmail !== existingEvent.authorEmail) {
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

    if (userEmail !== existingEvent.authorEmail) {
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

};

export const getTheMostPopularEvents = async (req: Request, res: Response) => {

};

export const incrementViews = async (req: Request, res: Response) => {
    const { id } = req.params;

    return res.status(200).json({
        success: true,
        message: 'Event views incremented successfully'
    });
};