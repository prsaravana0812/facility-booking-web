import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token") || null;
const headers = { headers: { Authorization: token } };

const login = async (login_params) => {
  let response = await axios.post(
    `${API_BASE_URL}/users/sign_in`,
    login_params
  );
  return response;
};

const logout = async () => {
  let response = await axios.delete(`${API_BASE_URL}/users/sign_out`, headers);
  return response;
};

const AuthApis = { login, logout };

export default AuthApis;
