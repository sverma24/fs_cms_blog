import { Request, Response } from "express";
import { addTag, deleteTag, getAllTags, getTagById, getTagBySlug } from "../services/tag.service";
import { z } from "zod";
import { generateSlug } from "../shared/general.util";


export const getTagsController = async (req: Request, res: Response) => {
  const tags = await getAllTags();
  res.json(tags);
};

export const addTagController = async (req: Request, res: Response) => {
    const {name} = req.body;

    let slug = generateSlug(name);

    const tagAlreadyExists = await getTagBySlug(slug);

    if(tagAlreadyExists){
        slug = generateSlug(name, true);
    }

    const newTag = await addTag(name, slug, 1);

    res.json(newTag);

};

export const updateTagController = async (req: Request, res: Response) => {
    const {name, id} = req.body;

    const tag = await getTagById(id);

    if(!tag) {
        res.status(404).json({message: 'Tag not found'});
    }
    else {
        if(tag.name === name) res.status(400).json({message: 'Nothing was changed.'});
        let slug = generateSlug(name);
        
        const tagAlreadyExists = await getTagBySlug(slug);

        if(tagAlreadyExists){
            slug = generateSlug(name, true);
        }

        tag.name = name;
        tag.slug = slug;
        await tag.save();
    }
    res.json(tag);
}

export const deleteTagController = async (req: Request, res: Response) => {

    const {id} = req.body;
    const tag = await getTagById(id);

    if(!tag) {
        res.status(404).json({message: 'Tag not found'});
    } else {
        await deleteTag(id);
    }
    res.json(tag);
}