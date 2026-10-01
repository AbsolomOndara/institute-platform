import { useEffect, useState } from "react";
import DashboardShell, { Notice, StatusBadge } from "../../components/common/DashboardShell";
import { listCourses, myEnrollments, requestEnrollment } from "../../services/courseService";

export default function CourseCatalogue() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  async function load() {
    const [courseResponse, enrollmentResponse] = await Promise.all([listCourses(), myEnrollments()]);
    setCourses(courseResponse.data.courses);
    setEnrollments(enrollmentResponse.data.enrollments);
  }
  useEffect(() => { load().catch(() => setError("The course catalogue could not be loaded.")); }, []);
  async function enroll(courseId) {
    setBusyId(courseId); setNotice(""); setError("");
    try { await requestEnrollment(courseId); await load(); setNotice("Enrollment requested. Course access will remain pending until an administrator approves it."); }
    catch (e) { setError(e.response?.data?.message || "The enrollment request could not be submitted."); }
    finally { setBusyId(null); }
  }
  const enrollmentFor = id => enrollments.find(item => item.courseId === id);
  return <DashboardShell title="Course catalogue"><Notice>{notice}</Notice>{error&&<Notice type="error">{error}</Notice>}<div className="portal-cards">{courses.map(course=>{const enrollment=enrollmentFor(course.id);return <article className="portal-card" key={course.id}>{enrollment&&<StatusBadge status={enrollment.status}/>}<h2>{course.title}</h2><p>{course.description}</p><div className="card-meta">{course.level&&<span>{course.level}</span>}{course.duration&&<span>{course.duration}</span>}<span>{course.deliveryMode}</span></div>{enrollment?<p className="muted">{enrollment.status==="PENDING"?"Awaiting administrative verification.":enrollment.status==="ACTIVE"?"This course is active in My courses.":`Enrollment status: ${enrollment.status.toLowerCase()}.`}</p>:<button disabled={busyId===course.id} onClick={()=>enroll(course.id)}>{busyId===course.id?"Requesting…":"Request enrollment"}</button>}</article>})}</div>{!courses.length&&!error&&<div className="empty-state"><h2>No published courses</h2><p>Published programs will appear here when admissions opens them.</p></div>}</DashboardShell>;
}
