import { Router } from "express";
import { HabitController } from "../controllers/habit.controller";
import validateJwt from "../middleware/user.middleware";

const router = Router();

router.post("/", validateJwt, HabitController.createHabit);
router.get("/:id", validateJwt, HabitController.getHabit);
router.get("/", validateJwt, HabitController.getAllHabits);
router.put("/:id", validateJwt, HabitController.updateHabit);
router.delete("/:id", validateJwt, HabitController.deleteHabit);
router.get("/period/:period", validateJwt, HabitController.getHabitsByPeriod);
router.get(
  "/frequency/:frequency",
  validateJwt,
  HabitController.getHabitsByFrequency
);

export default router;
