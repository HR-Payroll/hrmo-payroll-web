import React from "react";
import { MdOutlineUploadFile } from "react-icons/md";

const UploadButton = () => {
  return (
    <div className="flex flex-row rounded-md bg-[#ECEEF6] gap-1 py-2 px-6 text-[#333333]">
      <span className="text-base">
        <MdOutlineUploadFile />
      </span>
      <button className="hidden lg:block text-xs">Upload File</button>
    </div>
  );
};

export default UploadButton;
