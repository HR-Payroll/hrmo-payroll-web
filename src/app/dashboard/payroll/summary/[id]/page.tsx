import React from "react";
import PageInfo from "@/components/PageInfo";
import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";
import DynamicHeader from "@/components/ui/DynamicHeader";
import DateFilter from "@/components/DateFilter";
import DownloadButton from "@/components/DownloadButton";
import ViewSummary from "@/components/tables/ViewSummary";
import { getSummaryById } from "@/data/payroll";
import { dateQuery } from "@/utils/dateFormatter";
import BackButton from "@/components/ui/BackButton";

const SingleSummaryPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: Promise<{
    from?: string;
    to?: string;
  }>;
}) => {
  const slug = (await params) as any;
  const query = (await searchParams) as any;
  const id = slug.id;
  const from = query.from;
  const to = query.to;

  const { dateFrom, dateTo } = dateQuery(from, to);

  const summary = (await getSummaryById(id, dateFrom, dateTo)) as any;

  return (
    <div className="card gap-4 m-4 mt-10 md:mt-0">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Summary"
          info="Manage your company’s employee reports in this page. You can view employee date and time records here."
        />
      </header>

      <main className="space-y-4">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BackButton to={`/dashboard/payroll/summary`} />
            <DynamicHeader
              label={
                summary
                  ? summary.name.ref
                    ? summary.name.name
                    : `${summary.name.name} (no ref)`
                  : "N/A"
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <DateFilter from={dateFrom} />
            <DownloadButton />
          </div>
        </section>

        <section>
          <ViewSummary summary={summary.items} />
        </section>
      </main>
    </div>
  );
};

export default SingleSummaryPage;
