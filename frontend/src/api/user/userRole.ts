import { SOMETHING_WENT_WRONG } from "../../constants/constant.ts";
import { API_URL } from "../../utils/config.ts";

export async function userRole(id: number) {
  const url = `${API_URL}/api/graphql`;

  const query = `
    query user($id: ID!){ 
    roles{
    id 
    name
    }
    
       user: getuser(id: $id){
       id
            firstname
            lastname
            role{
            id
            }
            email
            phoneNumber
        }    
    }`;

  const variables = {
    id: id.toString(),
  };
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await result.json();

  if (result.status !== 200) {
    throw new Error(SOMETHING_WENT_WRONG);
  }

  return { status: 200, data: json.data };
}
