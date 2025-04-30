const formatDate = (list, fieldName = "formattedDate", dateName = "updated_at") => {
    const listWithFormattedDate = list.map(el => ({
        ...el,
        [fieldName]: new Date(el[dateName]).toLocaleDateString('en-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }));
    return listWithFormattedDate;
};

module.exports = formatDate;
