import * as XLSX from "xlsx";
import { utcToPH } from "./dateFormatter";

export type MinimalAccessRow = {
  recordNo: string;
  name: string;
  timestamp: string;
};

const normalize = (v: unknown): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || s === "-") return null;
  return s;
};

const addDaysIsoDate = (isoDate: string, days: number): string => {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const yy = String(dt.getFullYear()).padStart(4, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
};

const parseTimeToSeconds = (time: string | null): number | null => {
  if (!time) return null;
  const m = time.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  const ss = Number(m[3] ?? "0");
  return hh * 3600 + mm * 60 + ss;
};

const normalizeDate = (v: unknown): string | null => {
  if (!v) return null;

  if (v instanceof Date) return v.toISOString().slice(0, 10);

  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

const normalizeTime = (v: unknown): string | null => {
  const s = normalize(v);
  if (!s) return null;

  // Already HH:MM:SS
  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;

  return s;
};

const combineDateTime = (
  date: string | null,
  time: string | null,
): Date | null => {
  if (!date) return null;
  const iso = time ? `${date}T${time}` : `${date}T00:00:00`;
  const dt = new Date(iso);
  return isNaN(dt.getTime()) ? null : dt;
};

const pushTimestamp = (
  rows: MinimalAccessRow[],
  personId: string,
  name: string,
  dt: Date | null,
) => {
  if (!dt) return;
  if (isNaN(dt.getTime())) return;
  rows.push({ recordNo: personId, name, timestamp: dt.toISOString() });
};

export function parseMinimalAccessWorkbook(
  data: Uint8Array,
): MinimalAccessRow[] {
  const wb = XLSX.read(data, { type: "array", cellDates: true });
  const rows: MinimalAccessRow[] = [];

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) continue;

    const table = XLSX.utils.sheet_to_json<any[]>(sheet, {
      header: 1,
      defval: null,
      blankrows: false,
    });

    // Data starts at row 6 -> index 5
    for (let r = 3; r < table.length; r++) {
      const row = table[r];
      if (!row?.length) continue;

      const personId = normalize(row[1]);
      const name = normalize(row[2]);

      // skip blank rows
      if (!personId && !name) continue;

      if (!personId || !name) continue;

      const date = normalizeDate(row[6]);
      const firstIn = normalizeTime(row[9]);
      const lastOut = normalizeTime(row[10]);

      if (!firstIn && !lastOut) continue;

      if (!date) continue;

      // Handle missing punches
      // - Only firstIn: treat as a full-day record starting 00:00:00 and ending at firstIn
      // - Only lastOut: treat as a full-day record starting at lastOut and ending 23:59:59
      if (firstIn && !lastOut) {
        const startAtFirstIn = combineDateTime(date, firstIn);
        const endOfDay = combineDateTime(date, "23:59:59");
        pushTimestamp(rows, personId, name, startAtFirstIn);
        pushTimestamp(rows, personId, name, endOfDay);
        continue;
      }

      if (!firstIn && lastOut) {
        const startOfDay = combineDateTime(date, "00:00:00");
        const endOfLastOut = combineDateTime(date, lastOut);
        pushTimestamp(rows, personId, name, startOfDay);
        pushTimestamp(rows, personId, name, endOfLastOut);
        continue;
      }

      const firstInSec = parseTimeToSeconds(firstIn);
      const lastOutSec = parseTimeToSeconds(lastOut);

      const isOvernight =
        firstInSec !== null && lastOutSec !== null && firstInSec > lastOutSec;

      const firstInDateTime = combineDateTime(date, firstIn);
      pushTimestamp(rows, personId, name, firstInDateTime);

      if (isOvernight) {
        const endOfDay = combineDateTime(date, "23:59:59");
        pushTimestamp(rows, personId, name, endOfDay);

        const nextDate = addDaysIsoDate(date, 1);
        const startOfNextDay = combineDateTime(nextDate, "00:00:00");
        pushTimestamp(rows, personId, name, startOfNextDay);

        const lastOutNextDay = combineDateTime(nextDate, lastOut);
        pushTimestamp(rows, personId, name, lastOutNextDay);
      } else {
        const lastOutDateTime = combineDateTime(date, lastOut);
        pushTimestamp(rows, personId, name, lastOutDateTime);
      }
    }
  }

  return rows;
}
