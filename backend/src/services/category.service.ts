import { Category } from "../models/Category";


export async function getAllCategories(){
    
    const categories = await Category.findAll(); // select * from categories

    return categories;

}

export async function addCategory(name: string, slug: string, userId: number) {
    const category = new Category();
    category.name = name;
    category.userId = userId;
    category.slug = slug;

    await category.save();

    return category;
}

export async function getCategoryBySlug(slug: string) {
    const category = await Category.findOne({
        where: {
            slug
        }
    });
    return category;
}