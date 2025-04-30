const formatDate = (input, fieldName = "formattedDate", dateName = "updated_at") => {
    const isArray = Array.isArray(input);
    const list = isArray ? input : [input];

    const listWithFormattedDate = list.map(el => ({
        ...el,
        [fieldName]: new Date(el[dateName]).toLocaleDateString('en-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }));
    return isArray ? listWithFormattedDate : listWithFormattedDate[0];
};

module.exports = formatDate;
