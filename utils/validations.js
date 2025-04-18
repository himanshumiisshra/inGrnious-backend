function validatePassword(password) {
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
    result = regexPassword.test(password);
    return result;
}

function validateEmail(email){
    let regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    result = regexMail.test(email);
    return result;
}


module.exports = {
    validateEmail,
    validatePassword
}