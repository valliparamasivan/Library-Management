"use client";
import Link from "next/link";

const LinkWidget = ({ children, ...props }) => {
  return <Link {...props}>{children}</Link>;
};
export default LinkWidget;
