const toLowerCaseExceptFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export default toLowerCaseExceptFirstLetter;