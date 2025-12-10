import axios from "axios";
import { config } from "../apiHelpers.ts";
import { setTokens } from "./setTokens.ts";
import { API_URL } from "../../utils/config.ts";

export async function Refresh(userType: string) {
  try {
    const refresh = localStorage.getItem("refreshToken");

    const url = `${API_URL}/api/users/refreshToken`;
    const result = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `refreshToken ${refresh}`,
        },
      }
    );

    setTokens(result.data);
    return true;
  } catch (err) {
    return false;
  }
}
