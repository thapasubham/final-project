import {config, getCookie} from "../apiHelpers.ts";

const {apiUrl} = config;
export default async function deleteUnverified(id: number) {
    try {
        //call the api here
        const url = `${apiUrl}/users/${id}`;
        const bearerToken = getCookie("bearerToken") as string;

        const result = await  fetch(url, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${bearerToken}`,
            }
        })

        return {status: result.status, data: result};
    } catch (e) {
        return { status: 500, message: (e as Error).message };
    }
};