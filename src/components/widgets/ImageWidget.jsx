"use client";
import Image from "next/image";

const ImageWidget = ({ children, src, ...props }) => {
  return (
    <Image {...props} src={src} alt={src.src ? src.src : src} width={1500} height={1500} priority={true}>
      {children}
    </Image>
  );
};
export default ImageWidget;
