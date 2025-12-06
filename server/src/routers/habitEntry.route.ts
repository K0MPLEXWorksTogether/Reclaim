import { Router } from "express";
import { HabitEntryController } from "../controllers/habitEntry.controller";
import validateJwt from "../middleware/user.middleware";

const router = Router();

router.post("/", validateJwt, HabitEntryController.createHabitEntry);
router.get("/:id", validateJwt, HabitEntryController.getHabitEntries);
router.get("/", validateJwt, HabitEntryController.getHabitEntries);
router.put("/:id", validateJwt, HabitEntryController.updateHabitEntry);
router.delete("/:id", validateJwt, HabitEntryController.deleteHabitEntry);

export default router;
