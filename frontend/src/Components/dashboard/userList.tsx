import { useEffect, useRef, useState } from "react";
import getUser from "../../api/user/getUser.ts";
import UserRow from "./UserRow.tsx";
import { UserFetch } from "../../types/user.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Skeleton,
  TableRow,
  TableCell,
} from "@mui/material";
import TableHeader from "./TableHeader.tsx";
import { useNotification } from "../../notification/notificationContext.tsx";



function UserList({ role }: { role: string }) {
  const { isLogged } = useAuth();
  const navigate = useNavigate();
  const notify = useNotification();

  const [users, setUsers] = useState<UserFetch[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const tempOffset = useRef(0);

  const {
    page, setPage,
    rowsPerPage, setRowsPerPage,
    search, setSearch,
    searchBy, setSearchBy,
    filter, setFilter,
    orderBy, setOrderBy
  } = useUserListParams(role, { page: 0, rowsPerPage: 5, search: "", searchBy: "firstname", filter: "", orderBy: "ASC" });
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
  }, [isLogged, offset, filter, orderBy, search, role, limit]);

  const getUsers = async () => {
    try {
      const response = await getUser(
        search,
        searchBy,
        limit,
        offset,
        orderBy,
        filter,
        role
      );

      if (!response.data || response.data.totalCount === 0) {
        setUsers([]);
        setTotalCount(0);
        setError(USER_DOES_NOT_FOUND);
        notify(USER_DOES_NOT_FOUND, "error");
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = parseInt(event.target.value, 10);

    const currentOffset = page * rowsPerPage;
    const newPage = Math.floor(currentOffset / newRows);

    setRowsPerPage(newRows);
    setPage(newPage);
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value;


    if (value !== "") {
      if (tempOffset.current === 0) {
        tempOffset.current = page;
      }
      setPage(0);
    } else {
      setPage(tempOffset.current);
      tempOffset.current = 0;
    }

    setSearch(value);
  };
  return (
    <Box>
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <TextField
          label={`Search by ${searchBy}`}
          value={search}
          onChange={handleText}
          variant="outlined"
          size="small"
        />
        <Select
          value={searchBy}
          onChange={(e) => {
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
      </Box >

      {error && (
        <Typography align="center" color="error" mb={2}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box 
        
        >
          <TableHeaderSkeleton rows={limit} columns={4} />
          <TablePagination
            component="div"
            count={0}
            page={0}
            onPageChange={() => { }}
            rowsPerPage={5}
            onRowsPerPageChange={() => { }}
            rowsPerPageOptions={[5, 10, 15]}
            disabled
          />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ tableLayout: "fixed", width: "100%" }}>
              <TableHeader setFilter={setFilter} setOrderBy={setOrderBy} />
              <TableBody>
                {users.map((user) => (
                  <UserRow key={user.id} userData={user} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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

export function TableHeaderSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows: number;
  columns: number;
}) {
  return (
    <Table sx={{ tableLayout: "fixed", width: "100%" }}>
      <TableHeader setFilter={() => { }} setOrderBy={() => { }} />
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            {Array.from({ length: columns }).map((_, colIdx) => {
              return (
                <TableCell key={colIdx} sx={{ minWidth: 120 }}>
                  <Skeleton variant="text" width="100%" height={24} />
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


function useUserListParams(role: string, initialState: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabStates = useRef<Record<string, any>>({});

  const [page, setPage] = useState(searchParams.get("page") || initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(searchParams.get("rowsPerPage") || initialState.rowsPerPage);
  const [search, setSearch] = useState(searchParams.get("search") || initialState.search);
  const [searchBy, setSearchBy] = useState(searchParams.get("searchBy") || initialState.searchBy);
  const [filter, setFilter] = useState(searchParams.get("filter") || initialState.filter);
  const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") || initialState.orderBy);

  // Load previous tab state if exists
  useEffect(() => {
    const state = tabStates.current[role];
    if (state) {
      setPage(state.page);
      setRowsPerPage(state.rowsPerPage);
      setSearch(state.search);
      setSearchBy(state.searchBy);
      setFilter(state.filter);
      setOrderBy(state.orderBy);
    }
  }, [role]);

  // Save current state to tabStates
  useEffect(() => {
    tabStates.current[role] = { page, rowsPerPage, search, searchBy, filter, orderBy };
  }, [role, page, rowsPerPage, search, searchBy, filter, orderBy]);

  // Sync to URL params (conditionally like your snippet)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (page === 0) params.delete("page"); else params.set("page", page.toString());
    if (rowsPerPage === 5) params.delete("rows"); else params.set("rows", rowsPerPage.toString());
    if (search) params.set("search", search); else params.delete("search");
    if (searchBy !== "firstname") params.set("searchBy", searchBy); else params.delete("searchBy");
    if (filter) params.set("filter", filter); else params.delete("filter");
    if (orderBy !== "ASC") params.set("orderBy", orderBy); else params.delete("orderBy");

    if (role !== "user") params.set("tab", role); else params.delete("tab"); // always keep tab

    setSearchParams(params);
  }, [page, rowsPerPage, search, searchBy, filter, orderBy, role]);

  return { page, setPage, rowsPerPage, setRowsPerPage, search, setSearch, searchBy, setSearchBy, filter, setFilter, orderBy, setOrderBy };
}
export default UserList;
