const validate = (values) => {
    const commonErrors = {};

    const roleUsersErrors =[];

    if (!values.title) {
        commonErrors.title = 'Title is required'
    } else if (values.title.length < 5) {
        commonErrors.title = 'Title must be at least 5 characters long'
    }

    if (!values.description) {
        commonErrors.description = "Description is required"
    } else if (values.description.length < 5) {
        commonErrors.description = "Text has to be at least 5 characters long"
    }

    if (!values.projectManager) {
        commonErrors.projectManager = "Field is required"
    }

    {
        values.userProjectRoleDto &&
        values.userProjectRoleDto.map((userProjectRole, index) => {
            if (userProjectRole.projectRoleName !== '' && userProjectRole.userName === '') {
                roleUsersErrors.push(index);
            }
            if(roleUsersErrors.length>0) {
                commonErrors.roleErrors = roleUsersErrors;
            }
        })
    }
    return commonErrors;
};
export default validate;