import { BelongsTo, BelongsToMany, ForeignKey, Column, Model, Table } from "sequelize-typescript";
import { Post } from "./Post";
import { PostTag } from "./PostTag";
import { User } from "./User";


@Table
export class Tag extends Model<Tag>{


    @Column({
        allowNull: false
    })
    name?: string;

    @ForeignKey(()=>User)
    @Column({
        allowNull: false
    })
    userId?: number;

    @BelongsToMany(()=>Post, ()=>PostTag)
    posts: Post[] = [] 
    
    @BelongsTo(()=>User)
    user?: User;
}