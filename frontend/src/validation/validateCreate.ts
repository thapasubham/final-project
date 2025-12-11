import { userErrorType } from "./userFormError.types.ts";
import { userPayload } from "../types/user.ts";

export function validateCreate(user: userPayload) {
  const error: userErrorType = {
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
  };
  const nameRegex = /^[A-Z][a-z]*$/;
  if (!user.firstname.trim()) {
    error.firstname = "First name is required";
  } else if (!nameRegex.test(user.firstname.trim())) {
    error.firstname = "First name is not valid";
  } else {
    error.firstname = "";
  }

  if (!user.lastname.trim()) {
    error.lastname = "Last name is required";
  } else if (!nameRegex.test(user.lastname.trim())) {
    error.lastname = "Last name is not valid";
  } else {
    error.lastname = "";
  }
  if (!user.email.trim()) {
    error.email = "Email is required";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.email.trim())
  ) {
    error.email = "Email is not valid";
  } else {
    error.email = "";
  }

  if (!user.phoneNumber.trim()) {
    error.phoneNumber = "Phone number is required";
  } else if (isNaN(Number(user.phoneNumber.trim()))) {
    error.phoneNumber = "Phone number is not invalid";
  } else if (user.phoneNumber.length !== 10) {
    error.phoneNumber = "Phone number should be 10 digits";
  } else {
    error.phoneNumber = "";
  }
  if(user.password){
if ( user.password.length < 6 || user.password.length > 15) {
  error.password = "Password must be 6 to 15 characters long";
} else {
  error.password = "";
}

if (user.confirmPassword && user.password !== user.confirmPassword) {
  error.confirmPassword = "Passwords do not match";
} else {
  error.confirmPassword = "";
}
  }

  return error;
}

export function sanitizeInput(user: userPayload) {
  user.firstname = user.firstname.trim();
  user.lastname = user.lastname.trim();
  user.email = user.email.trim();
  user.phoneNumber = user.phoneNumber.trim();

  return user;
}
