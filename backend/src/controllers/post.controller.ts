import { Request, Response } from "express";
import { addPost, deletePost, getAllPosts, getPostById, getPostBySlug, updatePost } from "../services/post.service";
import { z } from "zod";
import { generateSlug } from "../shared/general.util";
import { getCategoryById } from "../services/category.service";
import { getTagsByIds } from "../services/tag.service";
import { addPostTags } from "../services/post-tag.service";



export const getAllPostsController = async (req: Request, res: Response) => {
    const posts = await getAllPosts();
    res.json(posts)
}

export const addPostController = async (req: Request, res: Response) => {

    const { title, content, categoryId, tagIds } = req.body;

    if(tagIds && tagIds.length>0){
        // check if all tags are valid
        const tags = await getTagsByIds(tagIds);
        if(tags.length!==tagIds.length){
            res.status(400).json({message: "Invalid tag id(s)"});
        }
    }

    let slug = generateSlug(title);

    // check if slug is unique
    const existingPostWithGivenSlug = await getPostBySlug(slug);

    if(existingPostWithGivenSlug)
        slug = generateSlug(title, true);

    // verify if category id is valid
    const category = await getCategoryById(categoryId);
    if(!category)
        res.status(400).json({message: "Invalid category id"});

    const post = await addPost(
        title,
        content,
        categoryId,
        1, // hardcoded user id
        slug
    );

    // add tags to post
    if(tagIds && tagIds.length>0){
       await addPostTags(post.id, tagIds);
    }


    res.json(post);

}

export const updatePostController = async (req: Request, resp: Response) => {

    const userId = 1; // hardcoded user id

    const { id, title, content, categoryId } = req.body;

    // checking if post id is valid
    const post = await getPostById(id);

    if(!post) {
        resp.status(400).json({message: "Invalid post id"});
    } else {
           // make sure if user has rights to update the post
        if(post.userId!==userId)
            resp.status(403).json({message: "You are not authorized to update this post"});

        // check if category id is valid
        const category = await getCategoryById(categoryId);
        if(!category)
            resp.status(400).json({message: "Invalid category id"});
        
        let slug; 
        
        // check if title was updated, if yes, generate new slug
        if(title!==post.title){
            slug = generateSlug(title);

        // check if slug is unique
        const existingPostWithGivenSlug = await getPostBySlug(slug);

        if(existingPostWithGivenSlug)
            slug = generateSlug(title, true);
        }
        const updatedPost = await updatePost(id, title, content, categoryId, slug);
        resp.json(updatedPost);
    }
}

export const deletePostController = async (req: Request, resp: Response) => {

    const userId = 1; // hardcoded user id

    const { id } = req.body;

    // checking if post id is valid
    const post = await getPostById(id);
    if(!post){
        resp.status(400).json({message: "Invalid post id"});
    }
    else {
        // make sure if user has rights to delete the post
        if(post.userId!==userId)
            resp.status(403).json({message: "You are not authorized to delete this post"});

        await deletePost(id);

        resp.json(post);
    }
}