import axios from "axios";
import { API_URL } from "../../utils/config";
import { getCookie } from "../apiHelpers";

export async function getUserPurchases(userId: number,
    offset: number,
    limit: number,
    sortBy = "purchasedAt",
    order = "DESC") {
    try {
        const bearerToken = getCookie("bearerToken") as string;
        console.log(limit)
        const response = await axios.get(`${API_URL}/api/users/${userId}/purchase`, {
            params: { offset, limit, sortBy, order },

            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        return { status: response.status, data: response.data };
    } catch (err: any) {
        return { status: err.response?.status || 500, data: err.response?.data || { message: err.message } };
    }
};
