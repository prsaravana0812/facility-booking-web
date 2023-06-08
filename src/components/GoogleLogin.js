import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Box } from "@mui/material";

const profileKey = "google";

const GoogleLogin = () => {
  const localStorageValue = localStorage.getItem(profileKey) || null;
  const [googleProfile, setGoogleProfile] = useState(
    localStorageValue !== null ? JSON.parse(localStorageValue) : {}
  );

  const login = useGoogleLogin({
    onSuccess: (response) => onSuccess(response),
    onError: (error) => onFailure(error),
  });

  const onSuccess = (tokenResponse) => {
    if (tokenResponse?.access_token) {
      let userOptions = {
        method: "GET",
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      };

      axios(userOptions)
        .then((userResponse) => {
          localStorage.setItem(profileKey, JSON.stringify(userResponse?.data));
          setGoogleProfile(userResponse?.data);
        })
        .catch(() => {
          toast.error("Authentication failed!");
        });
    } else {
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
      {Object.keys(googleProfile).length > 0 ? (
        <Box sx={{ display: "flex", padding: "0 1.5rem" }}>
          <Box>
            Signed in as <b>{googleProfile?.email}. &nbsp;</b>
          </Box>
          <Box
            onClick={login}
            style={{
              cursor: "pointer",
              color: "blue",
            }}
          >
            Switch account
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", padding: "0 1.5rem" }}>
          <Box
            sx={{
              cursor: "pointer",
              color: "blue",
            }}
            onClick={login}
          >
            Sign in to Google
          </Box>
        </Box>
      )}
    </>
  );
};

export default GoogleLogin;
