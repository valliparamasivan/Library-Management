"use client";

import { Info, Trash2, Upload, Camera, X, SquarePen } from "lucide-react";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const ImageUploadWidget = ({
  name,
  label = "Upload Image",
  accept = "image/jpg,image/jpeg,image/webp,image/png,image/gif,image/svg,image/avif",
  onFileChange,
  selectedFile = null,
  className = "",
  containerClassName = "",
  showFileInfo = true,
  maxFileSize = "25M",
  disabled = false,
  required = false,
  error = null,
  description = "Accepted Filetypes are jpg, webp, png, gif, svg, and avif. The maximum upload size allowed is 25M.",
  variant = "default",
  height = "h-48",
  width = "w-full",
  text = "Click to upload or drag and drop",
  descriptionBottom = false,
}) => {
  const [preview, setPreview] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    if (selectedFile && selectedFile instanceof File) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      setFileInfo({
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(0) + "kb",
      });
    } else if (selectedFile && typeof selectedFile === 'string') {
      // Handle existing image URL
      setPreview(selectedFile);
      setFileInfo({
        name: "Current image",
        size: "",
      });
    } else if (!selectedFile) {
      setPreview(null);
      setFileInfo(null);
    }
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(0) + "kb",
      });
      if (onFileChange) {
        onFileChange(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setPreview(null);
    setFileInfo(null);
    const fileInput = document.getElementById(`${name}-upload`);
    if (fileInput) {
      fileInput.value = "";
    }
    if (onFileChange) {
      onFileChange(null);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      document.getElementById(`${name}-upload`).click();
    }
  };

  const hasFile = preview || selectedFile;

  return (
    <div className={`${containerClassName}`}>
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        {label && (
          <div className="mb-3">
            <label className="text-sm font-semibold text-gray-900 flex items-center leading-none">
              {label}
              {/* {required && <span className="text-red-600 ml-1">*</span>}
              {descriptionBottom && description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 text-blue-500 hover:text-blue-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">{description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )} */}
            </label>
          </div>
        )}

        <div className="relative">
          <input type="file" id={`${name}-upload`} accept={accept} onChange={handleFileChange} className="hidden" disabled={disabled} />

          {hasFile ? (
            <div className="space-y-2">
              <div
                className={` ${width} h-32 ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${error ? "border-red-500" : ""}
            ${className}
          
          relative  rounded-lg overflow-hidden bg-white`}
              >
                <img src={preview || (selectedFile instanceof File ? URL.createObjectURL(selectedFile) : selectedFile)} alt="Preview" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center justify-start gap-2">
                <button
                  type="button"
                  onClick={handleClick}
                  className="w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                  disabled={disabled}
                  title="Edit image"
                >
                  <SquarePen className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              {/* <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src={preview || (selectedFile instanceof File ? URL.createObjectURL(selectedFile) : selectedFile)}
                    alt="File preview"
                    className="w-10 h-10 object-cover rounded border border-gray-200"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-900 font-bold">
                      {fileInfo?.name || (selectedFile instanceof File ? selectedFile.name : "Selected file")}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {fileInfo?.size || (selectedFile instanceof File ? (selectedFile.size / 1024).toFixed(0) + "kb" : "")}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors border border-2 border-[#858585]"
                  disabled={disabled}
                >
                  <X className="h-3.5 w-3.5 text-[#858585]" />
                </button>
              </div> */}
            </div>
          ) : (
            <div className="space-y-2">
              <div
                className={`
                 ${width} h-32 border-2 border-dashed rounded-lg mt-3
                  flex items-center justify-center cursor-pointer transition-colors
                  border-gray-300 bg-gray-50
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                  ${error ? "border-red-300 bg-red-50" : ""}
                `}
                onClick={handleClick}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              {!descriptionBottom && description && (
                <p className="text-xs text-gray-500 text-start">{description}</p>
              )}
            </div>
          )}
          {descriptionBottom && description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadWidget;
