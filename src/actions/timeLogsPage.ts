"use server";

import { revalidatePath } from "next/cache";

export async function reloadTimeLogs() {
  revalidatePath("/dashboard/biometrics/time-logs");
}
