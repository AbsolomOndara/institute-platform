import { prisma } from "../config/prisma.js";
export async function requireCourseAssignment(req, res, next) { if (req.user.role === "ADMIN") return next(); const assignment = await prisma.courseTutor.findUnique({ where: { courseId_tutorId: { courseId: Number(req.params.courseId), tutorId: req.user.id } } }); return assignment ? next() : res.status(403).json({ message: "Course is not assigned to this tutor" }); }

