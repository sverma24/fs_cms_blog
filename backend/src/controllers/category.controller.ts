import { Request, Response } from "express";
import { addCategory, getAllCategories, getCategoryBySlug } from "../services/category.service";
import { generateSlug } from "../shared/general.util";

export const getCategories = async (req: Request, res: Response) =>{

    const categories = await getAllCategories();

    res.json(categories)
}

export const addCategoryController = async (req: Request, res: Response) => {
    const {name} = req.body;
    const userId = 1;
    let slug = generateSlug(name);

    const categoryBySlug = await getCategoryBySlug(slug);

    if(categoryBySlug) {
        slug = generateSlug(name, true)
    }


    const category = await addCategory(name, slug, userId);
    res.json(category)

}