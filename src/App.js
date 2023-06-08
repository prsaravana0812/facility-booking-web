import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AppRoutes from "./routes/AppRoutes";

const GOOGLE_APP_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

const App = () => {
  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_APP_ID}>
        <Toaster position="bottom-left" />
        <AppRoutes />
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
