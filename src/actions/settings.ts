"use server";
import { prisma } from "../../prisma/prisma";

export const getSettings = async () => {
  try {
    const existingSettings = await prisma.settings.findFirst();

    console.log("Existing Settings:", existingSettings);

    if (existingSettings) {
      return existingSettings;
    } else {
      const newSettings = await prisma.settings.create({
        data: { syncHolidays: "false" },
      });
      return newSettings;
    }
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings." };
  }
};

export const syncHolidaySettings = async (sync: string) => {
  try {
    const existingSettings = await prisma.settings.findFirst();

    if (existingSettings) {
      const updatedSettings = await prisma.settings.update({
        where: { id: existingSettings.id },
        data: { syncHolidays: sync },
      });
      return { success: true, data: updatedSettings };
    } else {
      const newSettings = await prisma.settings.create({
        data: { syncHolidays: sync },
      });
      return { success: true, data: newSettings };
    }
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings." };
  }
};
