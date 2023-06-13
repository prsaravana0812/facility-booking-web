import { Routes, Route, useLocation } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import EventSchedulePage from "../pages/EventSchedulePage";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes key={location.pathname} location={location}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<EventSchedulePage />} />
    </Routes>
  );
};

export default AppRoutes;
