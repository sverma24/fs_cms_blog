import { Request, Response } from "express";
import { addCategory, deleteCategory, getAllCategories, getCategoryById, getCategoryBySlug, updateCategory } from "../services/category.service";
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
    res.json(category);

}

export const updateCategoryController = async (req: Request, res: Response) => {
    
    let {name, id} = req.body;
    
    let slug = generateSlug(name);

    const categoryBySlug = await getCategoryBySlug(slug);

    if(categoryBySlug) {
        res.status(400).json({message: 'Category already exists'})
    }

    //check if category exists by the given Id
    let dbCategory = await getCategoryById(id)

    if(!dbCategory) {
        res.status(404).json({message: 'Category not found'})
    }

    //update Category
    let updatedCategory = await updateCategory(name, slug, id);

    res.json(updatedCategory);
}

export const deleteCategoryController = async (req: Request, res: Response) => {
    const {id} = req.body;

    const category = await getCategoryById(id);
    if(!category) {
        res.status(404).json({message: 'Category not found'})
    }

    await deleteCategory(id);

    res.json({category});
}