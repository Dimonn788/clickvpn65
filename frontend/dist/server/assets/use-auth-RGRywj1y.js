import { useState, useEffect } from "react";
import { h as getUserSession } from "./router-D8SmVkh3.js";
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUserSession().then((result) => {
      setUser(result ?? null);
    }).catch(() => {
      setUser(null);
    }).finally(() => setLoading(false));
  }, []);
  return { user, loading };
}
export {
  useAuth as u
};
