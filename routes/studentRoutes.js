import express from "express"
import StudentController from "../controllers/StudentController.js"
import multer from "multer"
import storage from "../config/cloudinary.js"

const router = express.Router();
const uploads = multer({storage});

router.get("/",StudentController.getAll);
router.get("/:id",StudentController.getOne);
router.post("/",uploads.single("profile"),StudentController.create);
router.put("/:id",uploads.single("profile"),StudentController.update);
router.delete("/:id",StudentController.remove);

export default router;