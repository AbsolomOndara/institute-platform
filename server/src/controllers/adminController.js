import argon2 from "argon2";
import crypto from "node:crypto";
import { prisma } from "../config/prisma.js";

export async function dashboard(req, res, next) {
  try {
    const [students, tutors, courses, pending, active, messages] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TUTOR" } }),
      prisma.course.count({ where: { status: { not: "ARCHIVED" } } }),
      prisma.enrollment.count({ where: { status: "PENDING" } }),
      prisma.enrollment.count({ where: { status: "ACTIVE" } }),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
    ]);
    res.json({ stats: { students, tutors, courses, pending, active, messages } });
  } catch (error) { next(error); }
}

export async function listUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: req.query.role ? { role: req.query.role } : {},
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, tutorProfile: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ users });
  } catch (error) { next(error); }
}

export async function updateUserStatus(req, res, next) {
  try {
    if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: "You cannot change your own account status." });
    if (!["ACTIVE", "SUSPENDED", "DEACTIVATED"].includes(req.body.status)) return res.status(400).json({ message: "Invalid account status." });
    const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { status: req.body.status }, select: { id: true, name: true, email: true, role: true, status: true } });
    res.json({ user });
  } catch (error) { next(error); }
}

export async function createTutor(req, res, next) {
  try {
    const email = req.body.email?.toLowerCase();
    if (!req.body.name || !email) return res.status(400).json({ message: "Tutor name and email are required." });
    if (await prisma.user.findUnique({ where: { email } })) return res.status(409).json({ message: "That email is already registered." });
    const temporaryPassword = crypto.randomBytes(9).toString("base64url");
    const passwordHash = await argon2.hash(temporaryPassword);
    const tutor = await prisma.user.create({
      data: { name: req.body.name, email, passwordHash, role: "TUTOR", mustChangePassword: true, tutorProfile: { create: { expertise: req.body.expertise || null, bio: req.body.bio || null } } },
      select: { id: true, name: true, email: true, role: true, status: true, tutorProfile: true },
    });
    res.status(201).json({ tutor, temporaryPassword, message: "Give this temporary password to the tutor securely. It is shown only once." });
  } catch (error) { next(error); }
}

export async function listAllCourses(req, res, next) {
  try {
    const courses = await prisma.course.findMany({ include: { tutors: { include: { tutor: { select: { id: true, name: true, email: true } } } }, _count: { select: { enrollments: true, modules: true } } }, orderBy: { createdAt: "desc" } });
    res.json({ courses });
  } catch (error) { next(error); }
}

export async function assignTutor(req, res, next) {
  try {
    const tutor = await prisma.user.findFirst({ where: { id: Number(req.params.tutorId), role: "TUTOR", status: "ACTIVE" } });
    if (!tutor) return res.status(404).json({ message: "Active tutor not found." });
    const assignment = await prisma.courseTutor.upsert({ where: { courseId_tutorId: { courseId: Number(req.params.courseId), tutorId: tutor.id } }, update: {}, create: { courseId: Number(req.params.courseId), tutorId: tutor.id } });
    res.status(201).json({ assignment });
  } catch (error) { next(error); }
}

export async function unassignTutor(req, res, next) {
  try { await prisma.courseTutor.delete({ where: { courseId_tutorId: { courseId: Number(req.params.courseId), tutorId: Number(req.params.tutorId) } } }); res.status(204).end(); }
  catch (error) { next(error); }
}

export async function listMessages(req, res, next) {
  try { res.json({ messages: await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }) }); } catch (error) { next(error); }
}

export async function closeMessage(req, res, next) {
  try { const message = await prisma.contactMessage.update({ where: { id: Number(req.params.id) }, data: { status: "CLOSED", respondedAt: new Date(), respondedById: req.user.id } }); res.json({ message }); } catch (error) { next(error); }
}
