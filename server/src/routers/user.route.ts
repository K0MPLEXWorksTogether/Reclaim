import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import validateJwt from "../middleware/user.middleware";

const router = Router();

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/profile", validateJwt, UserController.getProfile);
router.patch("/reset-password", validateJwt, UserController.resetPassword);
router.patch("/change-username", validateJwt, UserController.changeUsername);

export default router;
