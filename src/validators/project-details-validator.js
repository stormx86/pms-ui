const validate = (errors) => {
    const errorMessages = {};
    const roleUsersErrors = [];

    const errorsData = errors.data.errors;
    errorsData.map(err => {
        if (err.code === 'ProjectManagerConstraint') {
            errorMessages.projectManagerConstraint = err.defaultMessage;
        }

        if (err.code === 'Size' && err.field === 'description') {
            errorMessages.descriptionMin = err.defaultMessage;
        }

        if (err.code === 'Size' && err.field === 'title') {
            errorMessages.titleMin = err.defaultMessage;
        }

        if (err.code === 'ValidUsernameConstraint') {
            roleUsersErrors.push(err.rejectedValue);
        }
        if (roleUsersErrors.length > 0) {
            errorMessages.roleErrors = roleUsersErrors;
        }
    });
    return errorMessages;
};
export default validate;