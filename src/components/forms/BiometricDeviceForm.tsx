"use client";
import React, { useState, useEffect } from "react";
import {
  createBiometricDevice,
  updateBiometricDevice,
} from "@/actions/biometricDevice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Button from "../ui/Button";
import { z } from "zod";

const BiometricDeviceSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
  deviceName: z.string().min(1, "Device name is required"),
  location: z.string().min(1, "Location is required"),
  apiUri: z
    .string()
    .url("Please enter a valid API URI")
    .optional()
    .or(z.literal("")),
});

const BiometricDeviceForm = ({
  data,
  onClose,
  setSnackbar,
  editMode = false,
}: {
  data?: any;
  onClose: Function;
  setSnackbar: Function;
  editMode?: boolean;
}) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof BiometricDeviceSchema>>({
    resolver: zodResolver(BiometricDeviceSchema),
    defaultValues: {
      deviceId: "",
      deviceName: "",
      location: "",
      apiUri: "",
    },
  });

  useEffect(() => {
    if (editMode && data) {
      reset({
        deviceId: data.deviceId || "",
        deviceName: data.name || "",
        location: data.location || "",
        apiUri: data.apiUri || "",
      });
    }
  }, [editMode, data, reset]);

  const onSubmit = async (formData: z.infer<typeof BiometricDeviceSchema>) => {
    setServerError(null);
    setIsAdding(true);

    try {
      let result;
      if (editMode && data) {
        // Update existing device
        result = await updateBiometricDevice(data.id, {
          deviceId: formData.deviceId,
          name: formData.deviceName,
          location: formData.location,
        });
      } else {
        // Create new device
        result = await createBiometricDevice(formData);
      }

      setIsAdding(false);

      if (result && result.error) {
        return setSnackbar({
          message: result.error,
          type: "error",
          modal: true,
        });
      }

      setSnackbar({
        message: result.success,
        type: "success",
        modal: true,
      });
      onClose();
    } catch (error: any) {
      setSnackbar({
        message: error.message || "Failed to save biometric device",
        type: "error",
        modal: true,
      });
      setIsAdding(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 p-4 text-[var(--text)]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-center text-base font-semibold">
        {editMode ? "Edit Biometric Device" : "Add Biometric Device"}
      </h1>

      <InputField
        label="Device ID"
        name="deviceId"
        defaultValue={data?.deviceId}
        register={register}
        error={errors?.deviceId}
      />

      <InputField
        label="Device Name"
        name="deviceName"
        defaultValue={data?.deviceName}
        register={register}
        error={errors?.deviceName}
      />

      <InputField
        label="Location"
        name="location"
        defaultValue={data?.location}
        register={register}
        error={errors?.location}
      />

      <InputField
        label="API URI"
        name="apiUri"
        type="url"
        defaultValue={data?.apiUri}
        register={register}
        error={errors?.apiUri}
        inputProps={{ placeholder: "http://localhost:8080/api" }}
      />

      <div className="mt-4">
        <Button
          label={
            isAdding
              ? editMode
                ? "Updating..."
                : "Creating..."
              : editMode
                ? "Update"
                : "Create"
          }
          type="submit"
          isLoading={isAdding}
        />
      </div>

      {serverError && <p className="text-[var(--error)]">{serverError}</p>}
    </form>
  );
};

export default BiometricDeviceForm;
