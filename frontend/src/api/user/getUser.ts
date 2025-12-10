import { API_URL } from "../../utils/config.ts";

async function getUser(
  search: string,
  searchBy: string,
  limit: number,
  offset: number,
  orderby: string,
  filter: string,
  role: string,
) {
  //make api call here
  const url = `${API_URL}/api/graphql`;
  const filterColumn = filter || "firstname";

  const query = `
query users($search: String, $searchBy: String, $filter: String, $limit: Int!, $offset: Int!, $orderBy: String, $role: String!) 
{
    users(search: $search, searchBy: $searchBy, filter: $filter, limit: $limit, offset: $offset, orderBy: $orderBy, role: $role) {
     userList
     { id
      firstname
      lastname
      email
      phoneNumber
    }
    totalCount
    }
  }
`;

  const variables = {
    search,
    searchBy,
    filter: filterColumn,
    limit,
    offset,
    orderBy: orderby,
    role
  };
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data } = await result.json();

  return { status: result.status, data: data.users };
}

export default getUser;
