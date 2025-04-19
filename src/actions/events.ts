"use server";
import { getHolidaysAPI } from "@/utils/holidays";
import { prisma } from "../../prisma/prisma";
import { syncHolidaySettings } from "./settings";

export const syncHolidays = async (year: number) => {
  try {
    const holidays = getHolidaysAPI(
      new Date(year, 0, 1),
      new Date(year, 11, 31)
    );

    const holidayEvents = holidays.map((holiday: any) => ({
      name: holiday.name,
      index: holiday.date,
      startDate: new Date(holiday.start),
      endDate: new Date(holiday.end),
      type: holiday.type || "event",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    for (const event of holidayEvents) {
      await prisma.events.upsert({
        where: { index: event.index },
        update: { ...event, updatedAt: new Date() },
        create: event,
      });
    }

    await syncHolidaySettings(new Date().getFullYear().toString());
    return { success: true, message: "Holidays synced successfully!" };
  } catch (error) {
    console.error("Error syncing holidays:", error);
    return { success: false, error: "Failed to sync holidays." };
  }
};

export const getEventsByDateRange = async (from: Date, to: Date) => {
  try {
    const events = await prisma.events.findMany({
      where: {
        startDate: {
          gte: from,
        },
        endDate: {
          lte: to,
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return { success: true, items: events };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, error: "Failed to fetch events." };
  }
};

export const createEvent = async (payload: any) => {
  try {
    const event = await prisma.events.create({
      data: payload,
    });

    return { success: true, data: event };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: "Failed to create event." };
  }
};

export const updateEvent = async (id: string, payload: any) => {
  try {
    const event = await prisma.events.update({
      where: { id },
      data: payload,
    });

    return { success: true, data: event };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: "Failed to update event." };
  }
};

export const deleteEvent = async (id: string) => {
  try {
    await prisma.events.delete({
      where: { id },
    });

    return { success: true, message: "Event deleted successfully!" };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: "Failed to delete event." };
  }
};
