export interface BlogGetAllOptions {
    page: number;
    limit: number;
    sort?: 'createdAt' | 'updatedAt' | 'title';
    order?: 'asc' | 'desc';
    search?: string;
};

export interface BlogUpdateData {
    title?: string;
    content?: string;
    image?: string;
};
