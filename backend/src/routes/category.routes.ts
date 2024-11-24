import { Router } from "express";
import { addCategoryController, getCategories } from "../controllers/category.controller";


const router = Router();


router.get('/', getCategories);
router.get('/xyz/abc', getCategories);
router.post('/', addCategoryController);


export default router;