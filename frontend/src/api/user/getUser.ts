import { API_URL } from "../../utils/config.ts";

async function getUser(
  search: string,
  searchBy: string,
  limit: number,
  offset: number,
  orderby: string,
  filter: string,
  user: string,
  isVerified: boolean
) {
  //make api call here
  const url = `${API_URL}/api/graphql`;
  const filterColumn = filter || "firstname";

  const query = `
  query user($search: String, $searchBy: String, $filter: String, $limit: Int!, $offset: Int!, $orderBy: String, $verified: Boolean) {
    ${user}(search: $search, searchBy: $searchBy, filter: $filter, limit: $limit, offset: $offset, orderBy: $orderBy, isVerified: $verified) {
      id
      firstname
      lastname
      email
      phoneNumber
      isverified
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
    verified: isVerified,
  };
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data } = await result.json();

  return { status: result.status, data: data?.[user] };
}

export default getUser;
