import { useState } from "react";
import { useAuth } from "../../auth/AuthContext.tsx";
import { UserType } from "../../types/userType.ts";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";

type Props = {
  setFilter: (filter: string) => void;
  setOrderBy: (orderBy: string) => void;
};
const tableColumn = [{
  column: "firstname",
  label: "Firstname"
},
{
  column: "lastname",
  label: "Lastname"
},
{
  column: "email",
  label: "Email"
},
{
  column: "phoneNumber",
  label: "Phone"
}]
function TableHeader({ setFilter, setOrderBy }: Props) {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const { userStatus } = useAuth();

  function handleClick(column: string) {
    setFilter(column);
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(newOrder.toUpperCase()); // "ASC" or "DESC"
  }

  const isPrivileged = userStatus !== UserType.USER;

  return (
    <TableHead>
      <TableRow>

        {tableColumn.map((column) => (
          <TableCell sortDirection={order}><TableSortLabel
            active
            direction={order}
            onClick={() => handleClick(column.column)}
          >
            {column.label}
          </TableSortLabel>
          </TableCell>))}


        {/* {isPrivileged && <TableCell>Action</TableCell>} */}
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;
