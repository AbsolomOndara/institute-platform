import { createContext, useContext, useEffect, useState } from "react";
import * as auth from "../services/authService";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { auth.getCurrentUser().then(r => setUser(r.data.user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const signIn = async data => { const r = await auth.login(data); setUser(r.data.user); return r.data.user; };
  const signOut = async () => { await auth.logout(); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

