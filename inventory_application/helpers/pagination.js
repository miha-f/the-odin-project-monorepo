const Pagination = (page, elementsPerPage, totalElements) => {
    let currentPage = 0;

    const offset = (page - 1) * ITEMS_PER_PAGE;

    const getElementsPerPage = () => elementsPerPage;
    const getTotalElements = () => totalElements;
    const getPage = () => currentPage;

    const getTotalPages = () => {
        const div = Math.floor(totalElements / elementsPerPage);
        const mod = totalElements % elementsPerPage;
        if (mod)
            return div + 1;
        else
            return div;
    };

    const setPage = (newPage) => {
        // NOTE(miha): Clamp
        currentPage = Math.max(0, Math.min(newPage, getTotalPages()));
    };

    const increasePage = () => {
        // NOTE(miha): Clamp
        currentPage = Math.max(0, Math.min(currentPage++, getTotalPages()));
    };

    const decreasePage = () => {
        // NOTE(miha): Clamp
        currentPage = Math.max(0, Math.min(currentPage--, getTotalPages()));
    };

    return {
        getElementsPerPage, getTotalElements, getPage, getTotalPages,
        setPage, increasePage, decreasePage
    };
}

module.exports = Pagination;
