export interface CommentGetAllOptions {
    page: number;
    limit: number;
    sort?: 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
    search?: string;
};
