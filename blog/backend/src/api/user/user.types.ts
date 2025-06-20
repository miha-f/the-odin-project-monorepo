export interface UserGetAllOptions {
    page: number;
    limit: number;
    sort?: 'createdAt' | 'updatedAt' | 'username';
    order?: 'asc' | 'desc';
    search?: string;
};

export interface UserUpdateData {
    username?: string;
    passwordHash?: string;
    password?: string;
    passwordRepeat?: string;
};
