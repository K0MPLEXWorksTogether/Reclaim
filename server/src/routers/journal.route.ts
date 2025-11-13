import { Router } from "express";
import { JournalController } from "../controllers/journal.controller";
import validateJwt from "../middleware/user.middleware";

const router = Router();

router.post("/", validateJwt, JournalController.createJournal);
router.get("/:id", validateJwt, JournalController.getJournal);
router.get("/", validateJwt, JournalController.getJournals);
router.put("/:id", validateJwt, JournalController.updateJournal);
router.delete("/:id", validateJwt, JournalController.deleteJournal);

export default router;
