"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to the very top-left of the page on route/pathname change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
