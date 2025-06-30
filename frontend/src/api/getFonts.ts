import { API_URL } from "../utils/config.ts";

export default async function getFonts(
  limit: number | 0,
  offset: number | "",
  language: string | "",
  search: string,
  order_by: string
) {
  try {

    const url = `${API_URL}/api/font?limit=${limit}&offset=${offset}&search=${search}&order_by=${order_by}&lang=${
      language || ""
    }`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return { status: response.status, message: result };
  } catch (e) {
    return { status: 500, message: (e as Error).message };
  }
}
