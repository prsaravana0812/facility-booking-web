import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import BannerImage from "../assets/images/banner.jpg";
import GoogleIcon from "../assets/images/google.png";

import AuthApis from "../api/AuthApis";

const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || null;
  const [isAuthenticated, setAuthenticated] = useState(
    token !== "null" ? true : false
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const login = useGoogleLogin({
    onSuccess: (response) => onSuccess(response),
    onError: (error) => onFailure(error),
  });

  const onSuccess = (tokenResponse) => {
    if (tokenResponse?.access_token) {
      AuthApis.login({
        user: { access_token: tokenResponse?.access_token },
      })
        .then((response) => {
          localStorage.setItem("google", JSON.stringify(response.data.data));
          localStorage.setItem("token", response.headers["authorization"]);
          setAuthenticated(true);
          toast.success("You are successfully logged in.");
        })
        .catch((err) => {
          setAuthenticated(false);
          toast.error(err.response.data.error);
        });
    } else {
      setAuthenticated(false);
      toast.error("Authentication failed!");
    }
  };

  const onFailure = (response) => {
    let message = response?.details
      ? "Cookies are not enabled in your browser. Please enable it and try again."
      : "Google login failed";

    if (message !== "") {
      toast.error(message);
    }
  };

  return (
    <>
      <Grid item container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${BannerImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          sx={{ height: "100vh", position: "relative" }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", md: "50%" },
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ marginBottom: "2rem" }}
            >
              Login
            </Typography>
            <Button
              type="button"
              color="primary"
              variant="contained"
              onClick={login}
              sx={{
                color: "#404041 !important",
                backgroundColor: "rgba(255, 255, 255, 0.9) !important",
                width: "100% !important",
                paddingLeft: "0.9rem !important",
                paddingRight: "0.9rem !important",
                display: "grid",
                gridTemplateColumns: "0 12fr",
                textTransform: "none",
              }}
            >
              <img
                src={GoogleIcon}
                alt="Google"
                style={{ width: "24px", height: "24px" }}
              />
              <p>Sign in with Google</p>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
