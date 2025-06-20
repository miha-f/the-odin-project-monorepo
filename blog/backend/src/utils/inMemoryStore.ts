// export const createInMemoryStore = <T, K>(getId: (t: T) => K) => {
//     const map = new Map<K, T>();
//
//     return {
//         create: (item: T): void => {
//             map.set(getId(item), item);
//         },
//
//         get: (id: K): T | undefined => {
//             return map.get(id);
//         },
//
//         getAll: (): T[] => {
//             return Array.from(map.values());
//         },
//
//         update: (id: K, updates: Partial<T>): T | undefined => {
//             const existing = map.get(id);
//             if (!existing) return undefined;
//             const updated = { ...existing, ...updates };
//             map.set(id, updated);
//             return updated;
//         },
//
//         delete: (id: K): T | undefined => {
//             const existing = map.get(id);
//             if (!existing) return undefined;
//             map.delete(id);
//             return existing;
//         },
//
//         size: () => {
//             return map.size
//         },
//     };
// };

export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface SortOptions<T> {
    sort?: keyof T;
    order?: 'asc' | 'desc';
}

export interface SearchOptions<T> {
    search?: string;
    searchKeys?: (keyof T)[];
}

export type GetAllOptions<T> = PaginationOptions & SortOptions<T> & SearchOptions<T>;

export const createInMemoryStore = <T extends Record<string, any>, K>(getId: (t: T) => K) => {
    const map = new Map<K, T>();

    return {
        create: (item: T): void => {
            map.set(getId(item), item);
        },

        get: (id: K): T | undefined => {
            return map.get(id);
        },

        getAll: (options?: GetAllOptions<T>): T[] => {
            let items = Array.from(map.values());

            // Search
            if (options?.search && options.searchKeys?.length) {
                const search = options.search.toLowerCase();
                items = items.filter(item =>
                    options.searchKeys!.some(key => {
                        const value = item[key];
                        return typeof value === 'string' && value.toLowerCase().includes(search);
                    })
                );
            }

            // Sort
            if (options?.sort) {
                const sortKey = options.sort;
                items.sort((a, b) => {
                    const aVal = a[sortKey];
                    const bVal = b[sortKey];

                    if (aVal === bVal) return 0;
                    if (options.order === 'desc') {
                        return aVal < bVal ? 1 : -1;
                    } else {
                        return aVal > bVal ? 1 : -1;
                    }
                });
            }

            // Pagination
            const page = options?.page ?? 1;
            const limit = options?.limit ?? items.length;
            const start = (page - 1) * limit;
            const end = start + limit;

            return items.slice(start, end);
        },

        update: (id: K, updates: Partial<T>): T | undefined => {
            const existing = map.get(id);
            if (!existing) return undefined;
            const updated = { ...existing, ...updates };
            map.set(id, updated);
            return updated;
        },

        delete: (id: K): T | undefined => {
            const existing = map.get(id);
            if (!existing) return undefined;
            map.delete(id);
            return existing;
        },

        size: () => {
            return map.size;
        },
    };
};
