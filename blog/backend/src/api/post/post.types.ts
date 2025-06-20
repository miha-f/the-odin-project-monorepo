export interface PostGetAllOptions {
    page: number;
    limit: number;
    sort?: 'createdAt' | 'updatedAt' | 'title';
    order?: 'asc' | 'desc';
    search?: string;
};

export interface PostUpdateData {
    title?: string;
    content?: string;
    images?: string[];
};
