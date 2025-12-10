import { API_URL } from "../../utils/config.ts";
import { config, getCookie } from "../apiHelpers.ts";

export async function getUserByid(id: number, ) {
  try {
    //make api call here
    const url = `${API_URL}/api/users/${id}`;
    console.log(url);
    const bearerToken = getCookie("bearerToken") as string;
    const result = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${bearerToken}`,
      },
      credentials: "include",
    });
    const data = await result.json();
    console.log(data);
    return { status: result.status, data: data };
  } catch (e) {
    return { status: 404, message: (e as Error).message };
  }
}
