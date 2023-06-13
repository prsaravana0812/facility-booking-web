import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Box } from "@mui/material";

import Header from "../components/Navbar";
import Calendar from "../components/Calendar";

import AuthApis from "../api/AuthApis";

const EventSchedulePage = () => {
  const token = localStorage.getItem("token") || null;
  const [isAuthenticated, setAuthenticated] = useState(
    token !== "null" ? true : false
  );

  const handleLogout = () => {
    AuthApis.logout()
      .then(() => {
        localStorage.setItem("google", {});
        localStorage.setItem("token", null);
        setAuthenticated(false);
        toast.success("You are successfully logged out.");
      })
      .catch((err) => toast.error(err.response.data.error));
  };

  return (
    <>
      {isAuthenticated ? (
        <Box>
          <Header handleLogout={handleLogout} />
          <Calendar />
        </Box>
      ) : (
        <Navigate to={"/login"} />
      )}
    </>
  );
};

export default EventSchedulePage;
