"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";
import ButtonWidget from "./ButtonWidget";

const FileWidget = ({
  accept = ".csv,.xlsx,.xls",
  buttonText = "Select File",
  onFileSelect,
  showFileInfo = false,
  className = "",
  buttonClassName = "bg-black hover:bg-black/80 text-white px-6 py-3",
  disabled = false,
  ...props
}) => {
  const fileInputRef = useRef(null);

  const handleSelectFileClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className={className}>
      <ButtonWidget type="button" className={buttonClassName} onClick={handleSelectFileClick} disabled={disabled} {...props}>
        <Upload className="w-4 h-4 mr-2" />
        {buttonText}
      </ButtonWidget>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
    </div>
  );
};

export default FileWidget;
