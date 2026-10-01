import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import RoleRoute from "./components/auth/RoleRoute";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Courses from "./pages/public/Courses";
import CourseDetails from "./pages/public/CourseDetails";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import CourseCatalogue from "./pages/student/CourseCatalogue";
import LearnCourse from "./pages/student/LearnCourse";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorCourses from "./pages/tutor/TutorCourses";
import ManageCourse from "./pages/tutor/ManageCourse";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTutors from "./pages/admin/ManageTutors";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageEnrollments from "./pages/admin/ManageEnrollments";
import NotFound from "./pages/public/NotFound";
import AccountSettings from "./pages/AccountSettings";
import Admissions from "./pages/public/Admissions";
import FAQ from "./pages/public/FAQ";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";

export default function App() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} /><Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} /><Route path="/courses/:courseId" element={<CourseDetails />} />
      <Route path="/contact" element={<Contact />} /><Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admissions" element={<Admissions />} /><Route path="/faq" element={<FAQ />} />
      <Route path="/privacy" element={<Privacy />} /><Route path="/terms" element={<Terms />} />
    </Route>
    <Route element={<RoleRoute roles={["STUDENT"]} />}>
      <Route path="/student" element={<StudentDashboard />} /><Route path="/student/catalogue" element={<CourseCatalogue />} /><Route path="/student/courses" element={<MyCourses />} />
      <Route path="/student/courses/:courseId" element={<LearnCourse />} />
    </Route>
    <Route element={<RoleRoute roles={["TUTOR"]} />}>
      <Route path="/tutor" element={<TutorDashboard />} /><Route path="/tutor/courses" element={<TutorCourses />} />
      <Route path="/tutor/courses/:courseId/manage" element={<ManageCourse />} />
    </Route>
    <Route element={<RoleRoute roles={["ADMIN"]} />}>
      <Route path="/admin" element={<AdminDashboard />} /><Route path="/admin/students" element={<ManageStudents />} />
      <Route path="/admin/tutors" element={<ManageTutors />} /><Route path="/admin/courses" element={<ManageCourses />} />
      <Route path="/admin/enrollments" element={<ManageEnrollments />} />
    </Route>
    <Route element={<RoleRoute roles={["STUDENT", "TUTOR", "ADMIN"]} />}><Route path="/account" element={<AccountSettings />} /></Route>
    <Route path="/dashboard" element={<Navigate to="/login" replace />} /><Route path="*" element={<NotFound />} />
  </Routes>;
}
