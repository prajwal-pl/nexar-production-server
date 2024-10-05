import { Router } from "express";
import {
  getProjects,
  createProject,
  getProject,
  deleteProject,
} from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.get("/project", getProject);
router.post("/", createProject);
router.delete("/:projectId", deleteProject);

export default router;
