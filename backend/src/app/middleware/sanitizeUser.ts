import { User } from "../../entity/user";

export function sanitizeInput(user: User) {

  console.log(user.firstname);

  user.firstname = user.firstname.trim();
  user.lastname = user.lastname.trim();
  user.email = user.email.trim();
  user.phoneNumber = user.phoneNumber.trim();

  console.log(user)
    return user;
}
