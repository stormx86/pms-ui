const validate = (errors) => {
    const errorMessages = {};

    const errorsData = errors.data.errors;
    errorsData.map(err => {
        if(err.code==='ChangeUserPasswordConstraint'){
            errorMessages.commonMessage = err.defaultMessage;
        }
        if(err.code==='NotBlank' && err.field==='password'){
            errorMessages.newPasswordMessage = err.defaultMessage;
        }
        if(err.code==='NotBlank' && err.field==='repeatPassword'){
            errorMessages.repeatPasswordMessage = err.defaultMessage
        }
    });

    return errorMessages;
};
export default validate;