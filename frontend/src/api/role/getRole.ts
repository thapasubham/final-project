import {config} from "../apiHelpers.ts";


const {apiUrl} = config
export async function getRoles(){
    const url = `${apiUrl}/graphql`;
    const query =`
    query role{
        roles{
        name
        id
        }
    }`

    const result = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),

    });
    const {data} = await result.json();

    return {status: result.status, data: data.roles}
}