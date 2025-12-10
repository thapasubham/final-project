import { getCookie } from "../apiHelpers.ts";
import axios, { AxiosError } from "axios";
import { userPayload } from "../../types/user.ts";
import { API_URL } from "../../utils/config.ts";

export async function editUser(payload: userPayload) {
  try {
    //perform api request here
    const url = `${API_URL}/api/users/${payload.id}`;
    const bearerToken = getCookie("bearerToken") as string;
    const result = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    //just return the response
    return { status: result.status, message: result.data.message };
  } catch (err) {
    const { status, message, response } = err as AxiosError;
    return { status: status, message: response ? response.data : message };
  }
}
