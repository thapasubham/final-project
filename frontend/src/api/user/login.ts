import { API_URL } from "../../utils/config.ts";
import axios from "axios";

async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const url = `${API_URL}/api/users/login`;

    const result = await axios.post(url, {
      email,
      password,
    });

    return {
      status: result.status,
      message: result.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status ?? 500,
        message: error.response?.data?.message ?? error.message,
      };
    }

    return {
      status: 500,
      message: "Unknown error occurred",
    };
  }
}

export default loginUser;
