import { Router } from "express";
import { getUsers, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/update/:userId", updateUser);

export default router;
