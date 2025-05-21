import { api } from './client';
import { tryCatch } from '../utils/tryCatch';

export const register = async ({ username, password, passwordRepeat }) => {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);
    form.append('passwordRepeat', passwordRepeat);

    const [data, error] = await tryCatch(api.post('/auth/register', form, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }));

    if (error)
        return { error: error };

    return { data: data };
}

export const login = async ({ username, password }) => {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);

    const [data, error] = await tryCatch(api.post('/auth/login', form, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }));

    if (error)
        return { error: error };

    return { data: data };
}

export const logout = async () => {
    const [data, error] = await tryCatch(api.post('/auth/logout'));
    if (error)
        return { error: error };
    return { data: data };
}

export const getMe = async () => {
    const [data, error] = await tryCatch(api.get('/auth/me'));
    if (error)
        return { error: error };
    return { data: data };
}
