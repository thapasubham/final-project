import { API_URL } from "../../utils/config.ts";
import { config, getCookie } from "../apiHelpers.ts";

export async function getUserByid(id: number, userType: string) {
  try {
    //make api call here
    console.log(id, userType);
    const url = `${API_URL}/api/${userType}/${id}`;
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
