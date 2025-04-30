const pagination = async (currentPage, getAllCountFunc, itemsPerPage = 10) => {
    const page = parseInt(currentPage) || 1;
    const offset = (page - 1) * itemsPerPage;
    const totalItems = (await getAllCountFunc()).count;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return { page, totalPages, offset };
};

modules.export = pagination;
