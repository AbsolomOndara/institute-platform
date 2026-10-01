import api from "./api";
export const listCourses = () => api.get("/courses");
export const getCourse = (id) => api.get(`/courses/${id}`);
export const requestEnrollment = (id) => api.post(`/courses/${id}/enroll`);
export const myEnrollments = () => api.get("/student/enrollments");
export const learningCourse = (id) => api.get(`/student/courses/${id}`);
export const completeLesson = (courseId, lessonId) => api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
