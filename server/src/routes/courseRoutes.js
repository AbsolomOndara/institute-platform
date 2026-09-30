import { Router } from "express"; import { getCourse, listCourses } from "../controllers/courseController.js"; import { requestEnrollment } from "../controllers/enrollmentController.js"; import { requireAuth } from "../middleware/requireAuth.js"; import { allowRoles } from "../middleware/allowRoles.js";
const router = Router(); router.get("/", listCourses); router.get("/:courseId", getCourse); router.post("/:courseId/enroll", requireAuth, allowRoles("STUDENT"), requestEnrollment); export default router;

