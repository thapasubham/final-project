import axios from "axios";
import { API_URL } from "../../utils/config";
import { getCookie } from "../apiHelpers";

export async function fontUpload(formData: FormData) {
  const bearerToken = getCookie("bearerToken") as string;
  let res = await axios.post(`${API_URL}/api/font`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  console.log(res);
  return res;
}
