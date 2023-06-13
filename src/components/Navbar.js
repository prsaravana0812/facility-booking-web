import React from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/PowerSettingsNew";

const Header = ({ handleLogout }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#13add5" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Facility Booking
          </Typography>
          <IconButton
            style={{
              backgroundColor: "white",
              color: "#13add5",
              width: "2rem",
              height: "2rem",
            }}
            onClick={handleLogout}
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
