import React, {useRef} from "react";

interface FileUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  fileInputRef: React.RefObject<HTMLInputElement>; // Specify the ref type
}

const FileUpload:React.FC<FileUploadProps> = ({onFileUpload, fileInputRef}) => {
  

  return (
    <>
      <label className="form-control w-full max-w-xs">
        <input
          ref={fileInputRef}
          onChange={onFileUpload}
          type="file"
          className="hidden"
        />
      </label>
    </>
  );
};

export default FileUpload;
