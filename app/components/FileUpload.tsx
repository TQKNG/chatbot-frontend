import React from "react";

const FileUpload = () => {
  return (
    <>
      <label className="form-control w-full max-w-xs">
        <input
          type="file"
          className="file-input file-input-sm file-input-ghost w-full max-w-xs"
        />
      </label>
    </>
  );
};

export default FileUpload;
