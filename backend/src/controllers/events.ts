import { Request, Response } from 'express';

import { createEvent, fetchEvents, getEventById, modifyEvent, removeEvent } from "../services/events";
import { AuthenticatedRequest } from "../utils/jsonWebToken";
import { EventDTO, EventType, TagType } from "../types/types";
import {
    createTag,
    fetchAllEventTags,
    findTagByName,
    linkTagToEvent,
    removeTagsFromEvent
} from "../services/tags";
import { getCategoryByName } from "../services/categories";

export const getAllEvents = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    const { events, total } = await fetchEvents(offset, limit, search);

    const tags = await fetchAllEventTags();

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
            message: 'Unauthorized: No user data found'
        });
    }

    if (!title || !description || !eventDate || !location || !category) {
        return res.status(400).json({
            success: false,
            message: 'Event data is required'
        });
    }

    const categoryDB = await getCategoryByName(category);

    if (!categoryDB) {
        return res.status(400).json({
            success: false,
            message: 'Category does not exist'
        });
    }

    const event: EventType = await createEvent(userEmail, title, description, eventDate, location, category, maxCapacity);

    if (tags && tags.length > 0) {
        tags.map(async (tag) => {
            let tagFromDB: TagType = await findTagByName(tag);
            if (!tagFromDB) {
                tagFromDB = await createTag(tag);
            }
            await linkTagToEvent(tagFromDB.id, event.id);
        });
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
            message: 'Unauthorized: No user data found'
        });
    }

    const existingEvent = await getEventById(id);
    if (!existingEvent) {
        return res.status(404).json({
            success: false,
            message: 'Event not found'
        });
    }

    const updatedEvent = await modifyEvent(id, eventData);

    if (eventData.tags && eventData.tags.length > 0) {
        await removeTagsFromEvent(id);
        eventData.tags.map(async (tag) => {
            let tagFromDB: TagType = await findTagByName(tag);
            if (!tagFromDB) {
                tagFromDB = await createTag(tag);
            }
            await linkTagToEvent(tagFromDB.id, id);
        });
    }

    return res.status(200).json({
        success: true,
        data: updatedEvent,
        message: 'Event updated successfully'
    });
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const userEmail = req.userData;

    if (!userEmail) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No user data found'
        });
    }

    const existingEvent = await getEventById(id);
    if (!existingEvent) {
        return res.status(404).json({
            success: false,
            message: 'Event not found'
        });
    }

    if (userEmail !== existingEvent.authorEmail) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: You do not have permission to delete this event'
        });
    }

    await removeEvent(id);

    return res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
    });
};