import { Request, Response } from 'express';

import { createEvent, fetchEvents } from "../services/events";
import { AuthenticatedRequest } from "../utils/jsonWebToken";

export const getAllEvents = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    const { events, total } = await fetchEvents(offset, limit, search);

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
    const { title, description, eventDate, location, category, tags, maxCapacity } = req.body;

    const userEmail = req.userData;

    if (!userEmail) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No user data found'
        });
    }

    if (!title || !description || !eventDate || !location || !category || !tags) {
        return res.status(400).json({
            success: false,
            message: 'Event data is required'
        });
    }

    const event = await createEvent( userEmail, title, description, eventDate, location, category, tags, maxCapacity);

    return res.status(201).json({
        success: true,
        data: event,
        message: 'Event created successfully'
    });
};

export const updateEvent = async (req: Request, res: Response) => {
    // const { id } = req.params;
    // const eventData = req.body;
    //
    // if (!eventData) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Event data is required'
    //     });
    // }
    //
    // // Check if event exists
    // const existingEvent = await getEventById(id);
    // if (!existingEvent) {
    //     return res.status(404).json({
    //         success: false,
    //         message: 'Event not found'
    //     });
    // }
    //
    // const updatedEvent = await modifyEvent(id, eventData);
    //
    // return res.status(200).json({
    //     success: true,
    //     data: updatedEvent,
    //     message: 'Event updated successfully'
    // });
};

export const deleteEvent = async (req: Request, res: Response) => {
    // const { id } = req.params;
    //
    // // Check if event exists
    // const existingEvent = await getEventById(id);
    // if (!existingEvent) {
    //     return res.status(404).json({
    //         success: false,
    //         message: 'Event not found'
    //     });
    // }
    //
    // await removeEvent(id);
    //
    // return res.status(200).json({
    //     success: true,
    //     message: 'Event deleted successfully'
    // });
};