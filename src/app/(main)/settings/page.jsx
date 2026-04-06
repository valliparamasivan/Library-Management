"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import usePermissions from "@/components/custom-hooks/usePermissions";

const SETTINGS_TABS = [
  { href: "/settings/policy", permissions: ["Policy", "Settings"] },
  { href: "/settings/roles", permissions: ["Roles", "Roles & Permissions", "Settings"] },
  { href: "/settings/employees", permissions: ["Employees", "Settings"] },
  { href: "/settings/location", permissions: ["Location", "Settings"] },
];

const SettingsPage = () => {
  const router = useRouter();
  const { permissions, canAnyView, isLoading } = usePermissions();

  useEffect(() => {
    if (isLoading) return;

    if (permissions.length === 0) {
      router.replace("/settings/policy");
      return;
    }

    const firstAllowed = SETTINGS_TABS.find((tab) => canAnyView(tab.permissions));
    router.replace(firstAllowed ? firstAllowed.href : "/settings/policy");
  }, [permissions, isLoading, canAnyView, router]);

  return null;
};

export default SettingsPage;
