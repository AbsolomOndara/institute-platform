import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardShell from "../../components/common/DashboardShell";
import * as admin from "../../services/adminService";
export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    admin.dashboard().then((r) => setStats(r.data.stats));
    admin.messages().then((r) => setMessages(r.data.messages));
  }, []);
  return (
    <DashboardShell title="Administration centre">
      <section className="dashboard-welcome admin-welcome">
        <div>
          <p className="eyebrow">Institute operations</p>
          <h2>Everything that needs attention, in one place.</h2>
          <p>
            Approve enrollments, manage users, oversee course delivery and
            monitor incoming enquiries.
          </p>
        </div>
        <Link className="button" to="/admin/enrollments">
          Review {stats.pending || 0} pending
        </Link>
      </section>
      <div className="stat-grid admin-stats">
        {[
          ["Students", stats.students],
          ["Tutors", stats.tutors],
          ["Courses", stats.courses],
          ["Pending approvals", stats.pending],
          ["Active enrollments", stats.active],
          ["New enquiries", stats.messages],
        ].map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value ?? "—"}</strong>
          </article>
        ))}
      </div>
      <div className="dashboard-columns">
        <section className="panel">
          <div className="panel-heading">
            <h2>Recent enquiries</h2>
            <span>Latest messages</span>
          </div>
          {messages.slice(0, 5).map((m) => (
            <div className="list-row" key={m.id}>
              <div>
                <strong>
                  {m.name} — {m.subject || "General enquiry"}
                </strong>
                <small>
                  {m.email} · {new Date(m.createdAt).toLocaleDateString()}
                </small>
              </div>
              <span className="status status-new">{m.status}</span>
            </div>
          ))}
          {!messages.length && <p>No enquiries have been received.</p>}
        </section>
        <aside className="panel dashboard-side">
          <h2>Administration</h2>
          <Link to="/admin/enrollments">
            <b>Enrollment queue</b>
            <span>Verify payment messages and approve access</span>
          </Link>
          <Link to="/admin/tutors">
            <b>Tutor accounts</b>
            <span>Create, suspend or remove tutors</span>
          </Link>
          <Link to="/admin/courses">
            <b>Academic programs</b>
            <span>Assign tutors and manage content</span>
          </Link>
          <Link to="/library">
            <b>Digital library</b>
            <span>Publish or remove e-books</span>
          </Link>
        </aside>
      </div>
    </DashboardShell>
  );
}
