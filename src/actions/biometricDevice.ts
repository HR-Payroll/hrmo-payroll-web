"use server";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";

const BiometricDeviceSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  deviceName: z.string().min(1, "Device name is required"),
  location: z.string().min(1, "Location is required"),
  apiUri: z.string().url().optional().or(z.literal("")),
});

export const createBiometricDevice = async (
  data: z.infer<typeof BiometricDeviceSchema>,
) => {
  const validateData = BiometricDeviceSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const { deviceId, deviceName, location, apiUri } = validateData;

  try {
    await prisma.biometricDevice.create({
      data: {
        deviceId,
        name: deviceName,
        location,
        apiUri: apiUri || null,
        status: "OFFLINE",
      },
    });

    return { success: "Biometric device has been successfully added!" };
  } catch (error: any) {
    console.log("Error creating biometric device:", error);

    if (error.code === "P2002") {
      return {
        error: "Device ID already exists. Please use a different Device ID.",
      };
    }

    return { error: "Something went wrong, please try again later." };
  }
};

export const updateBiometricDevice = async (
  id: number,
  payload: {
    deviceId?: string;
    name?: string;
    location?: string;
    status?: string;
  },
) => {
  try {
    const updateData: any = { ...payload };

    await prisma.biometricDevice.update({
      where: { id },
      data: updateData,
    });

    return { success: "Biometric device has been successfully updated!" };
  } catch (error: any) {
    console.log("Error updating biometric device:", error);

    if (error.code === "P2002") {
      return {
        error: "Device ID already exists. Please use a different Device ID.",
      };
    }

    return { error: "Something went wrong, please try again later." };
  }
};

export const checkDeviceHealth = async (deviceId: string) => {
  try {
    // First get the device to find its API URI
    const device = await prisma.biometricDevice.findUnique({
      where: { deviceId },
    });

    if (!device || !device.apiUri) {
      return { error: "Device not found or no API URI configured" };
    }

    // Construct health check URL
    const healthUrl = device.apiUri.endsWith("/")
      ? `${device.apiUri}health`
      : `${device.apiUri}/health`;

    console.log(`Checking health for device ${deviceId} at: ${healthUrl}`);

    // Call health endpoint with timeout
    const response = await fetch(healthUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (response.ok) {
      const data = await response.json();

      // Check if response indicates healthy status
      if (data.status === "ok" && data.service) {
        // Update device status to ONLINE
        await prisma.biometricDevice.update({
          where: { id: device.id },
          data: {
            status: "ONLINE",
            lastSync: new Date(),
          },
        });

        return {
          success: "Device is online",
          status: "ONLINE",
          lastSync: new Date(),
        };
      }
    }

    // If we get here, device is not responding properly
    await prisma.biometricDevice.update({
      where: { id: device.id },
      data: { status: "OFFLINE" },
    });

    return {
      success: "Device is offline",
      status: "OFFLINE",
    };
  } catch (error: any) {
    console.log(`Health check failed for device ${deviceId}:`, error);

    // Update device status to OFFLINE on any error
    try {
      const device = await prisma.biometricDevice.findUnique({
        where: { deviceId },
      });

      if (device) {
        await prisma.biometricDevice.update({
          where: { id: device.id },
          data: { status: "OFFLINE" },
        });
      }
    } catch (updateError) {
      console.log("Failed to update device status:", updateError);
    }

    // Handle different error types
    if (error.name === "AbortError") {
      return { error: "Device health check timed out", status: "OFFLINE" };
    }

    return {
      error: "Device is offline or unreachable",
      status: "OFFLINE",
    };
  }
};

export const checkAllDevicesHealth = async () => {
  try {
    const devices = await prisma.biometricDevice.findMany({
      where: {
        apiUri: { not: null },
      },
    });

    const results = [];

    for (const device of devices) {
      const result = await checkDeviceHealth(device.deviceId);
      results.push({
        deviceId: device.deviceId,
        name: device.name,
        ...result,
      });
    }

    return {
      success: `Checked ${devices.length} devices`,
      results,
    };
  } catch (error: any) {
    console.log("Failed to check all devices health:", error);
    return { error: "Failed to check device health" };
  }
};

export const deleteBiometricDevice = async (id: number) => {
  try {
    await prisma.biometricDevice.delete({
      where: {
        id,
      },
    });

    return { success: "Biometric device has been successfully deleted!" };
  } catch (error: any) {
    console.log("Error deleting biometric device:", error);
    return { error: "Something went wrong, please try again later." };
  }
};

export const getPaginatedBiometricDevices = async (
  search?: string,
  page: number = 0,
  limit: number = 10,
) => {
  const skip = page * limit;

  const where = search
    ? {
        OR: [
          { deviceId: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  try {
    const [devices, totalCount] = await Promise.all([
      prisma.biometricDevice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.biometricDevice.count({ where }),
    ]);

    // Automatically check health for devices with API URI
    const devicesWithHealthCheck = await Promise.all(
      devices.map(async (device) => {
        if (device.apiUri) {
          try {
            // Construct health check URL
            const healthUrl = device.apiUri.endsWith("/")
              ? `${device.apiUri}health`
              : `${device.apiUri}/health`;

            // Quick health check with 3 second timeout
            const response = await fetch(healthUrl, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(3000),
            });

            // Check if response is successful (status 200-299)
            if (response.ok) {
              const data = await response.json();

              // Update status if device is healthy
              if (data.status === "ok" && data.service) {
                await prisma.biometricDevice.update({
                  where: { id: device.id },
                  data: {
                    status: "ONLINE",
                    lastSync: new Date(),
                  },
                });

                return { ...device, status: "ONLINE", lastSync: new Date() };
              } else {
                // Response ok but invalid JSON structure
                console.log(
                  `Device ${device.deviceId} returned invalid response:`,
                  data,
                );
                await prisma.biometricDevice.update({
                  where: { id: device.id },
                  data: { status: "OFFLINE" },
                });

                return { ...device, status: "OFFLINE" };
              }
            } else {
              // Non-200 status means device is offline (includes Cloudflare errors)
              console.log(
                `Device ${device.deviceId} returned status ${response.status}`,
              );
              await prisma.biometricDevice.update({
                where: { id: device.id },
                data: { status: "OFFLINE" },
              });

              return { ...device, status: "OFFLINE" };
            }
          } catch (error) {
            // Device is offline, update status
            await prisma.biometricDevice.update({
              where: { id: device.id },
              data: { status: "OFFLINE" },
            });
          }
        }

        return device;
      }),
    );

    return {
      items: devicesWithHealthCheck,
      totalCount,
      pageSize: limit,
      page,
      pageRange: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.log("Error fetching biometric devices:", error);
    return {
      items: [],
      totalCount: 0,
      pageSize: limit,
      page,
      pageRange: 0,
    };
  }
};
