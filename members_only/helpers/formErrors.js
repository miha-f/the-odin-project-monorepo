const getFormErrorsMap = (errors) => {
    const formErrors = {};
    errors.errors.forEach(err => {
        if (!formErrors[err.path])
            formErrors[err.path] = [];
        formErrors[err.path].push(err.msg);
    });
    return formErrors;
}

module.exports = getFormErrorsMap;
