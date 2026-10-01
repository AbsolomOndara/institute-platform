import api from "./api";
export const courses = () => api.get("/tutor/courses");
export const students = id => api.get(`/tutor/courses/${id}/students`);
export const addModule = (courseId, title) => api.post(`/tutor/courses/${courseId}/modules`, { title });
export const deleteModule = (courseId, moduleId) => api.delete(`/tutor/courses/${courseId}/modules/${moduleId}`);
export const addLesson = (courseId, moduleId, data) => api.post(`/tutor/courses/${courseId}/modules/${moduleId}/lessons`, data);
export const updateLesson = (courseId, lessonId, data) => api.patch(`/tutor/courses/${courseId}/lessons/${lessonId}`, data);
export const deleteLesson = (courseId, lessonId) => api.delete(`/tutor/courses/${courseId}/lessons/${lessonId}`);
