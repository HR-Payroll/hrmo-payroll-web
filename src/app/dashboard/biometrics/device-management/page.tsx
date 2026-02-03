import React from "react";
import { revalidatePath } from "next/cache";
import { getPaginatedBiometricDevices } from "@/actions/biometricDevice";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import AddButton from "@/components/AddButton";
import BiometricDeviceTable from "@/components/tables/BiometricDeviceTable";

const DeviceManagement = async (props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) => {
  const params = await props.searchParams;
  const { search, page, limit } = params as any;

  let isLoading = true;
  const devices = (await getPaginatedBiometricDevices(
    search,
    Number(page || 0),
    Number(limit || 10),
  )) as any;
  isLoading = false;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/biometrics/device-management");
  }

  return (
    <div className="container">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Device Management"
          info="Manage your biometric devices in this page. You can add, edit, or delete device details here."
        />
      </header>

      <main className="space-y-4">
        <section className="flex flex-col md:flex-row items-center justify-between gap-4">
          <TableSearch />
          <div className="flex items-center gap-4">
            <AddButton
              table="biometric-device"
              title="Add Device"
              reload={reload}
            />
          </div>
        </section>

        <section>
          <BiometricDeviceTable
            devices={devices.items}
            reload={reload}
            isLoading={isLoading}
            limit={devices.pageSize}
            rowCount={devices.pageRange}
            page={devices.page}
          />
        </section>
      </main>
    </div>
  );
};

export default DeviceManagement;
