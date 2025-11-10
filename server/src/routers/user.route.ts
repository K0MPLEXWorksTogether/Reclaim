import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/:id", UserController.getProfile);
router.patch("/:id/reset-password", UserController.resetPassword);
router.patch("/:id/change-username", UserController.changeUsername);

export default router;
