import { API_URL } from "../../utils/config";
import { getCookie } from "../apiHelpers";

export async function downloadFont(fontId: number, userID: number) {
  const bearerToken = getCookie("bearerToken") as string;
  console.log(bearerToken);
  const response = await fetch(
    `${API_URL}/api/font/download/${fontId}/${userID}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );
  return response;
}
