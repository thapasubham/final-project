import axios, { AxiosError, AxiosResponse } from "axios";
import type { userPayload } from "../../types/user.ts";
import { API_URL } from "../../utils/config.ts";

async function signUp(user: userPayload) {
  const payload: userPayload = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    password: user.password,
    confirmPassword: user.confirmPassword, // Add if needed
  };

  try {
    const url = `${API_URL}/api/users`;
    const result = await axios.post(url, payload);

    return {
      status: result.status,
      message: result.data.message,
    };
  } catch (error) {
    const err = error as AxiosError;
    console.log(error)
    return {
      status: err.response?.status || 500,
      message: err.response?.data?.message || err.message,
    };
  }
}

export default signUp;
