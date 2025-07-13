import { CircularProgress } from "@mui/material";
import React from "react";

function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-row gap-4 text-[var(--accent)]">
        <CircularProgress size={24} />
        Loading...
      </div>
    </div>
  );
}

export default Loading;
