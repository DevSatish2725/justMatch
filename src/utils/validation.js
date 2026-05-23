const validator = require("validator");

const signupValidation = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    gender,
    age,
    about,
    photoUrl,
    skills,
  } = req.body;
  const errorObj = {};
  if (!firstName) {
    errorObj.firstName = "First name is required";
  } else if (firstName.length < 2 || firstName.length > 80) {
    errorObj.firstName = "First name should be between 2 and 80 characters";
  }
  if (!lastName) {
    errorObj.lastName = "Last name is required";
  } else if (lastName.length < 2 || lastName.length > 80) {
    errorObj.firstName = "Last name should be between 2 and 80 characters";
  }
  if (!emailId) {
    errorObj.emailId = "Email id is required";
  } else if (!validator.isEmail(emailId)) {
    errorObj.emailId = "Please enter a valid email address";
  }
  if (!password) {
    errorObj.password = "Password is required";
  } else if (
    password &&
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errorObj.password =
      "Password must be at least 8 characters and include uppercase, lowercase, number and special character";
  }
  if (gender) {
    const isTrue = ["male", "female", "others"].includes(gender.toLowerCase());
    if (!isTrue) {
      errorObj.gender = "Enter valid gender value";
    }
  }
  if (age < 18) {
    errorObj.age = "Age must be atleast 18";
  }
  if (!validator.isURL(photoUrl)) {
    errorObj.photoUrl = "Photo url is not valid";
  }
  if (skills && skills.length) {
    const normalizedSkills = skills.map((skill) => skill.toLowerCase());
    if (normalizedSkills.length > 10) {
      errorObj.skills = "Maximum 10 skills are allowed";
    }
    const uniqueSkills = [...new Set(normalizedSkills)];
    if (uniqueSkills.length !== normalizedSkills.length) {
      errorObj.skills = "Duplicate skills are not allowed";
    }
  }
  return errorObj;
};

module.exports = { signupValidation };
