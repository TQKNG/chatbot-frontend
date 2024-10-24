import React from "react";

interface FileUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}
const FileUpload:React.FC<FileUploadProps> = ({onFileUpload}) => {
  return (
    <>
      <label className="form-control w-full max-w-xs">
        <input
          onChange={onFileUpload}
          type="file"
          className="file-input file-input-sm file-input-ghost w-full max-w-xs"
        />
      </label>
    </>
  );
};

export default FileUpload;
