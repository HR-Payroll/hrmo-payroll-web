"use server";
import { prisma } from "../../prisma/prisma";

export const createSchedule = async (payload: any) => {
  try {
    const event = await prisma.schedule.create({
      data: payload,
    });

    return { success: true, data: event };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: "Failed to create schedule." };
  }
};

export const updateSchedule = async (id: string, payload: any) => {
  try {
    console.log("Updating schedule with ID:", id, "and payload:", payload);
    const event = await prisma.schedule.update({
      where: { id },
      data: payload,
    });

    return { success: true, data: event };
  } catch (error) {
    console.error("Error updating schedule:", error);
    return { error: "Failed to update schedule." };
  }
};

export const deleteSchedule = async (id: string) => {
  try {
    await prisma.schedule.delete({
      where: { id },
    });

    return { success: true, message: "Schedule deleted successfully!" };
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return { success: false, error: "Failed to delete schedule." };
  }
};
