import { UserFetch, userPayload } from "../../types/user.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import { editUser } from "../../api/user/editUser.ts";
import { FAILED_TO_VERIFY, USER_DELETED, VERIFIED_SUCCESS } from "../../constants/constant.ts";
import { Refresh } from "../../api/refresh/refresh.ts"; // Assuming Refresh is an API call
import { Link } from "react-router-dom";
import deleteUnverified from "../../api/user/deleteUnverified.ts";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { TableRow, TableCell, Typography, Button, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";


interface UserProps {
    userData: UserFetch;
}

function User({ userData }: UserProps) {
    const { permission, userStatus } = useAuth();
    const [retry, setRetry] = useState(0);
    const maxRetry = 1;

    // --- Helper Functions ---

    const refresh = async (response: any): Promise<boolean> => {
        setRetry(prev => prev + 1);

        if (response.status !== 401 || retry >= maxRetry) {
            return false;
        }

        const result = await Refresh(userStatus);

        if (result) {
            // After successful token refresh, re-attempt the original action (verifyUser)
            await verifyUser();
            return true; // Use boolean for clarity
        }
        return false;
    };

    const verifyUser = async () => {
        const payload = { ...userData, isVerified: true }; 
        const response = await editUser(payload);

        if (response.status === 200) {
            alert(VERIFIED_SUCCESS);
        }

        const result = await refresh(response);

        if (!result) {
            alert(FAILED_TO_VERIFY);
        }
       
    };

    const deleteUser = async () => {
        const response = await deleteUnverified(userData.id);
        if (response.status === 204) {
            alert(USER_DELETED);
        }

        const result = await refresh(response);

        if (!result) {
            alert(FAILED_TO_VERIFY);
        }
       
    };



    const CTA = () => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    component={Link} 
                    to={`/editUser/${userData.id}`}
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    color="primary"
                >
                    Edit
                </Button>

                {permission.includes("admin:delete") && (
                    <IconButton
                        onClick={deleteUser} 
                        size="small"
                        color="error"
                        aria-label="Delete User"
                    >
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>
        );
    };

    const Verify = () => {
        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    onClick={verifyUser}
                    variant="contained"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    color="success"
                >
                    Verify
                </Button>

                {permission.includes("admin:delete") && (
                    <Button
                        onClick={deleteUser}
                        variant="outlined"
                        size="small"
                        startIcon={<CloseIcon />}
                        color="error"
                    >
                        Decline
                    </Button>
                )}
            </Box>
        );
    };



   return (
    <TableRow
      hover
      component={RouterLink}         // Make the entire row a link
      to={`/profile/${userData.id}`} // Destination
      sx={{
        textDecoration: 'none',
        color: 'inherit',            // Keep text color
        '&:hover': { backgroundColor: 'action.hover' }
      }}
    >
      <TableCell>
        <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          {userData.firstname}
        </Typography>
      </TableCell>
      <TableCell>{userData.lastname}</TableCell>
      <TableCell>{userData.email}</TableCell>
      <TableCell>{userData.phoneNumber}</TableCell>
    </TableRow>
  );
}

export default User;