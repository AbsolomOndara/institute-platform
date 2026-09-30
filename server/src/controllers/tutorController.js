import { prisma } from "../config/prisma.js";
export async function listTutorCourses(req, res, next) {
  try {
    const where = req.user.role === "ADMIN" ? {} : { tutorId: req.user.id };
    const assignments = await prisma.courseTutor.findMany({
      where,
      include: {
        course: {
          include: {
            modules: {
              include: { lessons: { orderBy: { position: "asc" } } },
              orderBy: { position: "asc" },
            },
            _count: { select: { enrollments: true } },
          },
        },
      },
    });
    res.json({ courses: assignments.map(item => item.course) });
  } catch (error) { next(error); }
}
export async function createModule(req, res, next) { try { if (!req.body.title) return res.status(400).json({ message: "Module title is required." }); const last = await prisma.module.aggregate({ where: { courseId: Number(req.params.courseId) }, _max: { position: true } }); const module = await prisma.module.create({ data: { courseId: Number(req.params.courseId), title: req.body.title, position: (last._max.position || 0) + 1 } }); res.status(201).json({ module }); } catch (error) { next(error); } }
export async function updateModule(req, res, next) { try { const existing=await prisma.module.findFirst({where:{id:Number(req.params.moduleId),courseId:Number(req.params.courseId)}});if(!existing)return res.status(404).json({message:"Module not found."}); const module = await prisma.module.update({ where: { id: existing.id }, data: { title: req.body.title } }); res.json({ module }); } catch (error) { next(error); } }
export async function deleteModule(req, res, next) { try { const existing=await prisma.module.findFirst({where:{id:Number(req.params.moduleId),courseId:Number(req.params.courseId)}});if(!existing)return res.status(404).json({message:"Module not found."});await prisma.module.delete({ where: { id: existing.id } }); res.status(204).end(); } catch (error) { next(error); } }
export async function createLesson(req, res, next) { try { const module = await prisma.module.findUnique({ where: { id: Number(req.params.moduleId) } }); if (!module || module.courseId !== Number(req.params.courseId)) return res.status(404).json({ message: "Module not found." }); if (!req.body.title) return res.status(400).json({ message: "Lesson title is required." }); const last = await prisma.lesson.aggregate({ where: { moduleId: module.id }, _max: { position: true } }); const lesson = await prisma.lesson.create({ data: { moduleId: module.id, title: req.body.title, content: req.body.content || null, videoUrl: req.body.videoUrl || null, resourceUrl: req.body.resourceUrl || null, position: (last._max.position || 0) + 1 } }); res.status(201).json({ lesson }); } catch (error) { next(error); } }
export async function updateLesson(req, res, next) { try { const existing=await prisma.lesson.findFirst({where:{id:Number(req.params.lessonId),module:{courseId:Number(req.params.courseId)}}});if(!existing)return res.status(404).json({message:"Lesson not found."});const lesson = await prisma.lesson.update({ where: { id: existing.id }, data: { title: req.body.title, content: req.body.content || null, videoUrl: req.body.videoUrl || null, resourceUrl: req.body.resourceUrl || null } }); res.json({ lesson }); } catch (error) { next(error); } }
export async function deleteLesson(req, res, next) { try { const existing=await prisma.lesson.findFirst({where:{id:Number(req.params.lessonId),module:{courseId:Number(req.params.courseId)}}});if(!existing)return res.status(404).json({message:"Lesson not found."});await prisma.lesson.delete({ where: { id: existing.id } }); res.status(204).end(); } catch (error) { next(error); } }
export async function courseStudents(req, res, next) { try { const enrollments = await prisma.enrollment.findMany({ where: { courseId: Number(req.params.courseId), status: { in: ["ACTIVE", "COMPLETED"] } }, include: { student: { select: { id: true, name: true, email: true, progress: { where: { lesson: { module: { courseId: Number(req.params.courseId) } } } } } } } }); res.json({ enrollments }); } catch (error) { next(error); } }
