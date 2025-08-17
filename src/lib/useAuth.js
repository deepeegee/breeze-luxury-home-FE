"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading,      setIsLoading]      = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        console.log("🔒 Client-side: verifying session with server…");
        const res = await fetch("/api/admins/me", {
          method: "GET",
          credentials: "include", // send cookies
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          console.log(`🔒 No valid session (status ${res.status}), redirecting to login`);
          if (pathname !== "/login") {
            const dest = `/login${pathname ? `?from=${encodeURIComponent(pathname)}` : ""}`;
            router.replace(dest);
          }
          if (!cancelled) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        // If your API returns user data, you can read it (not strictly required)
        await res.json().catch(() => ({}));
        if (!cancelled) {
          console.log("🔒 Session OK");
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.log("🔒 Error verifying session:", err);
        if (pathname !== "/login") {
          const dest = `/login${pathname ? `?from=${encodeURIComponent(pathname)}` : ""}`;
          router.replace(dest);
        }
        if (!cancelled) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    }

    checkAuth();
    return () => { cancelled = true; };
  }, [router, pathname]);

  return { isAuthenticated, isLoading };
};