const formatDate = (list, fieldName = "formattedDate", dateName = "updated_at") => {
    const listWithFormattedDate = list.map(stock => ({
        ...list,
        [fieldName]: new Date(list[dateName]).toLocaleDateString('en-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }));
    return listWithFormattedDate;
};

modules.export = formatDate;
