import { Link } from "react-router-dom";
export default function CourseCard({ course }) { return <article className="card"><h3>{course.title}</h3><p>{course.description}</p><Link to={`/courses/${course.id}`}>View course</Link></article>; }

