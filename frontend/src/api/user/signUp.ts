import axios, { AxiosError, type AxiosResponse } from "axios";
import type { userPayload } from "../../types/user.ts";
import { API_URL } from "../../utils/config.ts";

async function signUp(user: userPayload, users: string) {
  const payload: userPayload = {
    id: 0,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    password: user.password,
  };

  try {
    //perform api request here
    const url = `${API_URL}/api/users}`;

    const result = await axios.post(url, payload);
    const { data } = result;
    return { status: result.status, message: data.message };
  } catch (err) {
    const { status, response, message } = err as AxiosError;

    return {
      status: status,
      message: response ? (response as AxiosResponse).data : message,
    };
  }
}

export default signUp;
