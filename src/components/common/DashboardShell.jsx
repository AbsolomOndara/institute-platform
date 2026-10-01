import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = {
  STUDENT: [["/student", "Overview"], ["/student/catalogue", "Course catalogue"], ["/student/courses", "My courses"]],
  TUTOR: [["/tutor", "Overview"], ["/tutor/courses", "Assigned courses"]],
  ADMIN: [["/admin", "Overview"], ["/admin/students", "Students"], ["/admin/tutors", "Tutors"], ["/admin/courses", "Courses"], ["/admin/enrollments", "Enrollments"]],
};

export default function DashboardShell({ title, children, actions }) {
  const { user, signOut } = useAuth(); const navigate = useNavigate();
  async function logout() { await signOut(); navigate("/login"); }
  return <div className="portal">
    <aside className="sidebar"><Link className="portal-brand" to="/">ICSF</Link><p>{user.role.toLowerCase()} portal</p><nav className="portal-nav">{links[user.role].map(([to, label]) => <NavLink key={to} end={to.split("/").length === 2} to={to}>{label}</NavLink>)}<NavLink to="/account">Account settings</NavLink></nav><button className="quiet-button" onClick={logout}>Sign out</button></aside>
    <div className="portal-main"><header className="portal-header"><div><span>Welcome, {user.name}</span><h1>{title}</h1></div>{actions}</header>{children}</div>
  </div>;
}

export function StatusBadge({ status }) { return <span className={`status status-${status.toLowerCase()}`}>{status.replaceAll("_", " ")}</span>; }
export function Notice({ children, type = "success" }) { return children ? <p className={`notice ${type}`}>{children}</p> : null; }
