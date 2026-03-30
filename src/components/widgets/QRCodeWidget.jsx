"use client";

import { cn } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

const QRCodeWidget = ({
  value = "",
  size = 100,
  margin = 1,
  color = {
    dark: "#000000",
    light: "#FFFFFF",
  },
  errorCorrectionLevel = "M",
  type = "image/png",
  quality = 0.92,
  className = "",
  style = {},
  onError = null,
  companyName = "",
  tagName = "",
  serialCode = "",
  showLogo = true,
  labelWidth = 400,
  labelHeight = 100,
  ...props
}) => {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;

    const generateQR = async () => {
      try {
        setError(null);

        const options = {
          width: size,
          margin: margin,
          color: color,
          errorCorrectionLevel: errorCorrectionLevel,
          type: type,
          quality: quality,
          ...props,
        };

        const dataUrl = await QRCode.toDataURL(value, options);
        setQrDataUrl(dataUrl);
      } catch (err) {
        const errorMessage = `QR code generation failed: ${err.message}`;
        setError(errorMessage);
        if (onError) {
          onError(err);
        }
      }
    };

    generateQR();
  }, [value, size, margin, color, errorCorrectionLevel, type, quality, onError, props]);

  if (error) {
    return (
      <div className={cn("flex items-center justify-center p-4 border border-red-200 rounded-md bg-red-50 text-red-600", className)} style={style}>
        <div className="text-center">
          <p className="text-sm font-medium">QR Code Error</p>
          <p className="text-xs text-red-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!value) {
    return (
      <div className={cn("flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50 text-gray-500", className)} style={style}>
        <p className="text-sm">No value provided</p>
      </div>
    );
  }

  return (
    <div className={cn("inline-block", className)} style={style}>
      <div className="border border-black bg-white fit-content flex items-center" style={{ width: labelWidth }}>
        <div className="shrink-0 mr-3">
          {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" style={{ maxWidth: "60px", maxHeight: "60px" }} />}
        </div>

        <div className="flex-1 flex flex-col justify-center  text-left">
          <div className="text-md font-bold text-black">{companyName}</div>
          {tagName && <div className="text-sm  text-black">{tagName}</div>}
          {serialCode && <div className="text-sm text-black">{serialCode}</div>}
        </div>
      </div>

      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default QRCodeWidget;
