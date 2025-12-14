import { useState } from "react";
import { useAuth } from "../../auth/AuthContext.tsx";
import { Container, Tabs, Tab, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import UserList from "./userList.tsx";

function DashBoard() {
  const { permission } = useAuth();
  const showAdminOptions = permission.includes("admin:delete");


  // Tabs state
  const [tabIndex, setTabIndex] = useState(0);

  // Build tabs dynamically based on roles
  const tabs = [{ label: "User", role: "user" }];
  if (showAdminOptions) {
    tabs.push({ label: "Admin", role: "admin" });
    // tabs.push({ label: "Unverified", role: "unverified" });
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button
        component={Link}
        to="/admin/role"
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Go to Role Panel
      </Button>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>

        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab key={tab.role} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* UserList component */}
      <Box sx={{ mt: 3 }}>
        <UserList role={tabs[tabIndex].role} />
      </Box>
    </Container>
  );
}

export default DashBoard;
