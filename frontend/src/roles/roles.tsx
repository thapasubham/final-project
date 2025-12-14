import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Stack,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Refresh } from "../api/refresh/refresh";
import { API_URL } from "../utils/config";
import { getCookie } from "../api/apiHelpers";
import { capitalizeFirst } from "../utils/utils";

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permission: Permission[];
}

// ----------------------
// Axios wrapper with 401 refresh + redirect
// ----------------------
async function WithRefresh(config: any) {
    try {
        const token = getCookie("bearerToken");
        const res = await axios({
            ...config,
            headers: { Authorization: `Bearer ${token}`, ...config.headers },
        });
        return res;
    } catch (err: any) {
        if (err.response?.status === 401) {
            const success = await Refresh();
            if (!success) {
                window.location.href = "/login";
                return;
            }
            const newToken = localStorage.getItem("token");
            const retryRes = await axios({
                ...config,
                headers: { Authorization: `Bearer ${newToken}`, ...config.headers },
            });
            return retryRes;
        } else {
            throw err;
        }
    }
}

export default function RoleAdminPanel() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [newRoleName, setNewRoleName] = useState("");
    const [newRolePermissions, setNewRolePermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchRoles(), fetchPermissions()]);
        setLoading(false);
    };

    const fetchRoles = async () => {
        try {
            const res = await WithRefresh({ method: "GET", url: `${API_URL}/api/roles` });
            console.log(res?.data)
            if (res) setRoles(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPermissions = async () => {
        try {
            const res = await WithRefresh({ method: "GET", url: `${API_URL}/api/permission` });
            if (res) setPermissions(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const createRole = async () => {
        if (!newRoleName || newRolePermissions.length === 0) return;
        try {
            await WithRefresh({
                method: "POST",
                url: `${API_URL}/api/roles`,
                data: {
                    name: newRoleName,
                    permission: newRolePermissions.map((p) => ({ id: p.id })),
                },
            });
            setNewRoleName("");
            setNewRolePermissions([]);
            fetchRoles();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteRole = async (id: number) => {
        try {
            await WithRefresh({ method: "DELETE", url: `${API_URL}/api/roles/${id}` });
            fetchRoles();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Roles Admin Panel
            </Typography>

            {/* Create Role Section */}
            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6">Create New Role</Typography>
                <Stack spacing={2} direction="row" alignItems="center" sx={{ mt: 2 }}>
                    <TextField
                        label="Role Name"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                    />
                    <FormControl sx={{ minWidth: 250 }} variant="outlined">
                        <InputLabel id="permission-label">Permissions</InputLabel>
                        <Select
                            labelId="permission-label"
                            multiple
                            value={newRolePermissions}
                            onChange={(e) => setNewRolePermissions(e.target.value as Permission[])}
                            label="Permissions"
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {(selected as Permission[]).map((perm) => (
                                        <Chip key={perm.id} label={perm.name} />
                                    ))}
                                </Box>
                            )}
                        >
                            {permissions.map((perm) => (
                                <MenuItem key={perm.id} value={perm}>
                                    {perm.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={createRole}>
                        Create
                    </Button>
                </Stack>
            </Paper>

            {/* Roles Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Role Name</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell>{capitalizeFirst(role.name)}</TableCell>
                                <TableCell>
                                    {(role.permission || []).map((perm) => (
                                        <Chip
                                            key={perm.id}
                                            label={perm.name}
                                            size="small"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => deleteRole(role.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
