import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function RoleRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading) return <main className="container">Loading…</main>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

