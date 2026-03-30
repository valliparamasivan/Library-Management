"use client";

import { cn } from "@/lib/utils";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

const InfoQRCodeWidget = ({
  value = "",
  size = 200,
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
      {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />}

      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default InfoQRCodeWidget;
