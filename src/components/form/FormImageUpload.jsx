"use client";
import { Trash2 } from "lucide-react";
import { Controller } from "react-hook-form";

const FormImageUpload = ({ name, control, label, className = "" }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleFileChange = (event) => {
          const file = event.target.files[0];
          if (file) {
            onChange(file);
          }
        };

        const handleRemoveFile = () => {
          onChange(null);
          const fileInput = document.getElementById(`${name}-upload`);
          if (fileInput) {
            fileInput.value = "";
          }
        };

        return (
          <div className={`space-y-2 ${className}`}>
            {label && <label className="text-sm font-medium text-black flex leading-none mb-2">{label}</label>}
            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                id={`${name}-upload`}
                accept="image/jpg,image/jpeg,image/webp,image/png,image/gif,image/svg,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                className={`w-40 h-40 bg-white rounded-[14px] flex items-center justify-center cursor-pointer group ${
                  value ? "border-0" : "border-2 border-dashed border-[#D9D9D9] hover:border-green-300 hover:bg-white"
                }`}
                onClick={() => document.getElementById(`${name}-upload`).click()}
              >
                {value ? (
                  <div className="relative w-full h-full">
                    <img src={URL.createObjectURL(value)} alt="Uploaded preview" className="w-full h-full object-cover rounded-[14px]" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="absolute bottom-2 right-2 bg-red-500 text-white border border-red-500 rounded-full p-1.5 hover:bg-red-600 hover:border-red-600 shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-[14px] flex items-center justify-center group-hover:bg-green-50 group-hover:border-green-200">
                      <svg className="w-8 h-8 text-gray-400 group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-800">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
            </div>
          </div>
        );
      }}
    />
  );
};

export default FormImageUpload;
