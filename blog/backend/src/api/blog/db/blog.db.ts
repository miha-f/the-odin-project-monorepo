import { Blog } from "..";
import { Uuid, DbResult } from "@/types";
import { BlogGetAllOptions, BlogUpdateData } from '..';

export interface BlogDbInterface {
    getById(id: number): DbResult<Blog>;
    getAll(options: BlogGetAllOptions): DbResult<Blog[]>;
    create(authorId: Uuid, title: string, content: string, image: string | undefined): DbResult<Blog>;
    update(id: number, data: BlogUpdateData): DbResult<Blog>;
    remove(id: number): DbResult<Blog>;
}
