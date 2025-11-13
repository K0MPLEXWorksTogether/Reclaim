import { Router } from "express";
import { AddictionController } from "../controllers/addiction.controller";
import validateJwt from "../middleware/user.middleware";

const router = Router();

router.post("/", validateJwt, AddictionController.createAddiction);
router.get("/:id", validateJwt, AddictionController.getAddiction);
router.get("/", validateJwt, AddictionController.getAllAddictions);
router.put("/:id", validateJwt, AddictionController.updateAddiction);
router.delete("/:id", validateJwt, AddictionController.deleteAddiction);
router.post("/:id/relapse", validateJwt, AddictionController.relapse);

export default router;
