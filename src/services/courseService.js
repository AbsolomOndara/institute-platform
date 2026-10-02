import api from "./api";
export const listCourses = () => api.get("/courses");
export const getCourse = (id) => api.get(`/courses/${id}`);
export const requestEnrollment = (id, paymentReference) => api.post(`/courses/${id}/enroll`, { paymentReference });
export const myEnrollments = () => api.get("/student/enrollments");
export const learningCourse = (id) => api.get(`/student/courses/${id}`);
export const completeLesson = (courseId, lessonId) => api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
export const startAssessment=(courseId,id)=>api.post(`/student/courses/${courseId}/assessments/${id}/start`);
export const submitAssessment=(courseId,id,answers)=>api.post(`/student/courses/${courseId}/assessments/${id}/submit`,{answers});
