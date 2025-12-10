import { useEffect, useState } from "react";
import getUser from "../../api/user/getUser.ts";
import UserRow from "./UserRow.tsx";
import { UserFetch } from "../../types/user.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { USER_DOES_NOT_FOUND } from "../../constants/constant.ts";
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
  TablePagination,
  Button,
} from "@mui/material";
import TableHeader from "./TableHeader.tsx";

interface UserListProps {
  role: string;
}

function UserList({ role }: UserListProps) {
  const { isLogged } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserFetch[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("firstname");
  const [filter, setFilter] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const offset = page * rowsPerPage;
  const limit = rowsPerPage;

  useEffect(() => {
    if (!isLogged) {
      setError("You need to login");
      navigate("/login");
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => getUsers(), 200);
    return () => clearTimeout(timer);
  }, [isLogged, offset, filter, orderBy, search, role]);

  const getUsers = async () => {
    try {
      const response = await getUser(search, searchBy, limit, offset, orderBy, filter, role);

      if (!response.data || response.data.length === 0) {
        setUsers([]);
        setTotalCount(0);
        setError(USER_DOES_NOT_FOUND);
        setLoading(false);
        return;
      }

      setUsers(response.data.userList || []);
      setTotalCount(response.data.totalCount || 0);
      setError("");
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <TextField
          label={`Search by ${searchBy}`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Select
          value={searchBy}
          onChange={e => {
            setSearchBy(e.target.value);
            setSearch("");
          }}
          size="small"
        >
          <MenuItem value="firstname">Firstname</MenuItem>
          <MenuItem value="lastname">Lastname</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="phoneNumber">Phone No</MenuItem>
        </Select>
      </Box>

      {/* Error / Loading */}
      {error ? (
        <Typography color="error" mb={2}>{error}</Typography>
      ) : loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHeader setFilter={setFilter} setOrderBy={setOrderBy} />
              <TableBody>
                {users.map(user => (
                  <UserRow key={user.id} userData={user} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </>
      )}
    </Box>
  );
}

export default UserList;
