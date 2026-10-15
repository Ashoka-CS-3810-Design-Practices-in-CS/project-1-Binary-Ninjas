"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/global/app-sidebar";
import { useSidebar } from "@/components/ui/sidebar";

export default function SidebarWrapper() {
  const pathname = usePathname();
  const { setOpen } = useSidebar();

  // Start hidden on the home page only. After that, only the icon controls it.
  useEffect(() => {
    if (pathname === "/") {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <AppSidebar />;
}