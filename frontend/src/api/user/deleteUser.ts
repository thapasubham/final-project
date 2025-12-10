import { API_URL } from "../../utils/config.ts";
import { getCookie } from "../apiHelpers.ts";

export async function deleteUser(id: number, userType: string) {
  try {
    //call the api here
    const url = `${API_URL}/api/users/${id}`;
    const bearerToken = getCookie("bearerToken") as string;

    const result = await fetch(url, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${bearerToken}`,
      },
    });

    return { status: result.status, data: result };
  } catch (e) {
    return { status: 500, message: (e as Error).message };
  }
}
