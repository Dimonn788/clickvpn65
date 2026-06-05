import { useEffect, useState } from "react";
import { getUserSession } from "@/lib/api/auth.functions";
import type { AuthUser } from "@/lib/api/auth.functions";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserSession()
      .then((result) => {
        setUser(result ?? null);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
